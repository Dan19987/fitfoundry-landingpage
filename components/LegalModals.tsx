import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'impressum' | 'datenschutz' | 'agb' | null;
}

const LegalModals: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  const content = {
    impressum: (
      <>
        <h2 className="text-2xl font-bold text-white mb-6">Impressum</h2>
        <div className="space-y-4 text-brand-muted leading-relaxed">
          <div className="bg-brand-surface/50 border border-brand-orange/30 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">Angaben gemäß § 5 TMG</h3>
            <p className="text-white">Daniel Lahmer</p>
            <p>Postfach 49 02 28</p>
            <p>12282 Berlin</p>
            <p>Deutschland</p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-2">Kontakt</h3>
            <p>E-Mail: <a href="mailto:info@fitfoundry.de" className="text-brand-orange hover:text-brand-gold">info@fitfoundry.de</a></p>
            <p className="text-sm mt-1 opacity-70">Antwortzeit: Innerhalb von 48 Stunden</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
            <p>Daniel Lahmer</p>
            <p>Postfach 49 02 28</p>
            <p>12282 Berlin</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">EU-Streitschlichtung</h3>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-brand-gold">
              https://ec.europa.eu/consumers/odr/
            </a>
            <p className="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h3>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </div>

          <div className="pt-4 border-t border-brand-border">
            <h3 className="text-white font-semibold mb-2">Social Media</h3>
            <p>Instagram: <a href="https://www.instagram.com/fitfoundry_app/" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-brand-gold">@fitfoundry_app</a></p>
            <p>YouTube: <a href="https://www.youtube.com/@FitFoundry_app" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-brand-gold">@FitFoundry_app</a></p>
            <p>TikTok: <a href="https://www.tiktok.com/@fitfoundry_app" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-brand-gold">@fitfoundry_app</a></p>
          </div>

          <p className="text-xs opacity-60 pt-4">Stand: November 2025</p>
        </div>
      </>
    ),
    datenschutz: (
      <>
        <h2 className="text-2xl font-bold text-white mb-6">Datenschutzerklärung</h2>
        <div className="space-y-4 text-brand-muted leading-relaxed">
          
          <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl p-4">
            <p className="text-white font-semibold">🔒 Privacy First: Alle Trainings- und Körperdaten werden ausschließlich lokal auf Ihrem Gerät gespeichert. Keine Cloud, keine Datenweitergabe.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">1. Datenschutz auf einen Blick</h3>
            <h4 className="text-white text-sm font-medium mt-3 mb-1">Allgemeine Hinweise</h4>
            <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen oder die FitFoundry App nutzen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">2. Verantwortlicher</h3>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website und in der App ist:</p>
            <p className="mt-2">Daniel Lahmer<br/>Postfach 49 02 28<br/>12282 Berlin<br/>Deutschland</p>
            <p className="mt-2">E-Mail: info@fitfoundry.de</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">3. Datenerfassung auf dieser Website</h3>
            <h4 className="text-white text-sm font-medium mt-3 mb-1">Newsletter-Anmeldung</h4>
            <p>Wenn Sie sich für unseren Early Access Newsletter anmelden, erheben wir Ihre E-Mail-Adresse. Die Datenverarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können Ihre Einwilligung jederzeit widerrufen.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">4. Hosting</h3>
            <p>Diese Website wird über GitHub Pages gehostet. GitHub kann technische Daten wie IP-Adressen in Server-Logs speichern. Weitere Informationen finden Sie in der Datenschutzerklärung von GitHub.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">5. FitFoundry App - Lokale Datenspeicherung</h3>
            <p className="font-medium text-white">Alle persönlichen Daten bleiben auf Ihrem Gerät:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Trainingsdaten (Übungen, Sätze, Gewichte)</li>
              <li>Körperdaten (Jackson-Pollock Messungen, Körpergewicht)</li>
              <li>Fortschrittsfotos (100% lokal, keine Cloud)</li>
              <li>Avatar-Fortschritt und Achievements</li>
            </ul>
            <p className="mt-2 text-sm bg-green-500/10 border border-green-500/30 rounded p-2">Es findet keine Synchronisation mit unseren Servern statt. Ihre Daten verlassen niemals Ihr Gerät.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">6. Cookies</h3>
            <p>Diese Website verwendet einen Cookie-Banner. Tracking-Cookies werden nur gesetzt, wenn Sie explizit zustimmen. Technisch notwendige Cookies für die Funktionalität der Website sind davon ausgenommen.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">7. Ihre Rechte</h3>
            <p>Sie haben das Recht auf:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">9. Kontakt bei Datenschutzfragen</h3>
            <p>Für Fragen zum Datenschutz wenden Sie sich bitte an: info@fitfoundry.de</p>
          </div>

          <p className="text-xs opacity-60 pt-4">Stand: November 2025</p>
        </div>
      </>
    ),
    agb: (
      <>
        <h2 className="text-2xl font-bold text-white mb-6">Allgemeine Geschäftsbedingungen</h2>
        <div className="space-y-4 text-brand-muted leading-relaxed">
          
          <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl p-4">
            <p className="text-white font-semibold">⚖️ Transparent und fair - für FitFoundry App und Website</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">§ 1 Geltungsbereich und Vertragspartner</h3>
            <p><strong>Anbieter:</strong></p>
            <p>Daniel Lahmer<br/>Postfach 49 02 28<br/>12282 Berlin<br/>Deutschland</p>
            <p className="mt-2">E-Mail: info@fitfoundry.de</p>
            <p className="mt-3">Diese AGB gelten für alle Verträge zwischen dem Anbieter und den Nutzern der FitFoundry App sowie der zugehörigen Website.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">§ 2 Leistungen</h3>
            <p>FitFoundry ist eine iOS-App für wissenschaftlich fundiertes Fitness-Training mit folgenden Hauptfunktionen:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>150+ wissenschaftlich kategorisierte Übungen</li>
              <li>Live-Kalorien-Tracking mit Personal Metabolic Factor</li>
              <li>Jackson-Pollock 4-Punkt Körperfett-Analyse</li>
              <li>Avatar-System mit Gamification</li>
              <li>200+ Audio-Coach Motivationen</li>
              <li>100% private Fortschrittsfotos (lokal gespeichert)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">§ 3 Nutzungsmodelle und Preise</h3>
            <div className="bg-brand-surface/50 rounded-lg p-3 mt-2">
              <p><strong className="text-white">FitFoundry Basis:</strong> Kostenlos (eingeschränkte Features)</p>
              <p><strong className="text-white">FitFoundry Pro:</strong> 9,99€ pro Monat (alle Features)</p>
              <p><strong className="text-white">FitFoundry Lifetime:</strong> 199€ einmalig (lebenslanger Zugang)</p>
              <p className="text-brand-gold mt-1"><strong>Early Bird:</strong> 50% Rabatt für Newsletter-Abonnenten</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">§ 4 Vertragsschluss</h3>
            <p>Der Download der App erfolgt über den Apple App Store. Mit dem Download akzeptieren Sie diese AGB. Premium-Features werden über In-App-Käufe erworben.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">§ 5 Nutzungsrechte und -pflichten</h3>
            <p><strong className="text-white">Erlaubt:</strong> Private, nicht-kommerzielle Nutzung für Ihre persönliche Fitness</p>
            <p className="mt-2"><strong className="text-white">Verboten:</strong></p>
            <ul className="list-disc ml-6 mt-1 space-y-1">
              <li>Reverse Engineering oder Dekompilierung</li>
              <li>Kommerzielle Nutzung ohne Zustimmung</li>
              <li>Weitergabe von Account-Daten</li>
              <li>Manipulation der Berechnungen</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">§ 6 Technische Anforderungen</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>iOS 14.0 oder höher</li>
              <li>iPhone 8 oder neuer (empfohlen: iPhone 12+)</li>
              <li>Mindestens 2 GB verfügbarer Speicher</li>
            </ul>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">§ 7 Gesundheitshinweise</h3>
            <p className="text-white">⚠️ FitFoundry ist ein Trainings-Tool, kein medizinisches Gerät. Konsultieren Sie vor Trainingsbeginn einen Arzt, besonders bei Vorerkrankungen.</p>
            <p className="mt-2">Die Nutzung erfolgt auf eigene Verantwortung. Der Anbieter haftet nicht für Schäden durch unsachgemäße Nutzung. Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">§ 8 Kündigung</h3>
            <p><strong className="text-white">Kostenlose Version:</strong> Jederzeit durch Löschen der App</p>
            <p className="mt-2"><strong className="text-white">Abonnements:</strong> Jederzeit über iOS-Einstellungen kündbar, wirksam zum Ende der Abrechnungsperiode</p>
            <p className="mt-2"><strong className="text-white">Lifetime:</strong> Dauerhaft gültig, nicht kündbar</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">§ 9 Widerrufsrecht</h3>
            <p>Für Käufe über den Apple App Store gelten die Apple Rückgabe- und Stornierungsrichtlinien. Bei digitalen Inhalten, die sofort verfügbar sind, gilt das 14-tägige EU-Widerrufsrecht nur bei ausdrücklichem Verzicht.</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">§ 10 Anwendbares Recht</h3>
            <p>Für diese AGB gilt deutsches Recht. Gerichtsstand ist Berlin, Deutschland.</p>
            <p className="mt-2">EU-Streitbeilegung: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-brand-gold">https://ec.europa.eu/consumers/odr/</a></p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">§ 11 Kontakt und Support</h3>
            <p>E-Mail: info@fitfoundry.de</p>
            <p>Betreff: "AGB - FitFoundry"</p>
            <p>Antwortzeit: Innerhalb von 48 Stunden</p>
          </div>

          <p className="text-xs opacity-60 pt-4">Stand: November 2025</p>
        </div>
      </>
    )
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-brand-dark border border-brand-border w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-brand-muted hover:text-white bg-brand-surface rounded-full transition-colors sticky z-10"
          >
            <X size={20} />
          </button>
          
          <div className="p-8 md:p-10">
            {content[type]}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LegalModals;
