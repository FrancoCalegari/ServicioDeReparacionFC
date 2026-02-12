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

    // Popup functionality
    const popup = document.getElementById('techInfoPopup');
    const infoButton = document.getElementById('infoTecDevice');
    const closeButton = document.querySelector('.close-button');

    infoButton.addEventListener('click', () => {
        popup.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});
