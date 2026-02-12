// ─── FC Admin Dashboard JS ───

document.addEventListener("DOMContentLoaded", () => {
	// ─── DOM Elements ───
	const sidebar = document.getElementById("sidebar");
	const sidebarToggle = document.getElementById("sidebarToggle");
	const clientModal = document.getElementById("clientModal");
	const closeModal = document.getElementById("closeModal");
	const cancelBtn = document.getElementById("cancelBtn");
	const clientForm = document.getElementById("clientForm");
	const btnAdd = document.getElementById("btnAdd");
	const deleteModal = document.getElementById("deleteModal");
	const cancelDelete = document.getElementById("cancelDelete");
	const confirmDelete = document.getElementById("confirmDelete");
	const searchInput = document.getElementById("searchInput");
	const addAppBtn = document.getElementById("addAppBtn");
	const appsContainer = document.getElementById("appsContainer");
	const toast = document.getElementById("toast");
	const toastMsg = document.getElementById("toastMsg");

	let deleteTargetId = null;

	// ─── Device Templates ───
	const deviceTemplates = {
		android: {
			cpu_nombre: "Qualcomm Snapdragon 680",
			cpu_potencia: "2.4GHz Octa-Core",
			cpu_fabricante: "Qualcomm",
			cpu_arquitectura: "64 bits ARM",
			gpu_nombre: "Adreno 610",
			gpu_vram: "Compartida",
			gpu_fabricante: "Qualcomm",
			ram_capacidad: "4GB",
			ram_slots: "Integrada (no expandible)",
			almacenamiento_nombre: "Almacenamiento interno",
			almacenamiento_tipo: "eMMC/UFS",
			almacenamiento_capacidad: "128GB",
			wifi: "2.4GHz y 5GHz 802.11ac",
			ethernet: "",
			bluetooth: "5.0",
			placa_base: "",
			bios_version: "",
			bios_fecha: "",
			pantalla_specs: "Integrada",
			pantalla_tipo: "IPS LCD",
			pantalla_resolucion: "1080 x 2400",
			pantalla_refresco: "90hz",
			io_puertos: "USB-C x1, 3.5mm jack x1",
			so_nombre: "Android 14",
			so_distribucion: "Stock / OneUI / MIUI",
		},
		pc: {
			cpu_nombre: "Intel Core i5-12400",
			cpu_potencia: "2.5GHz + Turbo 4.4GHz",
			cpu_fabricante: "Intel",
			cpu_arquitectura: "64 bits",
			gpu_nombre: "Intel UHD Graphics 730",
			gpu_vram: "1GB compartida",
			gpu_fabricante: "Intel",
			ram_capacidad: "8GB DDR4",
			ram_slots: "2 slots DIMM",
			almacenamiento_nombre: "SSD NVMe",
			almacenamiento_tipo: "SSD NVMe M.2",
			almacenamiento_capacidad: "500GB",
			wifi: "2.4GHz y 5GHz 802.11ac",
			ethernet: "1Gbit RJ45",
			bluetooth: "5.1",
			placa_base: "",
			bios_version: "",
			bios_fecha: "",
			pantalla_specs: "Monitor externo",
			pantalla_tipo: "IPS",
			pantalla_resolucion: "1920 x 1080",
			pantalla_refresco: "75hz",
			io_puertos:
				"USB 3.0 x4, USB 2.0 x2, HDMI x1, DisplayPort x1, RJ45 x1, 3.5mm x1",
			so_nombre: "Microsoft Windows 10 Pro",
			so_distribucion: "Mini OS 10 2024",
		},
		iphone: {
			cpu_nombre: "Apple A16 Bionic",
			cpu_potencia: "3.46GHz Hexa-Core",
			cpu_fabricante: "Apple",
			cpu_arquitectura: "64 bits ARM",
			gpu_nombre: "Apple GPU (5 núcleos)",
			gpu_vram: "Compartida",
			gpu_fabricante: "Apple",
			ram_capacidad: "6GB",
			ram_slots: "Integrada (no expandible)",
			almacenamiento_nombre: "Almacenamiento interno NVMe",
			almacenamiento_tipo: "NVMe",
			almacenamiento_capacidad: "128GB",
			wifi: "2.4GHz y 5GHz Wi-Fi 6 (802.11ax)",
			ethernet: "",
			bluetooth: "5.3",
			placa_base: "Placa Apple integrada",
			bios_version: "",
			bios_fecha: "",
			pantalla_specs: "Super Retina XDR",
			pantalla_tipo: "OLED",
			pantalla_resolucion: "1179 x 2556",
			pantalla_refresco: "60hz",
			io_puertos: "Lightning / USB-C x1",
			so_nombre: "iOS 17",
			so_distribucion: "Apple iOS",
		},
		ipad: {
			cpu_nombre: "Apple M1",
			cpu_potencia: "3.2GHz Octa-Core",
			cpu_fabricante: "Apple",
			cpu_arquitectura: "64 bits ARM",
			gpu_nombre: "Apple M1 GPU (8 núcleos)",
			gpu_vram: "Compartida",
			gpu_fabricante: "Apple",
			ram_capacidad: "8GB",
			ram_slots: "Integrada (no expandible)",
			almacenamiento_nombre: "Almacenamiento interno NVMe",
			almacenamiento_tipo: "NVMe",
			almacenamiento_capacidad: "256GB",
			wifi: "2.4GHz y 5GHz Wi-Fi 6 (802.11ax)",
			ethernet: "",
			bluetooth: "5.0",
			placa_base: "Placa Apple integrada",
			bios_version: "",
			bios_fecha: "",
			pantalla_specs: "Liquid Retina",
			pantalla_tipo: "IPS LED",
			pantalla_resolucion: "2360 x 1640",
			pantalla_refresco: "60hz",
			io_puertos: "USB-C x1, Smart Connector",
			so_nombre: "iPadOS 17",
			so_distribucion: "Apple iPadOS",
		},
		mac: {
			cpu_nombre: "Apple M2",
			cpu_potencia: "3.49GHz Octa-Core",
			cpu_fabricante: "Apple",
			cpu_arquitectura: "64 bits ARM",
			gpu_nombre: "Apple M2 GPU (10 núcleos)",
			gpu_vram: "Compartida (memoria unificada)",
			gpu_fabricante: "Apple",
			ram_capacidad: "8GB Memoria Unificada",
			ram_slots: "Integrada (no expandible)",
			almacenamiento_nombre: "Apple SSD NVMe",
			almacenamiento_tipo: "SSD NVMe",
			almacenamiento_capacidad: "256GB",
			wifi: "2.4GHz y 5GHz Wi-Fi 6 (802.11ax)",
			ethernet: "",
			bluetooth: "5.3",
			placa_base: "Apple M2 SoC",
			bios_version: "",
			bios_fecha: "",
			pantalla_specs: "Liquid Retina",
			pantalla_tipo: "IPS LED",
			pantalla_resolucion: "2560 x 1664",
			pantalla_refresco: "60hz",
			io_puertos: "MagSafe x1, Thunderbolt/USB-C x2, 3.5mm x1",
			so_nombre: "macOS Sonoma",
			so_distribucion: "Apple macOS",
		},
	};

	// ─── Template Click Handler ───
	function applyTemplate(templateName) {
		const tpl = deviceTemplates[templateName];
		if (!tpl) return;

		const fieldMap = {
			cpu_nombre: "ft_cpu_nombre",
			cpu_potencia: "ft_cpu_potencia",
			cpu_fabricante: "ft_cpu_fabricante",
			cpu_arquitectura: "ft_cpu_arquitectura",
			gpu_nombre: "ft_gpu_nombre",
			gpu_vram: "ft_gpu_vram",
			gpu_fabricante: "ft_gpu_fabricante",
			ram_capacidad: "ft_ram_capacidad",
			ram_slots: "ft_ram_slots",
			almacenamiento_nombre: "ft_almacenamiento_nombre",
			almacenamiento_tipo: "ft_almacenamiento_tipo",
			almacenamiento_capacidad: "ft_almacenamiento_capacidad",
			wifi: "ft_wifi",
			ethernet: "ft_ethernet",
			bluetooth: "ft_bluetooth",
			placa_base: "ft_placa_base",
			bios_version: "ft_bios_version",
			bios_fecha: "ft_bios_fecha",
			pantalla_specs: "ft_pantalla_specs",
			pantalla_tipo: "ft_pantalla_tipo",
			pantalla_resolucion: "ft_pantalla_resolucion",
			pantalla_refresco: "ft_pantalla_refresco",
			io_puertos: "ft_io_puertos",
			so_nombre: "ft_so_nombre",
			so_distribucion: "ft_so_distribucion",
		};

		Object.entries(fieldMap).forEach(([key, inputId]) => {
			const el = document.getElementById(inputId);
			if (el) el.value = tpl[key] || "";
		});

		// Update active state on buttons
		document
			.querySelectorAll(".template-btn")
			.forEach((b) => b.classList.remove("active"));
		const activeBtn = document.querySelector(
			`.template-btn[data-template="${templateName}"]`,
		);
		if (activeBtn) activeBtn.classList.add("active");

		showToast(`Plantilla "${templateName.toUpperCase()}" aplicada`);

		// Show/hide ADB panel
		const adbPanel = document.getElementById("adbPanel");
		if (adbPanel) {
			if (templateName === "android") {
				adbPanel.style.display = "block";
			} else {
				adbPanel.style.display = "none";
			}
		}
	}

	document.querySelectorAll(".template-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			applyTemplate(btn.dataset.template);
		});
	});

	// ─── ADB Integration ───
	const adbPanel = document.getElementById("adbPanel");
	const btnAdbCheck = document.getElementById("btnAdbCheck");
	const btnAdbExtract = document.getElementById("btnAdbExtract");
	const adbLog = document.getElementById("adbLog");
	const adbLogBody = document.getElementById("adbLogBody");
	const adbStatusDot = adbPanel ? adbPanel.querySelector(".adb-dot") : null;
	const adbStatusText = document.getElementById("adbStatusText");

	function addLogLine(text, type = "info") {
		const icons = {
			success: "✓",
			info: "●",
			warning: "⚠",
			error: "✗",
		};
		const line = document.createElement("div");
		line.className = `adb-log-line ${type}`;
		line.innerHTML = `<span class="log-icon">${icons[type] || "●"}</span> ${text}`;
		adbLogBody.appendChild(line);
		adbLogBody.scrollTop = adbLogBody.scrollHeight;
	}

	if (btnAdbCheck) {
		btnAdbCheck.addEventListener("click", async () => {
			btnAdbCheck.classList.add("loading");
			btnAdbCheck.querySelector("i").className = "fa-solid fa-spinner";
			btnAdbCheck.querySelector("span").textContent = "Verificando...";

			try {
				const res = await fetch("/admin/api/adb/status");
				const data = await res.json();

				if (data.connected) {
					adbStatusDot.className = "adb-dot connected";
					adbStatusText.textContent = data.device || "Conectado";
					btnAdbExtract.disabled = false;
					showToast(`Dispositivo encontrado: ${data.device}`);
				} else {
					adbStatusDot.className = "adb-dot disconnected";
					adbStatusText.textContent = "Desconectado";
					btnAdbExtract.disabled = true;
					showToast(data.message || "Sin dispositivo", true);
				}
			} catch (err) {
				adbStatusDot.className = "adb-dot disconnected";
				adbStatusText.textContent = "Error";
				btnAdbExtract.disabled = true;
				showToast("Error al verificar ADB", true);
			}

			btnAdbCheck.classList.remove("loading");
			btnAdbCheck.querySelector("i").className = "fa-solid fa-plug";
			btnAdbCheck.querySelector("span").textContent = "Verificar Conexión";
		});
	}

	if (btnAdbExtract) {
		btnAdbExtract.addEventListener("click", async () => {
			btnAdbExtract.classList.add("loading");
			btnAdbExtract.querySelector("i").className = "fa-solid fa-spinner";
			btnAdbExtract.querySelector("span").textContent = "Extrayendo...";

			adbLog.style.display = "block";
			adbLogBody.innerHTML = "";

			addLogLine("Conectando con dispositivo via ADB...", "info");

			try {
				const res = await fetch("/admin/api/adb/extract", { method: "POST" });
				const data = await res.json();

				if (data.error) {
					addLogLine(`Error: ${data.error}`, "error");
					showToast(data.error, true);
				} else {
					addLogLine(`Dispositivo: ${data.deviceName}`, "success");

					// Apply data to form fields
					const fieldMap = {
						cpu_nombre: "ft_cpu_nombre",
						cpu_potencia: "ft_cpu_potencia",
						cpu_fabricante: "ft_cpu_fabricante",
						cpu_arquitectura: "ft_cpu_arquitectura",
						gpu_nombre: "ft_gpu_nombre",
						gpu_vram: "ft_gpu_vram",
						gpu_fabricante: "ft_gpu_fabricante",
						ram_capacidad: "ft_ram_capacidad",
						ram_slots: "ft_ram_slots",
						almacenamiento_nombre: "ft_almacenamiento_nombre",
						almacenamiento_tipo: "ft_almacenamiento_tipo",
						almacenamiento_capacidad: "ft_almacenamiento_capacidad",
						wifi: "ft_wifi",
						ethernet: "ft_ethernet",
						bluetooth: "ft_bluetooth",
						placa_base: "ft_placa_base",
						bios_version: "ft_bios_version",
						bios_fecha: "ft_bios_fecha",
						pantalla_specs: "ft_pantalla_specs",
						pantalla_tipo: "ft_pantalla_tipo",
						pantalla_resolucion: "ft_pantalla_resolucion",
						pantalla_refresco: "ft_pantalla_refresco",
						io_puertos: "ft_io_puertos",
						so_nombre: "ft_so_nombre",
						so_distribucion: "ft_so_distribucion",
					};

					const labels = {
						cpu_nombre: "CPU",
						gpu_nombre: "GPU",
						ram_capacidad: "RAM",
						almacenamiento_capacidad: "Almacenamiento",
						pantalla_resolucion: "Pantalla",
						so_nombre: "Sistema Operativo",
					};

					let filled = 0;
					Object.entries(fieldMap).forEach(([key, inputId]) => {
						const value = data.data[key] || "";
						const el = document.getElementById(inputId);
						if (el && value) {
							el.value = value;
							filled++;
							// Log important fields
							if (labels[key]) {
								addLogLine(`${labels[key]}: ${value}`, "success");
							}
						}
					});

					addLogLine(`${filled} campos completados`, "success");
					showToast(`Datos extraídos de ${data.deviceName}`);
				}
			} catch (err) {
				addLogLine("Error de conexión con el servidor", "error");
				showToast("Error al extraer datos", true);
			}

			btnAdbExtract.classList.remove("loading");
			btnAdbExtract.querySelector("i").className = "fa-solid fa-download";
			btnAdbExtract.querySelector("span").textContent = "Extraer Información";
		});
	}

	// ─── Sidebar Toggle ───
	if (sidebarToggle) {
		sidebarToggle.addEventListener("click", () => {
			sidebar.classList.toggle("open");
		});
	}

	// ─── Search Table ───
	if (searchInput) {
		searchInput.addEventListener("input", () => {
			const query = searchInput.value.toLowerCase();
			const rows = document.querySelectorAll("#clientesTable tbody tr");
			rows.forEach((row) => {
				const text = row.textContent.toLowerCase();
				row.style.display = text.includes(query) ? "" : "none";
			});
		});
	}

	// ─── Open Modal: New Client ───
	if (btnAdd) {
		btnAdd.addEventListener("click", () => {
			resetForm();
			document.getElementById("modalTitle").innerHTML =
				'<i class="fa-solid fa-user-plus"></i> Nuevo Cliente';
			clientModal.classList.add("active");
		});
	}

	// ─── Close Modal ───
	function closeClientModal() {
		clientModal.classList.remove("active");
	}

	if (closeModal) closeModal.addEventListener("click", closeClientModal);
	if (cancelBtn) cancelBtn.addEventListener("click", closeClientModal);
	clientModal.addEventListener("click", (e) => {
		if (e.target === clientModal) closeClientModal();
	});

	// ─── Edit Client ───
	document.querySelectorAll(".btn-edit").forEach((btn) => {
		btn.addEventListener("click", async () => {
			const id = btn.dataset.id;
			try {
				const res = await fetch(`/admin/api/clientes/${id}`);
				const data = await res.json();

				document.getElementById("editId").value = id;
				document.getElementById("modalTitle").innerHTML =
					'<i class="fa-solid fa-pen"></i> Editar Cliente';

				// Fill basic info
				document.getElementById("f_codigo").value = data.cliente.codigo;
				document.getElementById("f_nombre").value = data.cliente.nombre;
				document.getElementById("f_saludo").value = data.cliente.saludo || "";
				document.getElementById("f_tratamiento").value =
					data.cliente.tratamiento || "";
				document.getElementById("f_problema").value =
					data.cliente.problema || "";
				document.getElementById("f_notas").value = data.cliente.notas || "";

				// Fill apps
				appsContainer.innerHTML = "";
				if (data.apps && data.apps.length > 0) {
					data.apps.forEach((app) =>
						addAppRow(app.nombre, app.icono_url, app.link_url),
					);
				}

				// Fill ficha técnica
				if (data.ficha) {
					const f = data.ficha;
					document.getElementById("ft_cpu_nombre").value = f.cpu_nombre || "";
					document.getElementById("ft_cpu_potencia").value =
						f.cpu_potencia || "";
					document.getElementById("ft_cpu_fabricante").value =
						f.cpu_fabricante || "";
					document.getElementById("ft_cpu_arquitectura").value =
						f.cpu_arquitectura || "64 bits";
					document.getElementById("ft_gpu_nombre").value = f.gpu_nombre || "";
					document.getElementById("ft_gpu_vram").value = f.gpu_vram || "";
					document.getElementById("ft_gpu_fabricante").value =
						f.gpu_fabricante || "";
					document.getElementById("ft_ram_capacidad").value =
						f.ram_capacidad || "";
					document.getElementById("ft_ram_slots").value = f.ram_slots || "";
					document.getElementById("ft_almacenamiento_nombre").value =
						f.almacenamiento_nombre || "";
					document.getElementById("ft_almacenamiento_tipo").value =
						f.almacenamiento_tipo || "";
					document.getElementById("ft_almacenamiento_capacidad").value =
						f.almacenamiento_capacidad || "";
					document.getElementById("ft_wifi").value = f.wifi || "";
					document.getElementById("ft_ethernet").value = f.ethernet || "";
					document.getElementById("ft_bluetooth").value = f.bluetooth || "";
					document.getElementById("ft_placa_base").value = f.placa_base || "";
					document.getElementById("ft_bios_version").value =
						f.bios_version || "";
					document.getElementById("ft_bios_fecha").value = f.bios_fecha || "";
					document.getElementById("ft_pantalla_specs").value =
						f.pantalla_specs || "";
					document.getElementById("ft_pantalla_tipo").value =
						f.pantalla_tipo || "";
					document.getElementById("ft_pantalla_resolucion").value =
						f.pantalla_resolucion || "";
					document.getElementById("ft_pantalla_refresco").value =
						f.pantalla_refresco || "";
					document.getElementById("ft_io_puertos").value = f.io_puertos || "";
					document.getElementById("ft_so_nombre").value = f.so_nombre || "";
					document.getElementById("ft_so_distribucion").value =
						f.so_distribucion || "";
				}

				clientModal.classList.add("active");
			} catch (err) {
				showToast("Error al cargar datos del cliente", true);
			}
		});
	});

	// ─── Delete Client ───
	document.querySelectorAll(".btn-delete").forEach((btn) => {
		btn.addEventListener("click", () => {
			deleteTargetId = btn.dataset.id;
			const nombre = btn.dataset.nombre;
			document.getElementById("deleteMsg").textContent =
				`¿Estás seguro de que deseas eliminar a "${nombre}"? Esta acción no se puede deshacer.`;
			deleteModal.classList.add("active");
		});
	});

	if (cancelDelete) {
		cancelDelete.addEventListener("click", () => {
			deleteModal.classList.remove("active");
			deleteTargetId = null;
		});
	}

	deleteModal.addEventListener("click", (e) => {
		if (e.target === deleteModal) {
			deleteModal.classList.remove("active");
			deleteTargetId = null;
		}
	});

	if (confirmDelete) {
		confirmDelete.addEventListener("click", async () => {
			if (!deleteTargetId) return;
			try {
				const res = await fetch(`/admin/api/clientes/${deleteTargetId}`, {
					method: "DELETE",
				});
				const data = await res.json();
				if (data.success) {
					showToast("Cliente eliminado correctamente");
					setTimeout(() => location.reload(), 800);
				} else {
					showToast("Error al eliminar", true);
				}
			} catch {
				showToast("Error al eliminar", true);
			}
			deleteModal.classList.remove("active");
		});
	}

	// ─── Form Submit ───
	if (clientForm) {
		clientForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			const editId = document.getElementById("editId").value;
			const isEdit = !!editId;

			// Collect apps
			const apps = [];
			document.querySelectorAll(".app-row").forEach((row) => {
				const inputs = row.querySelectorAll("input");
				if (inputs[0].value.trim()) {
					apps.push({
						nombre: inputs[0].value.trim(),
						icono_url: inputs[1].value.trim(),
						link_url: inputs[2].value.trim() || "#",
					});
				}
			});

			// Collect ficha
			const ficha = {
				cpu_nombre: document.getElementById("ft_cpu_nombre").value,
				cpu_potencia: document.getElementById("ft_cpu_potencia").value,
				cpu_fabricante: document.getElementById("ft_cpu_fabricante").value,
				cpu_arquitectura: document.getElementById("ft_cpu_arquitectura").value,
				gpu_nombre: document.getElementById("ft_gpu_nombre").value,
				gpu_vram: document.getElementById("ft_gpu_vram").value,
				gpu_fabricante: document.getElementById("ft_gpu_fabricante").value,
				ram_capacidad: document.getElementById("ft_ram_capacidad").value,
				ram_slots: document.getElementById("ft_ram_slots").value,
				almacenamiento_nombre: document.getElementById(
					"ft_almacenamiento_nombre",
				).value,
				almacenamiento_tipo: document.getElementById("ft_almacenamiento_tipo")
					.value,
				almacenamiento_capacidad: document.getElementById(
					"ft_almacenamiento_capacidad",
				).value,
				wifi: document.getElementById("ft_wifi").value,
				ethernet: document.getElementById("ft_ethernet").value,
				bluetooth: document.getElementById("ft_bluetooth").value,
				placa_base: document.getElementById("ft_placa_base").value,
				bios_version: document.getElementById("ft_bios_version").value,
				bios_fecha: document.getElementById("ft_bios_fecha").value,
				pantalla_specs: document.getElementById("ft_pantalla_specs").value,
				pantalla_tipo: document.getElementById("ft_pantalla_tipo").value,
				pantalla_resolucion: document.getElementById("ft_pantalla_resolucion")
					.value,
				pantalla_refresco: document.getElementById("ft_pantalla_refresco")
					.value,
				io_puertos: document.getElementById("ft_io_puertos").value,
				so_nombre: document.getElementById("ft_so_nombre").value,
				so_distribucion: document.getElementById("ft_so_distribucion").value,
			};

			const body = {
				codigo: document.getElementById("f_codigo").value.trim(),
				nombre: document.getElementById("f_nombre").value.trim(),
				saludo: document.getElementById("f_saludo").value,
				tratamiento: document.getElementById("f_tratamiento").value,
				problema: document.getElementById("f_problema").value,
				notas: document.getElementById("f_notas").value,
				apps,
				ficha,
			};

			try {
				const url = isEdit
					? `/admin/api/clientes/${editId}`
					: "/admin/api/clientes";
				const method = isEdit ? "PUT" : "POST";

				const res = await fetch(url, {
					method,
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});

				const data = await res.json();

				if (data.success || data.id) {
					showToast(
						isEdit ? "Cliente actualizado" : "Cliente creado exitosamente",
					);
					closeClientModal();
					setTimeout(() => location.reload(), 800);
				} else {
					showToast(data.error || "Error al guardar", true);
				}
			} catch {
				showToast("Error de conexión", true);
			}
		});
	}

	// ─── Apps Management ───
	function addAppRow(nombre = "", icono = "", link = "") {
		const row = document.createElement("div");
		row.className = "app-row";
		row.innerHTML = `
            <input type="text" placeholder="Nombre" value="${nombre}">
            <input type="text" placeholder="URL del ícono" value="${icono}">
            <input type="text" placeholder="URL del link" value="${link}">
            <button type="button" class="btn-remove-app" title="Eliminar"><i class="fa-solid fa-xmark"></i></button>
        `;
		row
			.querySelector(".btn-remove-app")
			.addEventListener("click", () => row.remove());
		appsContainer.appendChild(row);
	}

	if (addAppBtn) {
		addAppBtn.addEventListener("click", () => addAppRow());
	}

	// ─── Reset Form ───
	function resetForm() {
		document.getElementById("editId").value = "";
		document.getElementById("f_codigo").value = "";
		document.getElementById("f_nombre").value = "";
		document.getElementById("f_saludo").value =
			"Hola buenas soy el técnico informático Franco Calegari versión 2025";
		document.getElementById("f_tratamiento").value = "";
		document.getElementById("f_problema").value = "";
		document.getElementById("f_notas").value = "";
		appsContainer.innerHTML = "";

		// Reset ficha
		const ftFields = [
			"ft_cpu_nombre",
			"ft_cpu_potencia",
			"ft_cpu_fabricante",
			"ft_gpu_nombre",
			"ft_gpu_vram",
			"ft_gpu_fabricante",
			"ft_ram_capacidad",
			"ft_ram_slots",
			"ft_almacenamiento_nombre",
			"ft_almacenamiento_tipo",
			"ft_almacenamiento_capacidad",
			"ft_wifi",
			"ft_ethernet",
			"ft_bluetooth",
			"ft_placa_base",
			"ft_bios_version",
			"ft_bios_fecha",
			"ft_pantalla_specs",
			"ft_pantalla_tipo",
			"ft_pantalla_resolucion",
			"ft_pantalla_refresco",
			"ft_io_puertos",
			"ft_so_nombre",
			"ft_so_distribucion",
		];
		ftFields.forEach((id) => {
			const el = document.getElementById(id);
			if (el) el.value = "";
		});
		document.getElementById("ft_cpu_arquitectura").value = "64 bits";

		// Clear template active state
		document
			.querySelectorAll(".template-btn")
			.forEach((b) => b.classList.remove("active"));
	}

	// ─── Toast ───
	function showToast(msg, isError = false) {
		toastMsg.textContent = msg;
		toast.className = "toast show" + (isError ? " error" : "");
		toast.querySelector("i").className = isError
			? "fa-solid fa-circle-xmark"
			: "fa-solid fa-circle-check";
		setTimeout(() => {
			toast.className = "toast";
		}, 3000);
	}
});
