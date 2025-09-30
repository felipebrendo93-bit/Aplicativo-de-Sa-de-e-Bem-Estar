Projeto: Aplicativo de Saúde e Bem-Estar
Visão Geral
Este é um sistema de console, desenvolvido em Node.js, para simular o gerenciamento das operações de uma academia ou centro de bem-estar. O projeto permite a interação através de dois perfis de usuário (aluno e funcionário), cada um com suas próprias funcionalidades, com todos os dados sendo salvos localmente.

Principais Funcionalidades
Funcionário
Gerenciamento Completo de Usuários:

Cadastrar: Criar novas contas de alunos ou funcionários.

Listar: Visualizar todos os usuários cadastrados no sistema.

Atualizar: Editar nome, senha ou tipo de um usuário existente.

Excluir: Remover um usuário do sistema.

Gerenciamento de Conteúdo:

Montar Treinos: Adicionar novos links de vídeos de treino (com nome e URL) que ficam disponíveis para os alunos.

Gerenciamento de Agenda:

Cadastrar Horários: Disponibilizar novos horários para avaliação física, podendo cadastrar múltiplos dias e horários de uma só vez para um mês inteiro.

Aluno
Acesso a Treinos:

Visualizar a lista dinâmica de treinos cadastrados pelos funcionários. Os links são clicáveis na maioria dos terminais modernos.

Sistema de Agendamento Inteligente:

Acessar um menu que, se não houver agendamento, mostra os horários disponíveis e permite agendar uma avaliação.

Se já houver um agendamento, mostra os detalhes e permite cancelá-lo, tornando o horário vago novamente.

Estrutura dos Arquivos
/projeto-saude-bem-estar/
|-- app.js               # Interface principal, menus e fluxo do usuário
|-- database.js          # Centraliza a leitura e escrita no "banco de dados"
|-- usuarios.js          # Lógica para usuários (login, cadastro, etc.)
|-- treinos.js           # Lógica para os vídeos de treino
|-- agendamentos.js      # Lógica para os horários de avaliação
|-- db.json              # Arquivo que simula o banco de dados (salva os dados)
|-- package.json         # Informações do projeto e dependências
|-- node_modules/        # Pasta das bibliotecas (criada pelo npm)
Como Executar o Projeto
Siga estes passos simples para colocar o sistema para funcionar.

1. Pré-requisitos
Você precisa ter o Node.js instalado no seu computador.

2. Preparação
Coloque todos os arquivos (app.js, database.js, usuarios.js, treinos.js, agendamentos.js) em uma única pasta.

Não crie o db.json, o programa fará isso sozinho.

Abra um terminal diretamente nesta pasta.

Dica para Windows: Navegue até a pasta pelo Explorador de Arquivos, clique na barra de endereço, digite cmd e pressione Enter.

3. Instalação
Com o terminal aberto na pasta correta, execute o seguinte comando para instalar as dependências necessárias:

Bash

npm install readline-sync
4. Execução
Após a instalação, execute o programa com o comando:

Bash

node app.js
Pronto! O programa irá iniciar. Na primeira vez, ele criará o usuário admin (senha: admin) para você poder acessar as funções de funcionário.