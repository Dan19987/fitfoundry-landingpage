// ============================================================================
// AUDIO DEMO - MINIMAL CODE FÜR 2 AUDIO-BUTTONS
// Datei: audio-demo.js
// ============================================================================

// Audio-Elemente
let audioDemo = null;        // Für Play-Button (Male2)
let audioWillkommen = null;  // Für "Audio-Demo anhören" Button (Male1)

// Event Listener Referenzen (zum Entfernen)
let audioDemoEndListener = null;
let audioWillkommenEndListener = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

function initAudioDemo() {
    // Audio-Elemente finden
    audioDemo = document.getElementById('audioDemo');
    audioWillkommen = document.getElementById('audioWillkommen');
    
    // Debug
    console.log('🎵 Audio-Elemente geladen:', {
        audioDemo: !!audioDemo,
        audioWillkommen: !!audioWillkommen
    });
    
    // Event Listeners für Buttons
    setupButtonListeners();
}

function setupButtonListeners() {
    // Button 1: Play-Button in der Audio-Demo-Box
    const playButton = document.querySelector('.audio-demo-container .play-button');
    if (playButton) {
        playButton.addEventListener('click', (e) => {
            e.preventDefault();
            playAudioDemo();
        });
        console.log('✅ Play-Button gefunden und verknüpft');
    }
    
    // Button 2: "🎧 Audio-Demo anhören" Button
    const willkommenButton = document.querySelector('a[href="#audio-demo"]');
    if (willkommenButton) {
        willkommenButton.addEventListener('click', (e) => {
            e.preventDefault();
            playAudioWillkommen();
        });
        console.log('✅ Willkommen-Button gefunden und verknüpft');
    }
}

// ============================================================================
// AUDIO FUNCTIONS MIT KORREKTEM EVENT LISTENER MANAGEMENT
// ============================================================================

function playAudioDemo() {
    if (!audioDemo) {
        console.log('❌ Audio Demo Element nicht gefunden');
        return;
    }
    
    const playButton = document.querySelector('.audio-demo-container .play-button');
    const playIcon = playButton?.querySelector('span');
    
    // Prüfen ob Audio bereits läuft
    if (!audioDemo.paused) {
        // Audio stoppen
        stopAudioDemo();
        return;
    }
    
    // Anderen Sound stoppen falls er läuft
    stopAudioWillkommen();
    
    // Audio von Anfang starten
    audioDemo.currentTime = 0;
    
    // Audio abspielen
    audioDemo.play()
        .then(() => {
            console.log('🎵 Audio Demo wird abgespielt');
            
            // Button-Animation starten
            if (playButton) playButton.classList.add('playing');
            if (playIcon) playIcon.textContent = '⏸️';
            
        })
        .catch(error => {
            console.log('❌ Audio Demo Fehler:', error);
        });
    
    // Event Listener für Audio-Ende (mit Referenz zum späteren Entfernen)
    audioDemoEndListener = () => {
        resetAudioDemo();
        console.log('🏁 Audio Demo beendet');
        audioDemoEndListener = null; // Referenz löschen
    };
    
    audioDemo.addEventListener('ended', audioDemoEndListener, { once: true });
}

function playAudioWillkommen() {
    if (!audioWillkommen) {
        console.log('❌ Audio Willkommen Element nicht gefunden');
        return;
    }
    
    const willkommenButton = document.querySelector('a[href="#audio-demo"]');
    
    // Prüfen ob Audio bereits läuft
    if (!audioWillkommen.paused) {
        // Audio stoppen
        stopAudioWillkommen();
        return;
    }
    
    // Anderen Sound stoppen falls er läuft
    stopAudioDemo();
    
    // Audio von Anfang starten
    audioWillkommen.currentTime = 0;
    
    // Audio abspielen
    audioWillkommen.play()
        .then(() => {
            console.log('🎵 Audio Willkommen wird abgespielt');
            
            // Button-Animation starten
            if (willkommenButton) {
                willkommenButton.classList.add('playing');
                // Button-Text temporär ändern
                const originalText = willkommenButton.innerHTML;
                willkommenButton.innerHTML = '⏸️ Audio stoppen';
            }
            
        })
        .catch(error => {
            console.log('❌ Audio Willkommen Fehler:', error);
        });
    
    // Event Listener für Audio-Ende (mit Referenz zum späteren Entfernen)
    audioWillkommenEndListener = () => {
        resetAudioWillkommen();
        console.log('🏁 Audio Willkommen beendet');
        audioWillkommenEndListener = null; // Referenz löschen
    };
    
    audioWillkommen.addEventListener('ended', audioWillkommenEndListener, { once: true });
}

