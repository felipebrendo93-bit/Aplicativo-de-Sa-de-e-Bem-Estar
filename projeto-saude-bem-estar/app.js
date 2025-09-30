const { execSync } = require('child_process');
if (process.platform === 'win32') { try { execSync('chcp 65001'); } catch (e) {} }

const readlineSync = require('readline-sync');
const { cadastrarUsuario, autenticarUsuario, inicializarAdmin, listarTodosOsUsuarios, excluirUsuario, atualizarUsuario, reservarHorario, cancelarAgendamento } = require('./usuarios');
const { adicionarTreino, listarTreinos } = require('./treinos');
const { adicionarHorarioDisponivel, listarHorariosDisponiveis } = require('./agendamentos');

let usuarioLogado = null;

function exibirMenuPrincipal() {
    console.log('\n===== APLICATIVO DE SAÚDE E BEM-ESTAR =====');
    console.log('1. Fazer Login');
    console.log('2. Sair');
    return readlineSync.question('Escolha uma opção: ');
}

function exibirMenuAluno() {
    console.log(`\n--- BEM-VINDO(A), ALUNO(A) ${usuarioLogado.nome} ---`);
    console.log('1. Visualizar treinos');
    console.log('2. Gerenciar minha avaliação física');
    console.log('3. Sair (Logout)');
    return readlineSync.question('Escolha uma opção: ');
}

function exibirMenuFuncionario() {
  console.log(`\n--- BEM-VINDO(A), FUNCIONÁRIO(A) ${usuarioLogado.nome} ---`);
  console.log('1. Cadastrar Novo Usuário');
  console.log('2. Gerenciar Alunos');
  console.log('3. Montar Treinos');
  console.log('4. Cadastrar Horário de Avaliação');
  console.log('5. Sair (Logout)');
  return readlineSync.question('Escolha uma opção: ');
}

function processoDeCadastro() {
    while (true) {
        console.log('\n--- CADASTRO DE NOVO USUÁRIO ---');
        const nome = readlineSync.question('Nome completo: ').trim();
        const cpf = readlineSync.question('CPF (será o login): ').trim();
        const novaSenha = readlineSync.question('Crie uma senha: ', { hideEchoBack: true });
        if (!nome || !cpf || !novaSenha) {
            console.log('\nERRO: Nome, CPF e Senha são campos obrigatórios.');
            readlineSync.keyInPause('Pressione qualquer tecla para tentar novamente...');
            console.clear();
            continue;
        }
        console.log('\nSelecione o tipo de usuário:');
        console.log('1. Aluno');
        console.log('2. Funcionario');
        const tipoOpcao = readlineSync.question('Opção: ').trim();
        let tipo;
        switch (tipoOpcao) {
            case '1': tipo = 'aluno'; break;
            case '2': tipo = 'funcionario'; break;
            default:
                console.log('\nERRO: Opção de tipo inválida.');
                readlineSync.keyInPause('Pressione qualquer tecla para tentar novamente...');
                console.clear();
                continue;
        }
        cadastrarUsuario(nome, cpf, novaSenha, tipo);
        readlineSync.keyInPause('Pressione qualquer tecla para continuar...');
        break;
    }
}

function visualizarTreinos() {
    console.clear();
    console.log('\n--- SUGESTÕES DE TREINOS ---');
    const treinos = listarTreinos();
    if (treinos.length === 0) {
        console.log("Nenhum treino cadastrado por um funcionário ainda.");
        return;
    }
    treinos.forEach(treino => {
        const linkClicavel = `\x1b]8;;${treino.url}\x07${treino.nome}\x1b]8;;\x07`;
        console.log(`\n* ${linkClicavel} (Link: ${treino.url})`);
    });
    console.log('\n----------------------------------------');
}

function processoMontarTreinos() {
    console.clear();
    console.log('\n--- ADICIONAR NOVO VÍDEO DE TREINO ---');
    const nome = readlineSync.question('Nome do vídeo (ex: Treino de Pernas): ').trim();
    const url = readlineSync.question('Cole o link completo do vídeo (URL): ').trim();
    if (!nome || !url) {
        console.log("Erro: Nome e URL são obrigatórios.");
        return;
    }
    const resultado = adicionarTreino(nome, url);
    console.log(resultado.mensagem);
}

