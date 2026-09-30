document.addEventListener('DOMContentLoaded', function() {
    const currentPlayer = localStorage.getItem("currentPlayer") || "1";
    const popup = document.querySelector('.popup');
    const zoneCarte = document.querySelector('.zone-carte');
    const boutonLancer = document.getElementById('lancer-de');
    const chronoElement = document.querySelector('.chronoo p');

    localStorage.setItem("currentPlayer", currentPlayer.toString());

    const questionCasesVisited = {
        1: {},
        2: {}
    };
    
    window.checkQuestionCase = function(position) {
        return false; // Valeur par défaut en attendant l'initialisation complète
    };
    
    if (!window.gameState) {
        window.gameState = {
            playerPoints: {
                1: 0,
                2: 0
            }
        };
    }
    
    let messageDiv = document.querySelector('.game-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'game-message';
        document.querySelector('.scene-jeu').appendChild(messageDiv);
    }

    if (popup) {
        popup.style.display = 'none';
        if (document.getElementById('lancer-de-j1')) {
            document.getElementById('lancer-de-j1').disabled = false;
        }
    }
/*---------------------------------------------------------------------------------------------*/
    const baseQuestions = window.baseQuestions;
    
    const questionCases = [5, 8, 12, 14, 16, 20, 23, 27, 29, 31, 35, 38, 42, 44];
    
    function verifierCaseQuestion(position, playerNum) {
        if (questionCases.includes(position)) {
            // Vérifier si le joueur a déjà répondu à une question sur cette case
            if (questionCasesVisited[playerNum] && questionCasesVisited[playerNum][position]) {
                return false; // Déjà répondu
            }
            return true; 
        }
        return false;
    }
    
    function ouvrirPopup() {
        document.getElementById('fond-gris').style.display = 'block';
        popup.style.display = 'flex';
        console.log("Popup ouvert");
    }
    
    // Fonction pour obtenir une question aléatoire selon le niveau
    function obtenirQuestion(niveau) {
        console.log("Questions disponibles :", baseQuestions.questions);
        const questionsDuNiveau = baseQuestions.questions.filter(q => q.niveau === niveau);
    
        if (questionsDuNiveau.length === 0) {
            console.error("Aucune question trouvée pour le niveau:", niveau);
            return null;
        }
    
        const indexAleatoire = Math.floor(Math.random() * questionsDuNiveau.length);
        const questionChoisie = questionsDuNiveau[indexAleatoire];
    
        console.log("Question choisie :", questionChoisie);
        return questionChoisie;
    }
    
    
    // Fonction pour déterminer le niveau en fonction de la valeur du dé
    function determinerNiveau(valeurDe) {
        switch(valeurDe) {
            case 1:
                return "facile";
            case 2:
                return "moyen";
            case 3:
                return "difficile";
            default:
                return "facile";
        }
    }
    
    // afficher la question et les réponses
    function afficherQuestion(question) {
        
        zoneCarte.innerHTML = '';
        
        const questionElement = document.createElement('div');
        questionElement.className = 'question-text';
        questionElement.textContent = question.question;
        
        const reponsesElement = document.createElement('div');
        reponsesElement.className = 'reponse';
        
        // Mélanger les réponses pour ne pas que la bonne réponse soit toujours à la même position
        const reponsesMelangees = [...question.reponses];
        for (let i = reponsesMelangees.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [reponsesMelangees[i], reponsesMelangees[j]] = [reponsesMelangees[j], reponsesMelangees[i]];
        }
        
        reponsesMelangees.forEach(reponse => {
            const boutonReponse = document.createElement('button');
            boutonReponse.className = 'reponse-btn';
            boutonReponse.textContent = reponse;
            
            boutonReponse.addEventListener('click', function() {
                console.log("Réponse sélectionnée:", reponse);
                console.log("Bonne réponse attendue:", question.bonne_reponse);

                if (!question.bonne_reponse) {
                    console.error("Erreur : question.bonne_reponse est undefined !");
                    return;
                }
                verifierReponse(reponse, question.bonne_reponse);
            });
            
            reponsesElement.appendChild(boutonReponse);
        });
        
        // Ajouter les éléments à la zone carte
        zoneCarte.appendChild(questionElement);
        zoneCarte.appendChild(reponsesElement);
        
        // Afficher la zone carte
        zoneCarte.style.display = 'flex';
    }
    
    // Fonction pour vérifier la réponse
    function verifierReponse(reponseUtilisateur, bonneReponse) {
        // Récupérer le joueur actuel
        const currentPlayerNum = localStorage.getItem("currentPlayer") || "1";
        const currentPosition = window.playerPositions[currentPlayerNum];
        questionCasesVisited[currentPlayerNum][currentPosition] = true;

        console.log("Réponse sélectionnée:", reponseUtilisateur);
        console.log("Bonne réponse:", bonneReponse);
        
        if (reponseUtilisateur === bonneReponse) {
            // Bonne réponse - attribuer 8 points au joueur courant
            gameState.playerPoints[currentPlayerNum] += 8;
            
            // Mettre à jour l'affichage des points
            updatePointsDisplay();
            
            // Afficher le message de réussite dans le div message (comme dans le premier fichier)
            messageDiv.textContent = `Bien joué ! Vous gagnez 8 goupilles !`;
            messageDiv.style.display = 'block';
            
            setTimeout(function() {
                messageDiv.style.display = 'none';
            }, 2000);
            
            fermerPopup();
        } else {
            // Mauvaise réponse
            messageDiv.textContent = `Dommage, la bonne réponse était : ${bonneReponse}`;
            messageDiv.style.display = 'block';
            
            setTimeout(function() {
                messageDiv.style.display = 'none';
            }, 2000);
            
            fermerPopup();
        }

        setTimeout(function() {
            // Appeler la fonction finishTurn du premier fichier si elle est disponible
            if (window.finishTurn) {
                window.finishTurn();
            }
        }, 2200);
    }

    /*----------------------------------------------------------------------------------------------------*/
    
    // Fonction pour mettre à jour l'affichage des points (comme dans le premier fichier)
    function updatePointsDisplay() {
        const pointsJoueur1 = document.getElementById('points-joueur1');
        const pointsJoueur2 = document.getElementById('points-joueur2');
        
        if (pointsJoueur1) pointsJoueur1.textContent = window.gameState.playerPoints[1];
        if (pointsJoueur2) pointsJoueur2.textContent = window.gameState.playerPoints[2];
        
        console.log("Points joueur 1:", gameState.playerPoints[1]);
        console.log("Points joueur 2:", gameState.playerPoints[2]);
    }
    
    function fermerPopup() {
        popup.style.display = 'none';
        document.getElementById('fond-gris').style.display = 'none';
        zoneCarte.style.display = 'none';
        boutonLancer.disabled = false;
        clearInterval(timerInterval); // Arrêt du chronomètre

        if (document.getElementById('lancer-de-j1')) {
        document.getElementById('lancer-de-j1').disabled = false;}
    }

    let timerInterval; 

    function startTimer() {
        let timeLeft = 20; // Temps initial en secondes
        chronoElement.textContent = "20 seconde(s)"; // Affichage initial

        timerInterval = setInterval(function() {
            timeLeft--;
            chronoElement.textContent = timeLeft + " seconde(s)";

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                messageDiv.textContent = "Le temps est écoulé!";
                messageDiv.style.display = 'block';

                setTimeout(function() {
                    messageDiv.style.display = 'none';
                    fermerPopup();
                    if (window.finishTurn) {
                        window.finishTurn();
                    }
                }, 2000);
            }
        }, 1000);
    }
    
    function lancerDe() {
        // Désactiver le bouton pendant le lancer
        boutonLancer.disabled = true;
        
        // Générer un nombre aléatoire entre 1 et 3
        const valeurDe = Math.floor(Math.random() * 3) + 1;
        
        // Afficher la valeur sur le dé
        const faceDiv = document.querySelector('.face2');
        if (faceDiv) {
            faceDiv.textContent = valeurDe;
        }
        
        // Déterminer le niveau de difficulté
        const niveau = determinerNiveau(valeurDe);
        console.log("Niveau: " + niveau);
        
        // Attendre un peu pour simuler le lancer de dé
        setTimeout(function() {
            // Obtenir une question du niveau déterminé
            const question = obtenirQuestion(niveau);
            
            if (question) {
                // Afficher question et réponses
                afficherQuestion(question);
                startTimer();
            } else {
                // Si aucune question n'est disponible pour ce niveau
                messageDiv.textContent = "Aucune question disponible pour le niveau " + niveau;
                messageDiv.style.display = 'block';
                
                setTimeout(function() {
                    messageDiv.style.display = 'none';
                }, 2000);
                
                boutonLancer.disabled = false;
            }
        }, 1000);
    }
    
    
    window.ouvrirQuestionPopup = ouvrirPopup;
    
    window.checkQuestionCase = function(position) {
        const currentPlayerNum = localStorage.getItem("currentPlayer") || "1";
    
        // Si le popup est déjà ouvert, ne pas déclencher une nouvelle fois
        if(popup.style.display === "flex") {
            return false;
        }

        if (verifierCaseQuestion(position, currentPlayerNum)) {
            questionCasesVisited[currentPlayerNum][position] = true;
            if (boutonLancer) {
                boutonLancer.disabled = false;
            }
            ouvrirPopup();
            return true;
        }
        return false;
    };
    
    
    // Fonction pour réinitialiser la case de question si un joueur quitte puis revient sur la même case
    window.resetQuestionCase = function(playerNum, position) {
        if (questionCasesVisited[playerNum] && questionCasesVisited[playerNum][position]) {
            delete questionCasesVisited[playerNum][position];
        }
    };
    
    if (boutonLancer) {
        boutonLancer.addEventListener('click', lancerDe);
    }
});