document.addEventListener('DOMContentLoaded', () => {
    const buscarBtn = document.getElementById('buscarBtn');
    const clienteCodigoInput = document.getElementById('clienteCodigo');

    function buscarCliente() {
        const codigo = clienteCodigoInput.value.trim(); // Limpiar espacios en blanco

        if (codigo) {
            fetch('./assets/json/clientes.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al cargar los datos');
                    }
                    return response.json();
                })
                .then(data => {
                    const cliente = data.find(c => c.codigo === codigo);
                    if (cliente) {
                        window.location.href = cliente.url; // Redirige a la URL del cliente
                    } else {
                        alert('Código de cliente no encontrado.'); // Usar alert para informar al usuario
                    }
                })
                .catch(error => console.error('Error:', error));
        } else {
            alert('Por favor ingresa un código de cliente.'); // Alertar si el campo está vacío
        }
    }

    buscarBtn.addEventListener('click', buscarCliente);

    clienteCodigoInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            buscarCliente();
        }
    });
});




const tips = [
    {
        "img": "./assets/img/Miniaturas/Miniatura1.png",
        "gif": "./assets/img/Miniatura1.gif",
        "alt": "Miniatura 1",
        "title": "Limpia tu PC Regularmente",
        "link": "https://www.youtube.com/watch?v=9OmrBkFzdN4",
        "description": "Mantén tu PC libre de procesos indeseados."
    },
    {
        "img": "./assets/img/Miniaturas/Miniatura1.png",
        "gif": "./assets/img/pixel-trombone.gif",
        "alt": "Miniatura 2",
        "title": "Actualiza el Software",
        "link": "https://example.com/actualiza",
        "description": "Asegúrate de tener siempre la última versión del software para mejorar el rendimiento y la seguridad."
    },
    {
        "img": "./assets/img/Miniaturas/Miniatura1.png",
        "gif": "./assets/img/pixel-trombone.gif",
        "alt": "Miniatura 3",
        "title": "Usa un Antivirus",
        "link": "https://example.com/antivirus",
        "description": "Protege tu PC contra virus y malware utilizando un buen programa antivirus."
    },
    {
        "img": "./assets/img/Miniaturas/Miniatura1.png",
        "gif": "./assets/img/pixel-trombone.gif",
        "alt": "Miniatura 4",
        "title": "Haz Copias de Seguridad",
        "link": "https://example.com/copias",
        "description": "Realiza copias de seguridad regularmente para evitar la pérdida de datos importantes."
    }
    // Puedes añadir más elementos aquí
];

const container = document.querySelector('#pc-health-tips .cardcontainer');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

tips.forEach(tip => {
    const card = document.createElement('a');
    card.href = tip.link;
    card.className = 'card';
    card.innerHTML = `
        <div class="icon">
            <img src="${tip.gif}" alt="${tip.alt}" class="gif">
            <img src="${tip.img}" alt="${tip.alt}">
            
        </div>
        <div class="info__description">
            <h3>${tip.title}</h3>
            <p>${tip.description}</p>
        </div>
    `;
    container.appendChild(card);
});

function updateButtons() {
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    prevButton.disabled = scrollLeft === 0;
    nextButton.disabled = scrollLeft + clientWidth >= scrollWidth;
}

prevButton.addEventListener('click', () => {
    container.scrollBy({ left: -300, behavior: 'smooth' });
    updateButtons(); // Asegurarse de actualizar los botones después del scroll
});

nextButton.addEventListener('click', () => {
    container.scrollBy({ left: 300, behavior: 'smooth' });
    updateButtons(); // Asegurarse de actualizar los botones después del scroll
});

container.addEventListener('scroll', updateButtons);
container.addEventListener('wheel', (e) => {
    e.preventDefault();
    container.scrollBy({ left: e.deltaY < 0 ? -100 : 100 });
    updateButtons(); // Asegurarse de actualizar los botones después del scroll
});

// Inicializa el estado de los botones
updateButtons();

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const originalText = logo.textContent; // "FC"
    const animatedText = 'F /Inicio/ C';

    let animationInterval; // Variable para almacenar el intervalo

    logo.addEventListener('mouseover', () => {
        let index = 0;
        clearInterval(animationInterval); // Detener cualquier animación en curso
        animationInterval = setInterval(() => {
            if (index < animatedText.length) {
                logo.textContent = animatedText.slice(0, index + 1);
                index++;
            } else {
                clearInterval(animationInterval);
            }
        }, 15); // Ajusta la velocidad de la animación aquí
    });

    logo.addEventListener('mouseout', () => {
        let index = animatedText.length;
        clearInterval(animationInterval); // Detener cualquier animación en curso
        animationInterval = setInterval(() => {
            if (index > 2) { // Mantener "C" y "F" en pantalla
                logo.textContent = animatedText.slice(0, index);
                index--;
            } else {
                logo.textContent = originalText; // Cambiar a "FC" rápidamente
                clearInterval(animationInterval);
            }
        }, 15); // Ajusta la velocidad de la animación aquí
    });
});


