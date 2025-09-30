const { lerBancoDeDados, salvarBancoDeDados } = require('./database');

// Função para o FUNCIONÁRIO adicionar um novo horário
function adicionarHorarioDisponivel(data, horario) {
    const db = lerBancoDeDados();
    
    const horarioExiste = db.horariosDisponiveis.some(h => h.data === data && h.horario === horario);
    if (horarioExiste) {
        return { sucesso: false, mensagem: "Este horário já foi cadastrado." };
    }

    db.horariosDisponiveis.push({ data, horario, disponivel: true });
    salvarBancoDeDados(db);
    return { sucesso: true, mensagem: `Horário ${data} às ${horario} cadastrado com sucesso!` };
}

// Função para o ALUNO ver os horários
function listarHorariosDisponiveis() {
    const db = lerBancoDeDados();
    return db.horariosDisponiveis.filter(h => h.disponivel);
}

module.exports = { adicionarHorarioDisponivel, listarHorariosDisponiveis };