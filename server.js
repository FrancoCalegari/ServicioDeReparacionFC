const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Database Initialization ───
require("./database/db");

// ─── EJS Setup ───
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ─── Middleware ───
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
	session({
		secret: "fc-tarjeta-recomendacion-2024",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
	}),
);

// ─── Routes ───
const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");

app.use("/", publicRoutes);
app.use("/admin", adminRoutes);

// ─── 404 Handler ───
app.use((req, res) => {
	res.status(404).render("404");
});

// ─── Start Server ───
if (process.env.VERCEL) {
	module.exports = app;
} else {
	app.listen(PORT, () => {
		console.log(`\n🚀 Server running at http://localhost:${PORT}`);
		console.log(`📋 Admin dashboard: http://localhost:${PORT}/admin`);
		console.log(`\n`);
	});
}
