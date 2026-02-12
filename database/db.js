const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const dataPath = path.join(__dirname, "data.json");

// ─── Load Data ───
let data;
try {
	data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
} catch {
	data = {
		clientes: [],
		apps_instaladas: [],
		fichas_tecnicas: [],
		admin_users: [],
		tips: [],
		nextId: { clientes: 1, apps_instaladas: 1, fichas_tecnicas: 1 },
	};
}

// ─── Seed Admin User ───
if (!data.admin_users.find((u) => u.username === "admin")) {
	data.admin_users.push({
		id: 1,
		username: "admin",
		password: bcrypt.hashSync("admin123", 10),
	});
	console.log("✅ Admin user created (admin / admin123)");
}

// ─── Helper: Save to disk (best-effort, silent on Vercel) ───
function save() {
	try {
		fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
	} catch {
		// Vercel has read-only filesystem — silently skip
	}
}

// ─── Database API ───
const db = {
	// ── Tips ──
	getTips() {
		return data.tips;
	},

	// ── Admin Users ──
	getAdminUser(username) {
		return data.admin_users.find((u) => u.username === username) || null;
	},

	// ── Clientes ──
	getClientes() {
		return data.clientes
			.map((c) => ({
				...c,
				apps_count: data.apps_instaladas.filter((a) => a.cliente_id === c.id)
					.length,
			}))
			.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
	},

	getCliente(id) {
		return data.clientes.find((c) => c.id === Number(id)) || null;
	},

	getClienteByCodigo(codigo) {
		return data.clientes.find((c) => c.codigo === codigo) || null;
	},

	createCliente({
		codigo,
		nombre,
		saludo,
		tratamiento,
		notas,
		problema,
		apps,
		ficha,
	}) {
		const id = data.nextId.clientes++;
		const now = new Date().toISOString();
		const cliente = {
			id,
			codigo,
			nombre,
			titulo_informe: "Informe",
			saludo: saludo || "",
			tratamiento: tratamiento || "",
			notas: notas || "",
			problema: problema || "",
			telefono: "+54 9 2617735869",
			instagram: "@francocalegari_dw",
			instagram_url: "https://www.instagram.com/francocalegari_dw",
			created_at: now,
			updated_at: now,
		};
		data.clientes.push(cliente);

		// Apps
		if (apps && Array.isArray(apps)) {
			apps.forEach((app) => {
				data.apps_instaladas.push({
					id: data.nextId.apps_instaladas++,
					cliente_id: id,
					nombre: app.nombre,
					icono_url: app.icono_url || "",
					link_url: app.link_url || "#",
				});
			});
		}

		// Ficha técnica
		if (ficha) {
			data.fichas_tecnicas.push({
				id: data.nextId.fichas_tecnicas++,
				cliente_id: id,
				...db._fichaDefaults(ficha),
			});
		}

		save();
		return id;
	},

	updateCliente(
		id,
		{ codigo, nombre, saludo, tratamiento, notas, problema, apps, ficha },
	) {
		id = Number(id);
		const idx = data.clientes.findIndex((c) => c.id === id);
		if (idx === -1) throw new Error("Cliente no encontrado");

		data.clientes[idx] = {
			...data.clientes[idx],
			codigo,
			nombre,
			saludo: saludo || "",
			tratamiento: tratamiento || "",
			notas: notas || "",
			problema: problema || "",
			updated_at: new Date().toISOString(),
		};

		// Replace apps
		data.apps_instaladas = data.apps_instaladas.filter(
			(a) => a.cliente_id !== id,
		);
		if (apps && Array.isArray(apps)) {
			apps.forEach((app) => {
				data.apps_instaladas.push({
					id: data.nextId.apps_instaladas++,
					cliente_id: id,
					nombre: app.nombre,
					icono_url: app.icono_url || "",
					link_url: app.link_url || "#",
				});
			});
		}

		// Replace ficha
		data.fichas_tecnicas = data.fichas_tecnicas.filter(
			(f) => f.cliente_id !== id,
		);
		if (ficha) {
			data.fichas_tecnicas.push({
				id: data.nextId.fichas_tecnicas++,
				cliente_id: id,
				...db._fichaDefaults(ficha),
			});
		}

		save();
	},

	deleteCliente(id) {
		id = Number(id);
		data.clientes = data.clientes.filter((c) => c.id !== id);
		data.apps_instaladas = data.apps_instaladas.filter(
			(a) => a.cliente_id !== id,
		);
		data.fichas_tecnicas = data.fichas_tecnicas.filter(
			(f) => f.cliente_id !== id,
		);
		save();
	},

	// ── Apps ──
	getApps(clienteId) {
		return data.apps_instaladas.filter(
			(a) => a.cliente_id === Number(clienteId),
		);
	},

	// ── Ficha Técnica ──
	getFicha(clienteId) {
		return (
			data.fichas_tecnicas.find((f) => f.cliente_id === Number(clienteId)) ||
			null
		);
	},

	// ── Stats ──
	getStats() {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		return {
			totalClientes: data.clientes.length,
			thisMonth: data.clientes.filter(
				(c) => new Date(c.created_at) >= startOfMonth,
			).length,
			withFicha: data.fichas_tecnicas.length,
			totalApps: data.apps_instaladas.length,
		};
	},

	// ── Internal ──
	_fichaDefaults(f) {
		return {
			cpu_nombre: f.cpu_nombre || "",
			cpu_potencia: f.cpu_potencia || "",
			cpu_fabricante: f.cpu_fabricante || "",
			cpu_arquitectura: f.cpu_arquitectura || "64 bits",
			gpu_fabricante: f.gpu_fabricante || "",
			gpu_vram: f.gpu_vram || "",
			gpu_nombre: f.gpu_nombre || "",
			ram_capacidad: f.ram_capacidad || "",
			ram_slots: f.ram_slots || "",
			almacenamiento_nombre: f.almacenamiento_nombre || "",
			almacenamiento_tipo: f.almacenamiento_tipo || "",
			almacenamiento_capacidad: f.almacenamiento_capacidad || "",
			wifi: f.wifi || "",
			ethernet: f.ethernet || "",
			bluetooth: f.bluetooth || "",
			placa_base: f.placa_base || "",
			bios_version: f.bios_version || "",
			bios_fecha: f.bios_fecha || "",
			pantalla_specs: f.pantalla_specs || "",
			pantalla_tipo: f.pantalla_tipo || "",
			pantalla_resolucion: f.pantalla_resolucion || "",
			pantalla_refresco: f.pantalla_refresco || "",
			io_puertos: f.io_puertos || "",
			so_nombre: f.so_nombre || "",
			so_distribucion: f.so_distribucion || "",
		};
	},
};

module.exports = db;
