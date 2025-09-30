const { lerBancoDeDados, salvarBancoDeDados } = require('./database');

function adicionarTreino(nome, url) {
    const db = lerBancoDeDados();

    const urlExiste = db.treinos.some(t => t.url.toLowerCase() === url.toLowerCase());
    if (urlExiste) {
        return { sucesso: false, mensagem: "Erro: Este link de treino já foi cadastrado." };
    }

    db.treinos.push({ nome, url });
    salvarBancoDeDados(db);
    return { sucesso: true, mensagem: `Treino "${nome}" cadastrado com sucesso!` };
}

function listarTreinos() {
    const db = lerBancoDeDados();
    return db.treinos;
}

module.exports = { adicionarTreino, listarTreinos };