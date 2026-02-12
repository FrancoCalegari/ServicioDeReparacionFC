const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../database/db");

// ─── Auth Middleware ───
function requireAuth(req, res, next) {
	if (req.session && req.session.adminId) {
		return next();
	}
	res.redirect("/admin/login");
}

// ─── Login Page ───
router.get("/login", (req, res) => {
	res.render("admin/login", { error: null });
});

router.post("/login", (req, res) => {
	const { username, password } = req.body;
	const user = db.getAdminUser(username);

	if (user && bcrypt.compareSync(password, user.password)) {
		req.session.adminId = user.id;
		req.session.adminUser = user.username;
		return res.redirect("/admin");
	}

	res.render("admin/login", { error: "Usuario o contraseña incorrectos" });
});

// ─── Logout ───
router.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/admin/login");
});

// ─── Dashboard ───
router.get("/", requireAuth, (req, res) => {
	const clientes = db.getClientes();
	const stats = db.getStats();

	res.render("admin/dashboard", {
		clientes,
		stats,
		user: req.session.adminUser,
	});
});

// ─── API: Get single client ───
router.get("/api/clientes/:id", requireAuth, (req, res) => {
	const cliente = db.getCliente(req.params.id);
	if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });

	const apps = db.getApps(cliente.id);
	const ficha = db.getFicha(cliente.id);

	res.json({ cliente, apps, ficha });
});

