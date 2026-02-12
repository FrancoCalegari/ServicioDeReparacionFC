const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

const dbPath = path.join(__dirname, "tarjeta.db");
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ─── Create Tables ───
db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    titulo_informe TEXT DEFAULT 'Informe',
    saludo TEXT DEFAULT '',
    tratamiento TEXT DEFAULT '',
    notas TEXT DEFAULT '',
    problema TEXT DEFAULT '',
    telefono TEXT DEFAULT '+54 9 2617735869',
    instagram TEXT DEFAULT '@francocalegari_dw',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/francocalegari_dw',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS apps_instaladas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    icono_url TEXT DEFAULT '',
    link_url TEXT DEFAULT '#',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS fichas_tecnicas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER UNIQUE NOT NULL,
    cpu_nombre TEXT DEFAULT '',
    cpu_potencia TEXT DEFAULT '',
    cpu_fabricante TEXT DEFAULT '',
    cpu_arquitectura TEXT DEFAULT '64 bits',
    gpu_fabricante TEXT DEFAULT '',
    gpu_vram TEXT DEFAULT '',
    gpu_nombre TEXT DEFAULT '',
    ram_capacidad TEXT DEFAULT '',
    ram_slots TEXT DEFAULT '',
    almacenamiento_nombre TEXT DEFAULT '',
    almacenamiento_tipo TEXT DEFAULT '',
    almacenamiento_capacidad TEXT DEFAULT '',
    wifi TEXT DEFAULT '',
    ethernet TEXT DEFAULT '',
    bluetooth TEXT DEFAULT '',
    placa_base TEXT DEFAULT '',
    bios_version TEXT DEFAULT '',
    bios_fecha TEXT DEFAULT '',
    pantalla_specs TEXT DEFAULT '',
    pantalla_tipo TEXT DEFAULT '',
    pantalla_resolucion TEXT DEFAULT '',
    pantalla_refresco TEXT DEFAULT '',
    io_puertos TEXT DEFAULT '',
    so_nombre TEXT DEFAULT '',
    so_distribucion TEXT DEFAULT '',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    img TEXT DEFAULT '',
    gif TEXT DEFAULT '',
    alt TEXT DEFAULT '',
    title TEXT NOT NULL,
    link TEXT DEFAULT '#',
    description TEXT DEFAULT ''
  );
