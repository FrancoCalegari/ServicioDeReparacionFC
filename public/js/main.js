// ─── FC Main Frontend JS ───

document.addEventListener("DOMContentLoaded", () => {
	// ─── Logo Animation ───
	const logo = document.getElementById("logo");
	if (logo) {
		const originalText = logo.textContent;
		const animatedText = "F /Inicio/ C";
		let animationInterval;

		logo.addEventListener("mouseover", () => {
			let index = 0;
			clearInterval(animationInterval);
			animationInterval = setInterval(() => {
				if (index < animatedText.length) {
					logo.textContent = animatedText.slice(0, index + 1);
					index++;
				} else {
					clearInterval(animationInterval);
				}
			}, 15);
		});

		logo.addEventListener("mouseout", () => {
			let index = animatedText.length;
			clearInterval(animationInterval);
			animationInterval = setInterval(() => {
				if (index > 2) {
					logo.textContent = animatedText.slice(0, index);
					index--;
				} else {
					logo.textContent = originalText;
					clearInterval(animationInterval);
				}
			}, 15);
		});
	}

	// ─── Search Functionality ───
	const buscarBtn = document.getElementById("buscarBtn");
	const clienteInput = document.getElementById("clienteCodigo");
	const feedback = document.getElementById("searchFeedback");

	function buscarCliente() {
		const codigo = clienteInput.value.trim();
		if (!codigo) {
			showFeedback("Por favor ingresa un código de cliente.", "error");
			return;
		}

		showFeedback("Buscando...", "");

		fetch(`/api/buscar/${encodeURIComponent(codigo)}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.found) {
					showFeedback("¡Cliente encontrado! Redirigiendo...", "success");
					setTimeout(() => {
						window.location.href = data.url;
					}, 500);
				} else {
					showFeedback("Código de cliente no encontrado.", "error");
					clienteInput.focus();
				}
			})
			.catch(() => {
				showFeedback("Error al buscar. Intenta de nuevo.", "error");
			});
	}

	function showFeedback(msg, type) {
		if (feedback) {
			feedback.textContent = msg;
			feedback.className = "search-feedback" + (type ? " " + type : "");
		}
	}

	if (buscarBtn) {
		buscarBtn.addEventListener("click", buscarCliente);
	}

	if (clienteInput) {
		clienteInput.addEventListener("keydown", (e) => {
			if (e.key === "Enter") buscarCliente();
		});
	}

	// ─── Carousel ───
	const track = document.getElementById("carouselTrack");
	const prevBtn = document.getElementById("prevButton");
	const nextBtn = document.getElementById("nextButton");

	if (track && prevBtn && nextBtn) {
		function updateCarouselButtons() {
			prevBtn.disabled = track.scrollLeft <= 0;
			nextBtn.disabled =
				track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
		}

		prevBtn.addEventListener("click", () => {
			track.scrollBy({ left: -300, behavior: "smooth" });
		});

		nextBtn.addEventListener("click", () => {
			track.scrollBy({ left: 300, behavior: "smooth" });
		});

		track.addEventListener("scroll", updateCarouselButtons);
		track.addEventListener("wheel", (e) => {
			e.preventDefault();
			track.scrollBy({ left: e.deltaY < 0 ? -100 : 100 });
		});

		updateCarouselButtons();
	}

	// ─── Navbar scroll effect ───
	const navbar = document.querySelector(".navbar");
	if (navbar) {
		window.addEventListener("scroll", () => {
			if (window.scrollY > 20) {
				navbar.style.background = "rgba(10, 22, 40, 0.95)";
			} else {
				navbar.style.background = "rgba(10, 22, 40, 0.85)";
			}
		});
	}
});