// ============================================================================
// STOP FUNCTIONS MIT EVENT LISTENER CLEANUP
// ============================================================================

function stopAudioDemo() {
    if (audioDemo && !audioDemo.paused) {
        // Event Listener entfernen (verhindert das "späte" Reset)
        if (audioDemoEndListener) {
            audioDemo.removeEventListener('ended', audioDemoEndListener);
            audioDemoEndListener = null;
        }
        
        audioDemo.pause();
        audioDemo.currentTime = 0;
        resetAudioDemo(); // Sofortiges Reset
        console.log('⏹️ Audio Demo gestoppt');
    }
}

function stopAudioWillkommen() {
    if (audioWillkommen && !audioWillkommen.paused) {
        // Event Listener entfernen (verhindert das "späte" Reset)
        if (audioWillkommenEndListener) {
            audioWillkommen.removeEventListener('ended', audioWillkommenEndListener);
            audioWillkommenEndListener = null;
        }
        
        audioWillkommen.pause();
        audioWillkommen.currentTime = 0;
        resetAudioWillkommen(); // Sofortiges Reset
        console.log('⏹️ Audio Willkommen gestoppt');
    }
}

// ============================================================================
// RESET FUNCTIONS
// ============================================================================

function resetAudioDemo() {
    const playButton = document.querySelector('.audio-demo-container .play-button');
    const playIcon = playButton?.querySelector('span');
    
    if (playButton) playButton.classList.remove('playing');
    if (playIcon) playIcon.textContent = '▶️';
}

function resetAudioWillkommen() {
    const willkommenButton = document.querySelector('a[href="#audio-demo"]');
    
    if (willkommenButton) {
        willkommenButton.classList.remove('playing');
        // Button-Text zurücksetzen
        willkommenButton.innerHTML = '🎧 Audio-Demo anhören';
    }
}

// ============================================================================
// CSS ANIMATIONS
// ============================================================================

function addAudioStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Play-Button Animation */
        .play-button.playing {
            animation: playButtonPulse 1s ease-in-out infinite;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
            transform: scale(1.05);
        }
        
        /* Willkommen-Button Animation */
        a[href="#audio-demo"].playing {
            animation: willkommenButtonGlow 1.5s ease-in-out infinite;
            transform: scale(1.02);
        }
        
        @keyframes playButtonPulse {
            0%, 100% { 
                box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
            }
            50% { 
                box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
            }
        }
        
        @keyframes willkommenButtonGlow {
            0%, 100% { 
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }
            50% { 
                box-shadow: 0 15px 40px rgba(99, 102, 241, 0.4);
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================================================
// DOM READY
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Audio Demo (minimal) geladen');
    
    // CSS hinzufügen
    addAudioStyles();
    
    // Audio initialisieren
    initAudioDemo();
    
    // Debug nach 1 Sekunde
    setTimeout(() => {
        const playButton = document.querySelector('.audio-demo-container .play-button');
        const willkommenButton = document.querySelector('a[href="#audio-demo"]');
        
        console.log('🔍 Button-Status:', {
            playButton: !!playButton,
            willkommenButton: !!willkommenButton,
            audioDemo: !!audioDemo,
            audioWillkommen: !!audioWillkommen
        });
    }, 1000);
});

console.log('✅ Audio Demo JavaScript geladen');