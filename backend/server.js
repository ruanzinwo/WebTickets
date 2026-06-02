require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "laboratorio_filas",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function hojeYYMMDD() {
  const d = new Date();
  return String(d.getFullYear()).slice(-2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
}

function hojeSQL() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function dentroDoExpediente() {
  const h = new Date().getHours();
  return h >= 7 && h < 17;
}

function tempoAtendimento(tipo) {
  if (tipo === "SP") return Math.floor(Math.random() * 11) + 10;
  if (tipo === "SG") return Math.floor(Math.random() * 7) + 2;
  if (tipo === "SE") return Math.random() <= 0.95 ? 1 : 5;
  return 1;
}

async function getConfig(chave, padrao) {
  const [rows] = await pool.query("SELECT valor FROM configuracoes WHERE chave = ?", [chave]);
  return rows.length ? rows[0].valor : padrao;
}

async function setConfig(chave, valor) {
  await pool.query(
    "INSERT INTO configuracoes (chave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = VALUES(valor)",
    [chave, String(valor)]
  );
}

async function escolherProximaSenha() {
  const ultima = await getConfig("ultima_prioridade", "NAO_INICIADO");
  const ordem = ultima === "SP" ? ["SE", "SG", "SP"] : ["SP", "SE", "SG"];

  for (const tipo of ordem) {
    const [rows] = await pool.query(
      "SELECT * FROM senhas WHERE tipo = ? AND status = 'AGUARDANDO' ORDER BY id ASC LIMIT 1",
      [tipo]
    );
    if (rows.length) return rows[0];
  }
  return null;
}

app.get("/", (req, res) => res.json({ mensagem: "API WebTickets funcionando" }));

app.get("/status", (req, res) => {
  res.json({ api: "online", expedienteAberto: dentroDoExpediente(), horarioServidor: new Date() });
});

app.post("/senhas", async (req, res) => {
  try {
    const { tipo, ignorarExpediente } = req.body;
    if (!["SP", "SG", "SE"].includes(tipo)) return res.status(400).json({ erro: "Tipo inválido." });
    if (!dentroDoExpediente() && !ignorarExpediente) {
      return res.status(403).json({ erro: "Fora do expediente. Atendimento das 07h às 17h." });
    }

    const [seq] = await pool.query(
      "SELECT COUNT(*) + 1 AS prox FROM senhas WHERE tipo = ? AND DATE(data_emissao) = ?",
      [tipo, hojeSQL()]
    );
    const codigo = `${hojeYYMMDD()}-${tipo}${String(seq[0].prox).padStart(2, "0")}`;
    await pool.query(
      "INSERT INTO senhas (codigo, tipo, data_emissao, status) VALUES (?, ?, NOW(), 'AGUARDANDO')",
      [codigo, tipo]
    );
    res.status(201).json({ mensagem: "Senha emitida com sucesso", codigo, tipo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao emitir senha" });
  }
});

app.get("/senhas/aguardando", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT tipo, COUNT(*) quantidade FROM senhas WHERE status='AGUARDANDO' GROUP BY tipo");
    const fila = { SP: 0, SE: 0, SG: 0 };
    rows.forEach(r => fila[r.tipo] = Number(r.quantidade));
    res.json(fila);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar fila" });
  }
});

app.post("/chamar-proxima", async (req, res) => {
  try {
    const { guiche, ignorarExpediente } = req.body;
    if (!guiche) return res.status(400).json({ erro: "Informe o guichê." });
    if (!dentroDoExpediente() && !ignorarExpediente) {
      return res.status(403).json({ erro: "Fora do expediente. Atendimento das 07h às 17h." });
    }

    const senha = await escolherProximaSenha();
    if (!senha) return res.status(404).json({ mensagem: "Não há senhas aguardando." });

    if (Math.random() <= 0.05) {
      await pool.query("UPDATE senhas SET status='DESCARTADA' WHERE id=?", [senha.id]);
      return res.json({ mensagem: "Senha descartada por não comparecimento", senha: senha.codigo, tipo: senha.tipo });
    }

    const tm = tempoAtendimento(senha.tipo);
    await pool.query(
      "UPDATE senhas SET status='ATENDIDA', data_atendimento=NOW(), guiche=?, tempo_atendimento=? WHERE id=?",
      [guiche, tm, senha.id]
    );
    await setConfig("ultima_prioridade", senha.tipo);
    res.json({ mensagem: "Senha chamada com sucesso", senha: senha.codigo, tipo: senha.tipo, guiche, tempoAtendimento: tm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao chamar próxima senha" });
  }
});

app.get("/painel", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT codigo, tipo, guiche, data_atendimento FROM senhas WHERE status='ATENDIDA' ORDER BY data_atendimento DESC LIMIT 5");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar painel" });
  }
});

app.get("/relatorios/resumo", async (req, res) => {
  try {
    const [geral] = await pool.query(`
      SELECT COUNT(*) total_emitidas,
      SUM(status='ATENDIDA') total_atendidas,
      SUM(status='DESCARTADA') total_descartadas,
      ROUND(AVG(CASE WHEN status='ATENDIDA' THEN tempo_atendimento END), 2) tempo_medio_geral
      FROM senhas
    `);
    const [porTipo] = await pool.query(`
      SELECT tipo, COUNT(*) emitidas,
      SUM(status='ATENDIDA') atendidas,
      SUM(status='DESCARTADA') descartadas,
      ROUND(AVG(CASE WHEN status='ATENDIDA' THEN tempo_atendimento END), 2) tempo_medio
      FROM senhas
      GROUP BY tipo
      ORDER BY FIELD(tipo, 'SP', 'SE', 'SG')
    `);
    const [detalhes] = await pool.query("SELECT codigo, tipo, data_emissao, data_atendimento, guiche, status, tempo_atendimento FROM senhas ORDER BY id DESC LIMIT 200");
    res.json({ geral: geral[0], porTipo, detalhes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao gerar relatório" });
  }
});

app.post("/expediente/encerrar", async (req, res) => {
  try {
    const [result] = await pool.query("UPDATE senhas SET status='DESCARTADA' WHERE status='AGUARDANDO'");
    res.json({ mensagem: "Expediente encerrado. Senhas aguardando descartadas.", descartadas: result.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao encerrar expediente" });
  }
});

app.delete("/dev/limpar", async (req, res) => {
  try {
    await pool.query("DELETE FROM senhas");
    await pool.query("ALTER TABLE senhas AUTO_INCREMENT = 1");
    await setConfig("ultima_prioridade", "NAO_INICIADO");
    res.json({ mensagem: "Dados apagados para novo teste." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao limpar dados" });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
