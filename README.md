# WebTickets

Sistema de Controle de Atendimento desenvolvido com Ionic Angular, Node.js e MySQL.

## Equipe

* Ruan Miguel Correia dos Santos — 01839500
* Samuel Feliciano da Silva — 01792472
* Gabriel Vieira de Lima — 01801956
* Vinicius Vicente Ferreira — 01799643
* Arthur Alexandre Montenegro Silvestre — 01796891

## Sobre o Projeto

O WebTickets é um sistema de gerenciamento de filas para laboratórios médicos, permitindo a emissão, atendimento e acompanhamento de senhas de forma organizada.

O sistema trabalha com três tipos de senhas:

* SP — Senha Prioritária
* SG — Senha Geral
* SE — Senha para Exames

## Funcionalidades

* Emissão de senhas SP, SG e SE
* Controle de prioridade de atendimento
* Painel com as últimas 5 senhas chamadas
* Controle de guichês
* Relatório resumido
* Relatório detalhado
* Integração com banco de dados MySQL
* Interface responsiva utilizando Ionic Angular

## Tecnologias Utilizadas

* Ionic
* Angular
* TypeScript
* Node.js
* Express
* MySQL

## Estrutura do Projeto

```text
WebTickets
├── backend
├── database
├── src
├── README.md
├── LICENSE
├── package.json
├── angular.json
└── ionic.config.json
```

## Como Executar

### Banco de Dados

Execute o arquivo:

```text
database/schema.sql
```

no MySQL Workbench.

### Backend

```bash
cd backend
npm install
node server.js
```

Configure o arquivo `.env` com os dados do seu MySQL.

### Frontend

```bash
npm install
ionic.cmd serve
```

Acesse:

```text
http://localhost:8100
```

## Licença

Este projeto utiliza a licença MIT.

## Imagens do Projeto

### Tela Principal
<img width="1920" height="1038" alt="tela-principal png" src="https://github.com/user-attachments/assets/fa5f6a00-e026-4772-b71d-cfb3e0a07996" />
### Emissão de Senhas
<img width="1920" height="1030" alt="emissao-senhas png" src="https://github.com/user-attachments/assets/cda97ccf-20ad-4333-bcd1-2407dcc80e48" />
### Painel de Atendimento
<img width="1920" height="1038" alt="painel-atendimento png" src="https://github.com/user-attachments/assets/c96d1bd8-47c5-435a-8b88-005afa9c0648" />
### Relatórios
<img width="1920" height="1030" alt="relatorios png" src="https://github.com/user-attachments/assets/80774ebe-dfae-4a95-8a13-8646bf7d2b07" />
### ENCERRAR EXPEDIENTE
<img width="1920" height="1080" alt="expediente-encerrado png" src="https://github.com/user-attachments/assets/6c6530a6-44bb-49a3-ae3b-f9a21d0787b3" />
### LIMPAR DADOS
<img width="1920" height="1040" alt="dados-apagados png" src="https://github.com/user-attachments/assets/96c198e2-b197-4229-b6ba-3ebb8c0886b5" />

