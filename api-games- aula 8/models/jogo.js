const mongoose = require("mongoose");

const jogoSchema = new mongoose.Schema({
    nome: String,
    categoria: String,
    preco: Number,
    estoque: Number
});

module.exports = mongoose.model("Jogo", jogoSchema);