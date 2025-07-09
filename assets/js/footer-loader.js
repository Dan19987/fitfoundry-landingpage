document.addEventListener('DOMContentLoaded', function() {
    // Footer laden
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    if (footerPlaceholder) {
        fetch('/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Footer konnte nicht geladen werden');
                }
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
                
                // Footer erfolgreich geladen - Event für Analytics
                if (typeof trackEvent === 'function') {
                    trackEvent('footer_loaded', 'System', 'dynamic_include');
                }
            })
            .catch(error => {
                console.error('Fehler beim Laden des Footers:', error);
                // Fallback: Footer-Placeholder ausblenden
                footerPlaceholder.style.display = 'none';
            });
    }
});