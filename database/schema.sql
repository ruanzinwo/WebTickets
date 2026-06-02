CREATE DATABASE IF NOT EXISTS laboratorio_filas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE laboratorio_filas;

CREATE TABLE IF NOT EXISTS configuracoes (
  chave VARCHAR(100) PRIMARY KEY,
  valor VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS senhas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  tipo ENUM('SP','SG','SE') NOT NULL,
  data_emissao DATETIME NOT NULL,
  data_atendimento DATETIME NULL,
  guiche INT NULL,
  status ENUM('AGUARDANDO','ATENDIDA','DESCARTADA') NOT NULL DEFAULT 'AGUARDANDO',
  tempo_atendimento INT NULL
);

INSERT INTO configuracoes (chave, valor)
VALUES ('ultima_prioridade', 'NAO_INICIADO')
ON DUPLICATE KEY UPDATE valor = valor;
