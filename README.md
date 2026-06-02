# WebTickets

Sistema de controle de atendimento em filas para laboratórios médicos.

Projeto desenvolvido em **Ionic + Angular com NgModules**, com backend em **Node.js** e banco **MySQL**.

## Funcionalidades

- Emissão de senhas SP, SG e SE.
- Código no formato YYMMDD-PPSQ.
- Prioridade SP -> SE/SG -> SP.
- Painel com as 5 últimas senhas chamadas.
- Guichês não específicos.
- Descarte automático de 5% por não comparecimento.
- Tempo médio por tipo de senha.
- Expediente das 07h às 17h.
- Relatório resumido e detalhado.

## Imagens do Projeto

> Coloque aqui 3 prints antes de entregar no GitHub:

```md
![Tela inicial](src/assets/tela-1.png)
![Painel](src/assets/tela-2.png)
![Relatório](src/assets/tela-3.png)
```

## Como executar

### Banco

Execute `database/schema.sql` no MySQL Workbench.

### Backend

```powershell
cd backend
npm.cmd install
copy .env.example .env
node server.js
```

Configure sua senha no arquivo `backend/.env`.

### Frontend Ionic

```powershell
npm.cmd install
ionic.cmd serve
```

Abra: `http://localhost:8100`

## Entrega

Crie um repositório público chamado **WebTickets** e envie apenas o link na atividade.