function processoAtualizarUsuario() {
    console.clear();
    console.log('\n--- ATUALIZAR USUÁRIO ---');
    const cpf = readlineSync.question('Digite o CPF do usuário a ser atualizado: ').trim();
    const { usuarios } = require('./database').lerBancoDeDados();
    const usuarioParaAtualizar = usuarios.find(u => u.cpf === cpf);
    if (!usuarioParaAtualizar) {
        console.log("Usuário não encontrado.");
        return;
    }
    console.log(`\nO que você deseja atualizar para o usuário ${usuarioParaAtualizar.nome}?`);
    console.log('1. Nome');
    console.log('2. Senha');
    console.log('3. Tipo de Usuário (aluno/funcionario)');
    console.log('4. Cancelar');
    const opcao = readlineSync.question('Escolha uma opção: ');
    let novosDados = {};
    switch (opcao) {
        case '1':
            const novoNome = readlineSync.question(`Nome atual: ${usuarioParaAtualizar.nome}\nDigite o novo nome: `).trim();
            if (novoNome) novosDados.nome = novoNome;
            break;
        case '2':
            const novaSenha = readlineSync.question('Digite a nova senha: ', { hideEchoBack: true });
            if (novaSenha) novosDados.senha = novaSenha;
            break;
        case '3':
            const tipoIndex = readlineSync.keyInSelect(['aluno', 'funcionario'], `Tipo atual: ${usuarioParaAtualizar.tipo}\nSelecione o novo tipo: `);
            if (tipoIndex === 0) novosDados.tipo = 'aluno';
            else if (tipoIndex === 1) novosDados.tipo = 'funcionario';
            else { console.log("Atualização cancelada."); return; }
            break;
        case '4':
            console.log("Operação cancelada.");
            return;
        default:
            console.log("Opção inválida.");
            return;
    }
    if (Object.keys(novosDados).length > 0) {
        const resultado = atualizarUsuario(cpf, novosDados);
        console.log(resultado.mensagem);
    } else {
        console.log("Nenhum dado novo foi fornecido. Operação cancelada.");
    }
}

function processoGerenciarAlunos() {
    while (true) {
        console.clear();
        console.log('\n--- GERENCIAR ALUNOS ---');
        console.log('1. Listar todos os usuários');
        console.log('2. Excluir usuário');
        console.log('3. Atualizar usuário');
        console.log('4. Voltar ao menu anterior');
        const opcao = readlineSync.question('Escolha uma opção: ');
        switch (opcao) {
            case '1':
                const usuarios = listarTodosOsUsuarios();
                console.log('\n--- LISTA DE USUÁRIOS CADASTRADOS ---');
                usuarios.forEach(u => {
                    console.log(`Nome: ${u.nome.padEnd(25)} | CPF: ${u.cpf.padEnd(15)} | Tipo: ${u.tipo}`);
                });
                readlineSync.keyInPause('Pressione qualquer tecla para continuar...');
                break;
            case '2':
                const cpfParaExcluir = readlineSync.question('Digite o CPF do usuário a ser excluído: ').trim();
                const resultadoExcluir = excluirUsuario(cpfParaExcluir);
                console.log(resultadoExcluir.mensagem);
                readlineSync.keyInPause('Pressione qualquer tecla para continuar...');
                break;
            case '3':
                processoAtualizarUsuario();
                readlineSync.keyInPause('Pressione qualquer tecla para continuar...');
                break;
            case '4':
                return;
            default:
                console.log("Opção inválida.");
                readlineSync.keyInPause('Pressione qualquer tecla para continuar...');
                break;
        }
    }
}

