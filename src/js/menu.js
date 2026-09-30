let currentPlayer = 1;
let player1Choice = null;
let player2Choice = null;

const pions = document.querySelectorAll('.pion');
const nextBtn = document.querySelector('.next-btn');
const startBtn = document.querySelector('.start-btn');
const playerInfo = document.querySelector('.player-info');

pions.forEach(pion => {
    pion.addEventListener('click', () => {
        pions.forEach(t => t.classList.remove('selected'));
        pion.classList.add('selected');
        
        if (currentPlayer === 1) {
            player1Choice = pion.src; // Stocke l'URL de l'image
            nextBtn.style.display = 'inline-block';
        } else {
            player2Choice = pion.src; // Stocke l'URL de l'image
            startBtn.style.display = 'inline-block';
        }
    });
});

nextBtn.addEventListener('click', () => {
    currentPlayer = 2;
    const joueurSpan = playerInfo.querySelector('.joueur');
    joueurSpan.textContent = 'Joueur 2';
    nextBtn.style.display = 'none';
    
    pions.forEach(pion => {
        pion.classList.remove('selected');
        if (pion.src === player1Choice) {
            pion.style.opacity = '0.5';
            pion.style.cursor = 'not-allowed';
            pion.style.pointerEvents = 'none';
        }
    });
});

startBtn.addEventListener('click', () => {
    localStorage.setItem('player1Token', player1Choice);
    localStorage.setItem('player2Token', player2Choice);
    window.location.href = 'jeu.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    pions.forEach(pion => {
        pion.addEventListener('mouseover', () => {
            body.style.cursor = "none";
            createRotatingCursor();
        });
        
        pion.addEventListener('mouseout', () => {
            body.style.cursor = "url('./assets/images/ui/cursor.png') 16 16, auto";
            removeRotatingCursor();
        });
    });

    function createRotatingCursor() {
        const rotatingCursor = document.createElement('div');
        rotatingCursor.id = 'rotating-cursor';
        rotatingCursor.style.position = 'fixed';
        rotatingCursor.style.width = '32px';
        rotatingCursor.style.height = '32px';
        rotatingCursor.style.background = "url('./assets/images/ui/cursor.png') no-repeat center/contain";
        rotatingCursor.style.pointerEvents = 'none';
        rotatingCursor.style.animation = 'rotation 2s linear infinite';
        document.body.appendChild(rotatingCursor);
        
        document.addEventListener('mousemove', moveRotatingCursor);
    }

    function moveRotatingCursor(e) {
        const rotatingCursor = document.getElementById('rotating-cursor');
        if (rotatingCursor) {
            rotatingCursor.style.left = `${e.pageX - 16}px`;
            rotatingCursor.style.top = `${e.pageY - 16}px`;
        }
    }

    function removeRotatingCursor() {
        const rotatingCursor = document.getElementById('rotating-cursor');
        if (rotatingCursor) {
            rotatingCursor.remove();
        }
        document.removeEventListener('mousemove', moveRotatingCursor);
    }
});