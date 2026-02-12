const express = require("express");
const router = express.Router();
const db = require("../database/db");

// ─── Home Page ───
router.get("/", (req, res) => {
	const tips = db.prepare("SELECT * FROM tips").all();
	res.render("index", { tips });
});

// ─── Search Client API ───
router.get("/api/buscar/:codigo", (req, res) => {
	const cliente = db
		.prepare("SELECT * FROM clientes WHERE codigo = ?")
		.get(req.params.codigo);
	if (cliente) {
		res.json({ found: true, url: `/cliente/${cliente.codigo}` });
	} else {
		res.json({ found: false });
	}
});

// ─── Client Page ───
router.get("/cliente/:codigo", (req, res) => {
	const cliente = db
		.prepare("SELECT * FROM clientes WHERE codigo = ?")
		.get(req.params.codigo);
	if (!cliente) {
		return res.status(404).render("404");
	}

	const apps = db
		.prepare("SELECT * FROM apps_instaladas WHERE cliente_id = ?")
		.all(cliente.id);
	const ficha = db
		.prepare("SELECT * FROM fichas_tecnicas WHERE cliente_id = ?")
		.get(cliente.id);

	res.render("cliente", { cliente, apps, ficha });
});

module.exports = router;
