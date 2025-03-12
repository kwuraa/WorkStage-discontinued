

### Este repositório está arquivado e não receberá mais atualizações, pois migramos o projeto para uma nova tecnologia visando melhorias de performance e manutenção. Para acompanhar as novidades e contribuir, acesse o novo repositório: [https://github.com/kwuraa/WorkStage-New].



# 🖥️ WorkStage - (discontinued)

WorkStage é um aplicativo desenvolvido com Electron Framework para gerenciar o progresso de produção. Ele permite cadastrar produtos, acompanhar suas etapas e visualizar o status em tempo real. Com foco em organização e eficiência, o app visa otimizar o fluxo de trabalho, oferecendo controle simples e prático das fases de produção.

## 🚀 Tecnologias Utilizadas

- **Electron**: Framework para criação de aplicativos desktop com tecnologias web.
- **JavaScript, HTML, CSS**: Para a interface e funcionalidades do aplicativo.

## 🛠️ Funcionalidades

- 📋 Cadastro de produtos para rastreamento do progresso de produção.
- 🔄 Atualização de status de cada etapa de produção.
- 📊 Visualização em tempo real do andamento da produção.

## 📂 Estrutura do Projeto

```
WorkStage/
├── backend/
│   ├── Config/             # Configurações do sistema
│   ├── controllers/        # Lógica de controle e gerenciamento de dados
│   ├── db/                 # Configuração do banco de dados
│   ├── routes/             # Rotas da API
│   ├─ app.js               # Arquivo principal da aplicação
│   └─ package.json         # Dependências e scripts do projeto
├── src/
│   ├── public/             # Arquivos públicos (HTML, CSS, JavaScript para o renderer)
│   │   ├── css/            # Arquivos de estilo
│   │   ├── js/             # Scripts específicos da interface
│   │   └── index.html      # Arquivo principal da interface
├── main.js                 # Arquivo principal que inicializa o Electron
├── preload.js              # Script de preload para expor APIs seguras ao renderer
├── windowManager.js        # Módulo responsável pela criação e gerenciamento das janelas
├── package.json            # Configurações e dependências do projeto
├── package-lock.json       # Travamento de versões das dependências
└── README.md               # Documentação e informações sobre o projeto

```

## 📋 Pré-requisitos

Para executar o WorkStage localmente, você precisará de:

- **Node.js** instalado
- **Electron** instalado globalmente (`npm install -g electron`)

### Passos para rodar o projeto:

1. Clone este repositório:

   ```sh
   git clone https://github.com/kwuraa/WorkStage.git
   cd WorkStage
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Inicie o aplicativo:

   ```sh
   npm start
   ```

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.
