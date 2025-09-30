const { lerBancoDeDados, salvarBancoDeDados } = require('./database');

function cadastrarUsuario(nome, cpf, senha, tipo) {
  const db = lerBancoDeDados();
  if (db.usuarios.some(u => u.cpf === cpf)) {
    console.log('\nErro: CPF já cadastrado.');
    return false;
  }
  db.usuarios.push({ nome, cpf, login: cpf, senha, tipo, agendamento: null });
  salvarBancoDeDados(db);
  console.log(`\nUsuário ${tipo} "${nome}" cadastrado com sucesso!`);
  return true;
}

function autenticarUsuario(login, senha) {
  const db = lerBancoDeDados();
  return db.usuarios.find(u => u.login === login && u.senha === senha);
}

function inicializarAdmin() {
  const db = lerBancoDeDados();
  if (!db.usuarios.some(u => u.login === 'admin')) {
    console.log('Criando usuário padrão "admin"...');
    db.usuarios.push({
      nome: 'Administrador', cpf: '00000000000', login: 'admin', senha: 'admin', tipo: 'funcionario', agendamento: null
    });
    salvarBancoDeDados(db);
  }
}

function listarTodosOsUsuarios() {
    const db = lerBancoDeDados();
    return db.usuarios;
}

function excluirUsuario(cpf) {
    const db = lerBancoDeDados();
    if (cpf === '00000000000') {
        return { sucesso: false, mensagem: "Não é possível excluir o usuário Administrador." };
    }
    const totalUsuariosAntes = db.usuarios.length;
    db.usuarios = db.usuarios.filter(u => u.cpf !== cpf);
    if (db.usuarios.length === totalUsuariosAntes) {
        return { sucesso: false, mensagem: "Usuário não encontrado com o CPF informado." };
    }
    salvarBancoDeDados(db);
    return { sucesso: true, mensagem: "Usuário excluído com sucesso." };
}

function atualizarUsuario(cpf, novosDados) {
    const db = lerBancoDeDados();
    if (cpf === '00000000000') {
        return { sucesso: false, mensagem: "O usuário Administrador não pode ser modificado." };
    }
    const userIndex = db.usuarios.findIndex(u => u.cpf === cpf);
    if (userIndex === -1) {
        return { sucesso: false, mensagem: "Usuário não encontrado com o CPF informado." };
    }
    db.usuarios[userIndex] = { ...db.usuarios[userIndex], ...novosDados };
    salvarBancoDeDados(db);
    return { sucesso: true, mensagem: "Usuário atualizado com sucesso!" };
}

// NOVA FUNÇÃO para o ALUNO reservar um horário
function reservarHorario(cpfAluno, slotEscolhido) {
    const db = lerBancoDeDados();

    const alunoIndex = db.usuarios.findIndex(u => u.cpf === cpfAluno);
    if (db.usuarios[alunoIndex].agendamento) {
        return { sucesso: false, mensagem: "Você já possui uma avaliação agendada." };
    }

    const horarioIndex = db.horariosDisponiveis.findIndex(h => h.data === slotEscolhido.data && h.horario === slotEscolhido.horario);
    if (horarioIndex === -1 || !db.horariosDisponiveis[horarioIndex].disponivel) {
        return { sucesso: false, mensagem: "Desculpe, este horário não está mais disponível." };
    }

    // Marca o horário como indisponível e salva no perfil do aluno
    db.horariosDisponiveis[horarioIndex].disponivel = false;
    db.usuarios[alunoIndex].agendamento = { data: slotEscolhido.data, horario: slotEscolhido.horario };

    salvarBancoDeDados(db);
    return { sucesso: true, mensagem: `Avaliação agendada com sucesso para ${slotEscolhido.data} às ${slotEscolhido.horario}!` };
}

// NOVA FUNÇÃO para o ALUNO cancelar seu agendamento
function cancelarAgendamento(cpfAluno) {
    const db = lerBancoDeDados();

    const alunoIndex = db.usuarios.findIndex(u => u.cpf === cpfAluno);

    // Verifica se o aluno existe e se ele realmente tem um agendamento
    if (alunoIndex === -1 || !db.usuarios[alunoIndex].agendamento) {
        return { sucesso: false, mensagem: "Você não possui um agendamento ativo para cancelar." };
    }

    const { data, horario } = db.usuarios[alunoIndex].agendamento;

    // Torna o slot de horário disponível novamente
    const horarioIndex = db.horariosDisponiveis.findIndex(h => h.data === data && h.horario === horario);
    if (horarioIndex !== -1) {
        db.horariosDisponiveis[horarioIndex].disponivel = true;
    }

    // Remove o agendamento do perfil do aluno
    db.usuarios[alunoIndex].agendamento = null;

    salvarBancoDeDados(db);
    return { sucesso: true, mensagem: "Agendamento cancelado com sucesso!" };
}


// ATUALIZE a linha module.exports
module.exports = { 
    cadastrarUsuario, 
    autenticarUsuario, 
    inicializarAdmin,
    listarTodosOsUsuarios,
    excluirUsuario,
    atualizarUsuario,
    reservarHorario,
    cancelarAgendamento
};