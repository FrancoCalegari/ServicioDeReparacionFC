const express = require("express");
const router = express.Router();
const db = require("../database/db");

// ─── Home Page ───
router.get("/", (req, res) => {
	const tips = db.getTips();
	res.render("index", { tips });
});

// ─── Search API ───
router.get("/api/buscar/:codigo", (req, res) => {
	const cliente = db.getClienteByCodigo(req.params.codigo);
	if (cliente) {
		res.json({ found: true, url: `/cliente/${cliente.codigo}` });
	} else {
		res.json({ found: false });
	}
});

// ─── Client Page ───
router.get("/cliente/:codigo", (req, res) => {
	const cliente = db.getClienteByCodigo(req.params.codigo);
	if (!cliente) {
		return res.status(404).render("404");
	}

	const apps = db.getApps(cliente.id);
	const ficha = db.getFicha(cliente.id);

	res.render("cliente", { cliente, apps, ficha });
});

module.exports = router;
