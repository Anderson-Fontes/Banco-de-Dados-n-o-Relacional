
const express = require("express");
const router = express.Router();
const Jogo = require("../models/jogo");

// GET /jogos
router.get("/", async (req, res) => {
    try {
        const jogos = await Jogo.find();
        res.json(jogos);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar jogos" });
    }
});

// POST /jogos
router.post("/", async (req, res) => {
    try {
        const jogo = new Jogo(req.body);
        await jogo.save();
        res.status(201).json(jogo);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao criar jogo" });
    }
});

// PUT /jogos/:id: Atualizar um jogo por ID
router.put("/:id", async (req, res) => {
    try {
        const jogoAtualizado = await Jogo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(jogoAtualizado);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao atualizar jogo" });
    }
});

// DELETE /jogos/:id: Remover um jogo por ID
router.delete("/:id", async (req, res) => {
    try {
        await Jogo.findByIdAndDelete(req.params.id);
        res.json({ mensagem: "Jogo removido com sucesso!" });
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao remover jogo" });
    }
});

module.exports = router;