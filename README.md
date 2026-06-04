WebTickets

Sistema de Controle de Atendimento desenvolvido com Ionic Angular, Node.js e MySQL.

Equipe
Ruan Miguel Correia dos Santos — 01839500
Samuel Feliciano da Silva — 01792472
Gabriel Vieira de Lima — 01801956
Vinicius Vicente Ferreira — 01799643
Arthur Alexandre Montenegro Silvestre — 01796891
Sobre o Projeto

O WebTickets é um sistema de gerenciamento de filas para laboratórios médicos, permitindo a emissão, atendimento e acompanhamento de senhas de forma organizada.

O sistema trabalha com três tipos de senhas:

SP — Senha Prioritária
SG — Senha Geral
SE — Senha para Exames
Funcionalidades
Emissão de senhas SP, SG e SE
Controle de prioridade de atendimento
Painel com as últimas 5 senhas chamadas
Controle de guichês
Relatório resumido
Relatório detalhado
Integração com banco de dados MySQL
Interface responsiva utilizando Ionic Angular
Tecnologias Utilizadas
Ionic
Angular
TypeScript
Node.js
Express
MySQL
Estrutura do Projeto
WebTickets
├── backend
├── database
├── src
├── README.md
├── LICENSE
├── package.json
├── angular.json
└── ionic.config.json
Como Executar
Banco de Dados

Execute o arquivo:

database/schema.sql

no MySQL Workbench.

Backend
cd backend
npm install
node server.js

Configure o arquivo .env com os dados do seu MySQL.

Frontend
npm install
ionic serve

Acesse:

http://localhost:8100

Imagens do Projeto:

<img width="1920" height="1032" alt="screenshotstela-inicial png" src="https://github.com/user-attachments/assets/2beb2294-a560-474d-95ec-53de508e2bc2" />
<img width="1914" height="1040" alt="screenshotsrelatorio2 png" src="https://github.com/user-attachments/assets/d6a892fe-2a80-4ab3-a2c5-601ae2d7a1ce" />
<img width="1920" height="1038" alt="screenshotsrelatorio png" src="https://github.com/user-attachments/assets/63346a36-6fbc-4c56-9a49-f2b311b462f6" />
<img width="1920" height="1035" alt="screenshotspainel-senhas png" src="https://github.com/user-attachments/assets/99f002c1-756b-4406-bc79-731881a594e3" />