function processoCadastroHorario() {
    console.clear();
    console.log('\n--- CADASTRO DE HORÁRIOS DISPONÍVEIS ---');
    const data = readlineSync.question('Digite a data (formato AAAA-MM-DD): ');
    const hora = readlineSync.question('Digite a hora (formato HH:MM): ');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || !/^\d{2}:\d{2}$/.test(hora)) {
        console.log("Formato de data ou hora inválido. Use os formatos AAAA-MM-DD e HH:MM.");
        return;
    }
    const resultado = adicionarHorarioDisponivel(data, hora);
    console.log(resultado.mensagem);
}

function processoAgendamento() {
    console.clear();
    console.log('\n--- MINHA AVALIAÇÃO FÍSICA ---');
    
    const { usuarios } = require('./database').lerBancoDeDados();
    const aluno = usuarios.find(u => u.cpf === usuarioLogado.cpf);

    if (aluno.agendamento) {
        console.log(`Você já possui uma avaliação agendada para:`);
        console.log(`Data: ${aluno.agendamento.data}`);
        console.log(`Horário: ${aluno.agendamento.horario}`);
        
        const querCancelar = readlineSync.keyInYNStrict('\nDeseja cancelar este agendamento?');
        
        if (querCancelar) {
            const resultado = cancelarAgendamento(usuarioLogado.cpf);
            console.log(`\n${resultado.mensagem}`);
        } else {
            console.log("\nOperação cancelada.");
        }
    } else {
        console.log("Você ainda não possui uma avaliação agendada. Veja os horários disponíveis:");
        const horariosVagos = listarHorariosDisponiveis();

        if (horariosVagos.length === 0) {
            console.log("\nDesculpe, não há horários disponíveis no momento. Tente mais tarde.");
            return;
        }

        console.log("\nHorários disponíveis:");
        horariosVagos.forEach((h, i) => {
            console.log(`${i + 1}. Data: ${h.data}, Horário: ${h.horario}`);
        });

        const opcao = readlineSync.question('Escolha o número do horário desejado (ou 0 para cancelar): ');
        const index = parseInt(opcao) - 1;

        if (opcao === '0') {
            console.log("Agendamento cancelado.");
            return;
        }
        if (isNaN(index) || index < 0 || index >= horariosVagos.length) {
            console.log("Opção inválida.");
            return;
        }

        const slotEscolhido = horariosVagos[index];
        const resultado = reservarHorario(usuarioLogado.cpf, slotEscolhido);
        console.log(`\n${resultado.mensagem}`);
    }
}

function main() {
  inicializarAdmin();
  while (true) {
    console.clear();
    if (!usuarioLogado) {
        const opcao = exibirMenuPrincipal();
        switch(opcao) {
            case '1':
                const login = readlineSync.question('Login: ');
                const senha = readlineSync.question('Senha: ', { hideEchoBack: true });
                usuarioLogado = autenticarUsuario(login, senha);
                if (!usuarioLogado) {
                    console.log('\nLogin ou senha inválidos.');
                    readlineSync.keyInPause('Pressione qualquer tecla para continuar...');
                }
                break;
            case '2': return;
            default:
                console.log('\nOpção inválida.');
                readlineSync.keyInPause('Pressione qualquer tecla para continuar...');
        }
    } else {
      if (usuarioLogado.tipo === 'aluno') {
        const opcaoAluno = exibirMenuAluno();
        switch (opcaoAluno) {
            case '1': visualizarTreinos(); break;
            case '2': processoAgendamento(); break;
            case '3': usuarioLogado = null; break;
            default: console.log('\nOpção inválida.'); break;
        }
        if (usuarioLogado) readlineSync.keyInPause('Pressione qualquer tecla para continuar...');
      } else if (usuarioLogado.tipo === 'funcionario') {
        const opcaoFuncionario = exibirMenuFuncionario();
        switch (opcaoFuncionario) {
            case '1': processoDeCadastro(); break;
            case '2': processoGerenciarAlunos(); break;
            case '3': processoMontarTreinos(); break;
            case '4': processoCadastroHorario(); break;
            case '5': usuarioLogado = null; break;
            default:
                console.log('\nOpção inválida.');
                break;
        }
        if(usuarioLogado) readlineSync.keyInPause('Pressione qualquer tecla para continuar...');
      }
    }
  }
}

main();