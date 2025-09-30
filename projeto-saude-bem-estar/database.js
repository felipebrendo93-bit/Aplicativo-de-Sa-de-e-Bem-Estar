const fs = require('fs');
const dbPath = './db.json';

// Função para ler o banco de dados inteiro de forma segura
function lerBancoDeDados() {
    try {
        if (fs.existsSync(dbPath)) {
            const dados = fs.readFileSync(dbPath, 'utf-8');
            // Verifica se o arquivo não está vazio antes de fazer o parse
            if (dados.length === 0) {
                return { usuarios: [], treinos: [], agendamentos: [] }; // Adicionado agendamentos para consistência
            }
            return JSON.parse(dados);
        }
    } catch (error) {
        console.error("Erro ao ler o banco de dados:", error);
    }
    // Se o arquivo não existe ou deu erro, retorna uma estrutura padrão
    return { usuarios: [], treinos: [], agendamentos: [] };
}

// Função para salvar o banco de dados inteiro
function salvarBancoDeDados(dados) {
    fs.writeFileSync(dbPath, JSON.stringify(dados, null, 2));
}

module.exports = { lerBancoDeDados, salvarBancoDeDados };