`);

// ─── Seed Admin User ───
const adminExists = db
	.prepare("SELECT id FROM admin_users WHERE username = ?")
	.get("admin");
if (!adminExists) {
	const hashedPass = bcrypt.hashSync("admin123", 10);
	db.prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)").run(
		"admin",
		hashedPass,
	);
	console.log("✅ Admin user created (admin / admin123)");
}

// ─── Seed Clients Data ───
const clientCount = db
	.prepare("SELECT COUNT(*) as count FROM clientes")
	.get().count;
if (clientCount === 0) {
	console.log("🌱 Seeding client data...");

	const insertCliente = db.prepare(`
    INSERT INTO clientes (codigo, nombre, saludo, tratamiento, notas, problema)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

	const insertApp = db.prepare(`
    INSERT INTO apps_instaladas (cliente_id, nombre, icono_url, link_url)
    VALUES (?, ?, ?, ?)
  `);

	const insertFicha = db.prepare(`
    INSERT INTO fichas_tecnicas (
      cliente_id, cpu_nombre, cpu_potencia, cpu_fabricante, cpu_arquitectura,
      gpu_fabricante, gpu_vram, gpu_nombre,
      ram_capacidad, ram_slots,
      almacenamiento_nombre, almacenamiento_tipo, almacenamiento_capacidad,
      wifi, ethernet, bluetooth,
      placa_base, bios_version, bios_fecha,
      pantalla_specs, pantalla_tipo, pantalla_resolucion, pantalla_refresco,
      io_puertos, so_nombre, so_distribucion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

	const seedAll = db.transaction(() => {
		// Cliente 0006 - Lucía
		const c1 = insertCliente.run(
			"0006",
			"Lucía",
			"Hola buenas soy el técnico informático Franco Calegari versión 2024",
			'La PC quedó con "Windows 10 Pro Mini OS (una distribución para el rendimiento), ya viene activado", viene instalado con WinRar, Word, Excel, PowerPoint, Visual Studio Code, DB Browser, Google Chrome y Mem Reduct.\nNo recomiendo utilizar CCleaner ya que hace mucho tiempo dejó de funcionar y causa inestabilidad del sistema. Si se nota trabada la PC, utilizar Mem Reduct donde dice "limpiar memoria"; eso ayudará a la PC a estar en óptimas condiciones.\nNo recomiendo instalar un antivirus ya que esa es la causa de que tenga poco rendimiento.\nTratar de no dejar archivos o muchas cosas en la pantalla principal o escritorio ya que eso ralentiza la computadora cualquier computadora.\nComo un pequeño extra, viene con CS1.6 para pasar el rato.',
			"Si se desactiva Windows o Word/Excel/PowerPoint, me pueden decir; eso viene sin costo adicional jaja.",
			"La computadora presentaba fallas del sistema ademas de requerir una limpieza general y una actualizacion del Software e instalar el paquete Office.",
		);
		insertApp.run(
			c1.lastInsertRowid,
			"Microsoft Office",
			"https://cdn.worldvectorlogo.com/logos/office-2.svg",
			"https://www.microsoft.com/es-ar/microsoft-365/what-is-microsoft-365",
		);
		insertApp.run(
			c1.lastInsertRowid,
			"Counter-Strike",
			"https://cdn2.steamgriddb.com/icon_thumb/9b04d152845ec0a378394003c96da594.png",
			"https://es.wikipedia.org/wiki/Counter-Strike",
		);
		insertFicha.run(
			c1.lastInsertRowid,
			"AMD A6-9225 @2.6 GHz",
			"2.6GHz + Turbo 3.0 GHz",
			"AMD",
			"64 bits",
			"AMD",
			"512mb",
			"AMD Radeon R4 integrada",
			"3,9 GB",
			"2 slots SODIMM",
			"WDC WD5000LPCX-24VHAT0",
			"HDD",
			"500,1 GB",
			"2.4hz y 5.0hz 802.11ac",
			"",
			"4.2",
			"Lenovo IdeaPad S145-15AST",
			"AYCN25WW",
			"5/14/2021",
			"Integrada",
			"LCD",
			"1366 x 768",
			"60hz",
			"Usb 3.1 x3, Hdmi output x1, SD slots x1, 3.5 jack de auriculares x1",
			"Microsoft Windows 10 Pro",
			"Mini Os 10 2024",
		);

		// Cliente 54321
		const c2 = insertCliente.run(
			"54321",
			"Lucía",
			"Hola buenas soy el técnico informático Franco Calegari versión 2024",
			'La PC quedó con dos particiones siendo "C:/sistema" y "D:/Datos" y "Windows 10 Pro Mini OS (una distribución para el rendimiento), ya viene activado", viene instalado con WinRar, Word, Excel, PowerPoint, Visual Studio Code, DB Browser, Google Chrome, 3uTools, Mem Reduct y un visualizador de fotos.\nNo recomiendo utilizar CCleaner ya que hace mucho tiempo dejó de funcionar y causa inestabilidad del sistema. Si se nota trabada la PC, utilizar Mem Reduct donde dice "limpiar memoria"; eso ayudará a la PC a estar en óptimas condiciones.\nNo recomiendo instalar un antivirus ya que esa es la causa de que tenga poco rendimiento.\nTratar de no dejar archivos o muchas cosas en la pantalla principal o escritorio ya que eso ralentiza la computadora cualquier computadora.\nComo un pequeño extra, viene con CS1.6 y Half-Life para pasar el rato.',
			"Si se desactiva Windows o Word/Excel/PowerPoint, me pueden decir; eso viene sin costo adicional jaja.",
			"La computadora presentaba fallas del sistema ademas de requerir una limpieza general y una actualizacion del Software.",
		);
		insertApp.run(
			c2.lastInsertRowid,
			"Microsoft Office",
			"https://cdn.worldvectorlogo.com/logos/office-2.svg",
			"https://www.microsoft.com/es-ar/microsoft-365/what-is-microsoft-365",
		);
		insertApp.run(
			c2.lastInsertRowid,
			"Counter-Strike",
			"https://cdn2.steamgriddb.com/icon_thumb/9b04d152845ec0a378394003c96da594.png",
			"https://es.wikipedia.org/wiki/Counter-Strike",
		);
		insertApp.run(
			c2.lastInsertRowid,
			"Half-Life",
			"https://static-00.iconduck.com/assets.00/half-life-icon-2048x2026-wsttw2zd.png",
			"https://es.wikipedia.org/wiki/Half-Life",
		);
		insertFicha.run(
			c2.lastInsertRowid,
			"Intel(R) Celeron(R) CPU N2806 @ 1.60GHz",
			"1.60GHz + Turbo 2GHz",
			"GenuineIntel",
			"64 bits",
			"Intel Corporation",
			"512mb",
			"Intel(R) HD Graphics",
			"3,9 GB",
			"2 slots SODIMM",
			"HGST HTS545032A7E380",
			"HDD",
			"298,0 GB",
			"2.4hz 802.11n",
			"10gbit",
			"4.1",
			"Intel powered classmate PC",
			"MPBYT10A.10C.0029.2014.0605.1433",
			"5/6/2014",
			"Integrada",
			"",
			"1366 x 768",
			"60hz",
			"Usb 3.1 x2, Hdmi output x1, SD slots x1, Tv antena x1, 3.5 jack de auriculares x1",
			"Microsoft Windows 10 Pro",
			"Mini Os 10 2024",
		);

		// Cliente 64215 - Juliana
		const c3 = insertCliente.run(
			"64215",
			"Juliana",
			"Hola buenas soy el técnico informático Franco Calegari versión 2025",
			"La PC quedo con Windows 10 X64 se instalo lo requerido para poder editar, crear y trabajar tranquila :D",
			"Si se desactiva Windows o Word/Excel/PowerPoint, me pueden decir; eso viene sin costo adicional jaja.",
			"se le cambio el disco HDD por uno SSD 240GB\nLa computadora presentaba fallas del sistema ademas de requerir una limpieza general y una actualizacion del Software.",
		);
		insertApp.run(
			c3.lastInsertRowid,
			"Microsoft Office",
			"https://cdn.worldvectorlogo.com/logos/office-2.svg",
			"https://www.microsoft.com/es-ar/microsoft-365/what-is-microsoft-365",
		);
		insertApp.run(
			c3.lastInsertRowid,
			"Adobe Photoshop",
			"https://logodownload.org/wp-content/uploads/2019/10/adobe-photoshop-logo-2.png",
			"https://es.wikipedia.org/wiki/Adobe_Photoshop",
		);
		insertApp.run(
			c3.lastInsertRowid,
			"SAI",
			"/img/Sai.ico",
			"https://es.m.wikipedia.org/wiki/SAI_(software)",
		);
		insertFicha.run(
			c3.lastInsertRowid,
			"Intel(R) Celeron(R) CPU N2806 @ 1.60GHz",
			"1.60GHz + Turbo 2GHz",
			"GenuineIntel",
			"64 bits",
			"Intel Corporation",
			"512mb",
			"Intel(R) HD Graphics",
			"3,9 GB",
			"2 slots SODIMM",
			"HG-SSD-WAVE(S) 240G",
			"SSD",
			"240,0 GB",
			"2.4hz 802.11n",
			"10gbit",
			"4.1",
			"Intel powered classmate PC",
			"MPBYT10A.10C.0029.2014.0605.1433",
			"5/6/2014",
			"Integrada",
			"",
			"1366 x 768",
			"60hz",
			"Usb 3.1 x2, Hdmi output x1, SD slots x1, Tv antena x1, 3.5 jack de auriculares x1",
			"Microsoft Windows 10 Pro",
			"Mini Os 10 2024",
		);

		// Cliente 6682 - Vero
		const c4 = insertCliente.run(
			"6682",
			"Vero Laptop HP",
			"Hola buenas soy el técnico informático Franco Calegari versión 2024",
			"Se le realizo un cambio de pasta termica 25/10/2024\nSe le cambio el sistema por uno optimizado para dispositivos de escasos recursos, siendo Windwos 10 mini os\nSe le realizo una limpieza superficial al equipo",
			"Si se desactiva Windows o Word/Excel/PowerPoint, me pueden decir; eso viene sin costo adicional jaja.",
			"La computadora presentaba trabas del sistema ademas de requerir una limpieza general y una actualizacion del Software.",
		);
		insertApp.run(
			c4.lastInsertRowid,
			"Microsoft Office",
			"https://cdn.worldvectorlogo.com/logos/office-2.svg",
			"https://www.microsoft.com/es-ar/microsoft-365/what-is-microsoft-365",
		);
		insertFicha.run(
			c4.lastInsertRowid,
			"Intel Celeron N3050",
			"2.1Ghz",
			"Intel",
			"64 bits",
			"Intel",
			"1Gb VRAM",
			"Intel HD Graphics",
			"4Gb",
			"1 Sodim",
			"Samsung 32gb NAND",
			"ssd nand",
			"32gb",
			"2.4hz 802.11n",
			"",
			"4.1",
			"HP Stream Laptop 14-ax0XX",
			"8/12/2016",
			"8/12/2016",
			"1366x768 ips/lcd",
			"",
			"",
			"",
			"Usb 3.1 x3, Hdmi output x1, SD slots x1, 3.5 jack de auriculares x1",
			"Windows 10 22H2",
			"Mini OS v2024.05",
		);
	});

	seedAll();
	console.log("✅ Client data seeded successfully");

	// Seed tips
	const tipsCount = db
		.prepare("SELECT COUNT(*) as count FROM tips")
		.get().count;
	if (tipsCount === 0) {
		const insertTip = db.prepare(
			"INSERT INTO tips (img, gif, alt, title, link, description) VALUES (?, ?, ?, ?, ?, ?)",
		);
		insertTip.run(
			"/img/Miniaturas/Miniatura1.png",
			"/img/Miniatura1.gif",
			"Miniatura 1",
			"Limpia tu PC Regularmente",
			"https://www.youtube.com/watch?v=9OmrBkFzdN4",
			"Mantén tu PC libre de procesos indeseados.",
		);
		insertTip.run(
			"/img/Miniaturas/Miniatura1.png",
			"/img/pixel-trombone.gif",
			"Miniatura 2",
			"Actualiza el Software",
			"#",
			"Asegúrate de tener siempre la última versión del software para mejorar el rendimiento y la seguridad.",
		);
		insertTip.run(
			"/img/Miniaturas/Miniatura1.png",
			"/img/pixel-trombone.gif",
			"Miniatura 3",
			"Usa un Antivirus",
			"#",
			"Protege tu PC contra virus y malware utilizando un buen programa antivirus.",
		);
		insertTip.run(
			"/img/Miniaturas/Miniatura1.png",
			"/img/pixel-trombone.gif",
			"Miniatura 4",
			"Haz Copias de Seguridad",
			"#",
			"Realiza copias de seguridad regularmente para evitar la pérdida de datos importantes.",
		);
		console.log("✅ Tips seeded successfully");
	}
}

module.exports = db;