// ─── API: Create client ───
router.post("/api/clientes", requireAuth, (req, res) => {
	try {
		const id = db.createCliente(req.body);
		res.json({ success: true, id });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// ─── API: Update client ───
router.put("/api/clientes/:id", requireAuth, (req, res) => {
	try {
		db.updateCliente(req.params.id, req.body);
		res.json({ success: true });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// ─── API: Delete client ───
router.delete("/api/clientes/:id", requireAuth, (req, res) => {
	try {
		db.deleteCliente(req.params.id);
		res.json({ success: true });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// ─── API: ADB Device Info ───
const { execSync } = require("child_process");

function adbCmd(cmd) {
	try {
		return execSync(`adb ${cmd}`, { timeout: 10000, encoding: "utf-8" }).trim();
	} catch {
		return "";
	}
}

function adbProp(prop) {
	return adbCmd(`shell getprop ${prop}`);
}

// Check ADB connection
router.get("/api/adb/status", requireAuth, (req, res) => {
	try {
		const devices = adbCmd("devices");
		const lines = devices.split("\n").filter((l) => l.includes("\tdevice"));
		if (lines.length > 0) {
			const serial = lines[0].split("\t")[0];
			const model = adbProp("ro.product.model");
			const brand = adbProp("ro.product.brand");
			res.json({
				connected: true,
				serial,
				device: `${brand} ${model}`.trim(),
			});
		} else {
			res.json({
				connected: false,
				message:
					"No hay dispositivos conectados. Conectá el dispositivo y activá la depuración USB.",
			});
		}
	} catch (err) {
		res.json({
			connected: false,
			message: "ADB no disponible. Asegurate de que esté instalado.",
		});
	}
});

// Extract device info via ADB
router.post("/api/adb/extract", requireAuth, (req, res) => {
	try {
		const devices = adbCmd("devices");
		const lines = devices.split("\n").filter((l) => l.includes("\tdevice"));
		if (lines.length === 0) {
			return res.status(400).json({ error: "No hay dispositivos conectados" });
		}

		// ── CPU ──
		const cpuHardware = adbProp("ro.hardware") || adbProp("ro.board.platform");
		const cpuModel =
			adbCmd(
				"shell cat /proc/cpuinfo | grep -i 'Hardware\\|model name' | head -1",
			) || "";
		let cpuNombre = "";
		if (cpuModel.includes(":")) {
			cpuNombre = cpuModel.split(":").slice(1).join(":").trim();
		}
		if (!cpuNombre) cpuNombre = cpuHardware;

		const cpuCores = adbCmd("shell nproc") || "";
		let maxFreq = "";
		const freqRaw = adbCmd(
			"shell cat /sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_max_freq",
		);
		if (freqRaw) {
			const mhz = parseInt(freqRaw) / 1000;
			maxFreq = mhz >= 1000 ? `${(mhz / 1000).toFixed(2)}GHz` : `${mhz}MHz`;
		}
		const cpuPotencia = [maxFreq, cpuCores ? `${cpuCores} núcleos` : ""]
			.filter(Boolean)
			.join(" ");
		const cpuFabricante =
			adbProp("ro.product.brand") || adbProp("ro.product.manufacturer") || "";
		const cpuArquitectura = adbProp("ro.product.cpu.abi") || "64 bits ARM";

		// ── GPU ──
		let gpuNombre =
			adbCmd("shell dumpsys SurfaceFlinger | grep -i 'GLES.*:' | head -1") ||
			"";
		if (gpuNombre.includes(":")) {
			const parts = gpuNombre.split(",");
			gpuNombre =
				parts.length > 1 ? parts[1].trim() : parts[0].split(":").pop().trim();
		}
		const gpuFabricante = adbProp("ro.hardware.egl") || "";

		// ── RAM ──
		const meminfo = adbCmd("shell cat /proc/meminfo | grep MemTotal");
		let ramCapacidad = "";
		if (meminfo) {
			const kbMatch = meminfo.match(/(\d+)/);
			if (kbMatch) {
				const gb = (parseInt(kbMatch[1]) / 1048576).toFixed(1);
				ramCapacidad = `${gb} GB`;
			}
		}

		// ── Almacenamiento ──
		let almCapacidad = "";
		let almNombre = "";
		const dfData = adbCmd("shell df /data | tail -1");
		if (dfData) {
			const parts = dfData.split(/\s+/);
			if (parts.length >= 2) {
				const kb = parseInt(parts[1]);
				if (!isNaN(kb)) {
					const gb = (kb / 1048576).toFixed(0);
					almCapacidad = `${gb}GB`;
				}
			}
			almNombre = "Almacenamiento interno";
		}

		// ── Pantalla ──
		const displayInfo = adbCmd(
			"shell dumpsys display | grep -i 'mBaseDisplayInfo\\|DisplayDeviceInfo'",
		);
		let pantResolucion = "";
		let pantRefresco = "";
		let pantDensity = "";
		const sizeRaw = adbCmd("shell wm size");
		if (sizeRaw) {
			const sizeMatch = sizeRaw.match(/(\d+x\d+)/);
			if (sizeMatch) pantResolucion = sizeMatch[1].replace("x", " x ");
		}
		const densityRaw = adbCmd("shell wm density");
		if (densityRaw) {
			const dMatch = densityRaw.match(/(\d+)/);
			if (dMatch) pantDensity = `${dMatch[1]}dpi`;
		}
		const fpsMatch = displayInfo.match(/(\d+\.?\d*)(?:\s*fps|Hz)/i);
		if (fpsMatch) {
			pantRefresco = `${Math.round(parseFloat(fpsMatch[1]))}hz`;
		}
		const pantSpecs = [adbProp("ro.product.model"), pantDensity]
			.filter(Boolean)
			.join(" - ");

		// ── Conectividad ──
		const wifiInfo = adbCmd("shell dumpsys wifi | grep 'Wi-Fi is'") || "";
		let wifi = "";
		if (wifiInfo.toLowerCase().includes("enabled")) {
			const wifiCap = adbCmd("shell dumpsys wifi | grep -i '802.11'");
			if (wifiCap) wifi = wifiCap.trim().substring(0, 50);
			else wifi = "2.4GHz y 5GHz";
		}
		const btState = adbCmd("shell settings get global bluetooth_on");
		const bluetooth =
			btState === "1" ? "Habilitado" : btState === "0" ? "Deshabilitado" : "";
		const btVersion =
			adbProp("persist.bluetooth.btsnoopenable") !== "" ? "5.0" : "";

		// ── SO ──
		const androidVersion = adbProp("ro.build.version.release");
		const securityPatch = adbProp("ro.build.version.security_patch");
		const buildDisplay = adbProp("ro.build.display.id");
		const soNombre = androidVersion ? `Android ${androidVersion}` : "Android";
		const soDistribucion = [
			buildDisplay,
			securityPatch ? `Parche: ${securityPatch}` : "",
		]
			.filter(Boolean)
			.join(" | ");

		// ── Placa / Modelo ──
		const model = adbProp("ro.product.model");
		const brand = adbProp("ro.product.brand");
		const boardPlatform =
			adbProp("ro.board.platform") || adbProp("ro.hardware");

		res.json({
			success: true,
			deviceName: `${brand} ${model}`.trim(),
			data: {
				cpu_nombre: cpuNombre || boardPlatform,
				cpu_potencia: cpuPotencia,
				cpu_fabricante: cpuFabricante,
				cpu_arquitectura: cpuArquitectura,
				gpu_nombre: gpuNombre,
				gpu_vram: "Compartida",
				gpu_fabricante: gpuFabricante,
				ram_capacidad: ramCapacidad,
				ram_slots: "Integrada (no expandible)",
				almacenamiento_nombre: almNombre,
				almacenamiento_tipo: "eMMC/UFS",
				almacenamiento_capacidad: almCapacidad,
				wifi: wifi,
				ethernet: "",
				bluetooth: btVersion || bluetooth,
				placa_base: `${brand} ${model} (${boardPlatform})`,
				bios_version:
					adbProp("ro.bootimage.build.fingerprint").split("/").pop() || "",
				bios_fecha: adbProp("ro.build.date") || "",
				pantalla_specs: pantSpecs,
				pantalla_tipo: "AMOLED / IPS LCD",
				pantalla_resolucion: pantResolucion,
				pantalla_refresco: pantRefresco,
				io_puertos: "USB-C x1, 3.5mm jack x1",
				so_nombre: soNombre,
				so_distribucion: soDistribucion,
			},
		});
	} catch (err) {
		res.status(500).json({ error: "Error al extraer datos: " + err.message });
	}
});

module.exports = router;
