import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Mic, 
  Activity, 
  Zap, 
  PlayCircle,
  ShieldCheck,
  Dna,
  Coins,
  CheckCircle2,
  Globe2,
  ArrowRight,
  Check,
  Volume2,
  VolumeX
} from 'lucide-react';
import { usePageTracking } from './usePageTracking';  
import HeroBackgroundEffect from './components/HeroBackgroundEffect';
import HeroLogo from './components/HeroLogo';
import Navigation from './components/Navigation';
import AudioPlayerDemo from './components/AudioPlayerDemo';
/*import MouseSpotlight from './components/MouseSpotlight';*/
import MotivationGallery from './components/MotivationGallery';
import MagmaCoreSection from './components/MagmaCoreSection';
import Roadmap from './components/Roadmap';
import ComparisonTable from './components/ComparisonTable';
import ParallaxDivider from './components/ParallaxDivider';
import CookieBanner from './components/CookieBanner';
import LegalModals from './components/LegalModals';
import FAQ from './components/FAQ';

// ⚡ Safari Desktop Detection
const isSafariDesktop = (() => {
  if (typeof window === 'undefined') return false;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isDesktop = window.innerWidth >= 1024;
  return isSafari && isDesktop;
})();

// Animation variants - Safari-optimiert
const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: isSafariDesktop ? 0 : 40  // ⚡ Kein Y-Movement auf Safari Desktop
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: isSafariDesktop ? 0.3 : 0.8,  // ⚡ Schneller auf Safari Desktop
      ease: "easeOut" 
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: isSafariDesktop ? 0.05 : 0.15  // ⚡ Schneller auf Safari Desktop
    }
  }
};



function App() {
  usePageTracking(); 
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'impressum' | 'datenschutz' | 'agb' | null>(null);

  // Newsletter-States
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Video-States
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEarlyAccessSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxBHEVQkJvLjxTU_Vy7R70NjF7NhFLAg1d1QIwzzq5bU25lI3kthbDFXrKEcwvIWXom/exec';
    const TOKEN = 'FitFoundry2025EarlyAccessLaunchRabatt';
    
  try {
    // UTM Parameter aus Session Storage holen (falls vorhanden)
    const utmData = sessionStorage.getItem('fitfoundry_utm');
    let utmSource = '-';
    let utmMedium = '-';
    let utmCampaign = '-';
    
    if (utmData) {
      const utm = JSON.parse(utmData);
      utmSource = utm.source || '-';
      utmMedium = utm.medium || '-';
      utmCampaign = utm.campaign || '-';
    }
    const body = new URLSearchParams({
      name: name,
      email: email,
      token: TOKEN,
      source: 'landingpage',
      page: window.location.pathname,
      utm_source: utmSource,      // NEU!
      utm_medium: utmMedium,        // NEU!
      utm_campaign: utmCampaign,    // NEU!
      website: '',
      ip: '',
      userAgent: navigator.userAgent
    });

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: body
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message
        });
        setEmail('');
        setName('');
      } else {
        throw new Error(data.message || 'Anmeldung fehlgeschlagen');
      }
    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Fehler beim Anmelden. Bitte versuche es erneut.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ticker Messages for the scrolling marquee
  const tickerMessages = [
    "Jeder Schritt zählt, egal wie klein.",
    "🧬 🔥+18 kcal - 33 kcal gesamt!",
    "Baue Druck auf – Countdown läuft.",
    "🧬 Dein Profil optimiert die Kalorienberechnung um 12%! Deine Daten machen den Unterschied!",
    "Keine Ausreden heute! Gib ALLES!"
  ];

  // Duplicate messages to create a seamless loop effect
  const seamlessTicker = [...tickerMessages, ...tickerMessages];

  const openLegal = (type: 'impressum' | 'datenschutz' | 'agb') => {
    setLegalModalType(type);
    setLegalModalOpen(true);
  };

  // Video Observer Effect: Play when in view, pause when out
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play().catch(e => console.log("Autoplay prevented:", e));
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );

    observer.observe(videoElement);

    return () => {
      if (videoElement) observer.unobserve(videoElement);
    };
  }, []);

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text overflow-x-hidden selection:bg-brand-orange selection:text-white relative">
      {/* <MouseSpotlight /> */}
      <Navigation />
      <CookieBanner />
      <LegalModals isOpen={legalModalOpen} onClose={() => setLegalModalOpen(false)} type={legalModalType} />
      
      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden" aria-label="Introduction">
          {/* Background Layers */}
          <HeroBackgroundEffect />
          <HeroLogo />
          
          <div className="relative z-20 container mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto flex flex-col items-center"
              style={{ marginTop: "35vh" }}
            >
              <motion.div variants={fadeInUp} className="mb-8 inline-block -mt-6">
                <span className="bg-brand-surface/90 border border-brand-orange/30 text-brand-orange px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(237,85,59,0.3)]">
                  Coming Winter 2025
                </span>
              </motion.div>
              
<motion.h1 
  variants={fadeInUp} 
  className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight"
  style={{ filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.8))" }}
>
  <span className="text-white">Fit</span>
  <span className="text-white">Foundry</span>
</motion.h1>

{/* ✅ NEU: FORGE YOURSELF Slogan */}
<motion.div 
  variants={fadeInUp}
  className="mb-8"
>
  <p className="text-2xl md:text-4xl font-black text-brand-gold tracking-tight uppercase mb-2">
    FORGE YOURSELF!
  </p>
  <p className="text-lg md:text-xl text-brand-muted font-medium">
    Trainiere smart! Spiele hart!
  </p>
</motion.div>

<motion.div
   variants={fadeInUp} 
   className="relative max-w-2xl mx-auto mb-12"
>
                 <div className="absolute inset-0 bg-brand-dark/60 blur-2xl -z-10 rounded-full"></div>
                 <p className="text-xl md:text-2xl text-white/95 font-medium drop-shadow-lg leading-relaxed">
                  Die erste wissenschaftlich fundierte Fitness-App mit <span className="text-brand-gold font-bold">Live Audio-Coach</span> und <span className="text-brand-gold font-bold">Echtzeit-Kalorienzähler</span>.
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                <motion.a 
                  href="#early-bird"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,215,0,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-brand-gold to-orange-400 text-brand-dark font-black text-xl rounded-full flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.3)] overflow-hidden"
                  aria-label="Early Access Sichern"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/40 -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  />
                  
                  <Zap size={24} fill="currentColor" className="relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10 uppercase tracking-wide">Early Access Sichern</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.a>

                <motion.a 
                  href="#features"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(22, 27, 34, 0.8)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-5 bg-brand-surface/40 border border-brand-border text-brand-muted font-bold text-lg rounded-full hover:border-brand-text hover:text-white transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <PlayCircle size={22} />
                  Demo ansehen
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= VIDEO INTRO ================= */}
        <section className="py-24 relative overflow-hidden" aria-label="Demo Video">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[100%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-brand-dark/50 to-brand-dark pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">FitFoundry in Aktion</h2>
              <p className="text-brand-muted text-lg max-w-2xl mx-auto">
                Erlebe einen ersten Eindruck von der App, die Fitness revolutioniert.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-[280px] md:max-w-[300px] mx-auto rounded-[2.5rem] overflow-hidden border-4 border-brand-border shadow-2xl shadow-brand-orange/10 relative group bg-black"
            >
              {/* Phone Notch/Island Simulation */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black z-20 rounded-b-xl" />

              <div className="aspect-[9/20] bg-brand-dark relative flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  src="/assets/videos/intro.mp4"
                  className="w-full h-full object-cover"
                  loop
                  muted={isVideoMuted}
                  playsInline
                  controls={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  onContextMenu={(e) => e.preventDefault()}
                />
                
                {/* Custom Video Controls Overlay */}
                <div className="absolute top-4 right-4 z-20">
                  <button 
                    onClick={toggleVideoMute}
                    className="p-2 rounded-full bg-black/50 text-white border border-white/20 hover:bg-black/70 transition-colors"
                  >
                    {isVideoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>


              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= AUDIO COACH SECTION ================= */}
        <section id="features" className="py-24 relative overflow-hidden bg-brand-surface/10" aria-label="Audio Coach Features">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-orange/5 blur-[100px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Dein Live Audio-Coach</h2>
              <p className="text-brand-muted text-lg max-w-2xl mx-auto">
                Hör dir echte Samples an. Dein Trainer weiß genau, wann du Motivation brauchst.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <AudioPlayerDemo 
                title="Workout-Motivation"
                description="Weißt du noch, warum du angefangen hast?!"
                icon={<Mic size={24} />}
                intensity="7/10 (Motiviert)"
                voiceName="Sergeant Foundry"
                src="/assets/audios/workout.mp3"
              />
              <AudioPlayerDemo 
                title="App-Start Begrüßung"
                description="Willkommen bei FitFoundry. Lass uns Eisen schmieden."
                icon={<Activity size={24} />}
                intensity="5/10 (Ruhig)"
                voiceName="Guide"
                src="/assets/audios/appstart.mp3"
              />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 bg-green-500/10 border border-green-500/20 rounded-2xl p-6 max-w-3xl mx-auto text-center backdrop-blur-sm"
            >
              <p className="text-brand-text font-medium">
                <span className="text-green-400 font-bold mr-2">💬 200+ Live-Motivationen:</span> 
                Start-Pump • Zwischen-Sätzen • Personal Records • Workout Complete
              </p>
            </motion.div>
          </div>
        </section>

        {/* ================= LIVE TRACKER SECTION ================= */}
        <section className="py-24 relative overflow-hidden" aria-label="Live Tracker Features">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-text to-brand-gold">Live Kalorienzähler</span>
              </h2>
              <p className="text-brand-muted text-lg max-w-2xl mx-auto">
                Der "Motivations-Ticker". Sieh jeden verbrannten Kalorie in Echtzeit.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center"
              >
                 <div className="w-full max-w-sm bg-[#1C1C1E] border border-gray-800 rounded-[2rem] p-4 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4 px-2 opacity-50 text-xs">
                        <span>18:32</span>
                        <div className="flex gap-1">
                           <div className="w-3 h-3 bg-white rounded-full"></div>
                           <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </div>

                    <div className="h-11 mb-2 relative flex items-center w-full bg-[#D1D1D6] rounded-full overflow-hidden border border-white/20 shadow-lg"> 
                        <motion.div 
                          className="flex gap-16 whitespace-nowrap absolute items-center h-full"
                          initial={{ x: "0%" }}
                          animate={{ x: "-50%" }}
                          transition={{ 
                            repeat: Infinity, 
                            ease: "linear", 
                            duration: 40,
                          }}
                        >
                          {seamlessTicker.map((msg, i) => (
                             <span key={i} className="font-bold text-gray-900 text-sm tracking-tight leading-tight inline-block">
                               {msg}
                             </span>
                          ))}
                        </motion.div>
                    </div>

                    <div className="px-2 mb-2">
                      <span className="text-brand-orange text-xs border border-brand-orange/30 px-2 py-0.5 rounded-full bg-brand-orange/10">Brust</span>
                      <h3 className="text-brand-orange text-xl font-bold mt-1">Pike Push-Ups</h3>
                      <p className="text-gray-500 text-xs">Obere Brust, Schultern</p>
                    </div>

                    <div className="bg-[#2C2C2E] rounded-xl p-3 mb-2 flex items-center justify-between border border-brand-orange/20 relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange"></div>
                       
                       <div className="w-8 h-8 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-sm">
                         1
                       </div>

                       <div className="flex gap-2">
                          <div className="bg-white rounded-lg w-16 h-10 flex items-center justify-center font-bold text-black shadow-inner">
                             5
                          </div>
                          <div className="bg-white rounded-lg w-16 h-10 flex items-center justify-center font-bold text-black shadow-inner">
                             10
                          </div>
                       </div>

                       <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20">
                          <Check size={20} className="text-white" strokeWidth={3} />
                       </div>
                    </div>

                    <div className="bg-[#2C2C2E] rounded-xl p-3 flex items-center justify-between opacity-50">
                       <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center font-bold text-sm">
                         2
                       </div>
                       <div className="flex gap-2">
                          <div className="bg-gray-200 rounded-lg w-16 h-10 flex items-center justify-center font-bold text-gray-400">
                             -
                          </div>
                          <div className="bg-gray-200 rounded-lg w-16 h-10 flex items-center justify-center font-bold text-gray-800">
                             10
                          </div>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-gray-600"></div>
                    </div>

                    <div className="mt-4 border border-brand-orange/30 text-brand-orange text-center py-3 rounded-xl font-bold text-sm">
                       + Satz hinzufügen
                    </div>

                 </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-6"
              >
                {[
                  { icon: <Zap className="text-brand-gold" />, title: "Sofortige Belohnung", text: "Jede Wiederholung zeigt sofort verbrannte Kalorien. Dopamin-Hit in Echtzeit!" },
                  { icon: <Activity className="text-brand-orange" />, title: "Live Ticker", text: "Parallele Updates mit Motivations-Messages und Meilensteinen." },
                  { icon: <Dna className="text-blue-400" />, title: "Wissenschaftlich präzise", text: "Körperanalyse integriert für 30% genauere Ergebnisse als Standard-Apps." },
                  { icon: <Mic className="text-purple-400" />, title: "Reaktiver Coach", text: "\"Wow, 500 kcal geschafft!\" - Der Coach sieht deine Daten live." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={fadeInUp}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-brand-surface/50 transition-colors border border-transparent hover:border-brand-border"
                  >
                    <div className="p-3 bg-brand-surface rounded-lg border border-brand-border shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-white">{item.title}</h4>
                      <p className="text-brand-muted leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= TRUST SECTION ================= */}
        <section id="trust" className="py-24 relative" aria-label="Trust and Reliability">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Forged in Science</h2>
              <p className="text-brand-muted text-lg">Keine Schätzungen. Echte Daten.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Dna size={40} />, title: "Jackson-Pollock", text: "Wissenschaftlich validierte Körperfett-Messung (7-Punkt). Echte Präzision statt Foto-Gimmicks." },
                { icon: <ShieldCheck size={40} />, title: "Made in Germany", text: "100% DSGVO-konform. Lokale Datenspeicherung. Deine Gesundheitsdaten bleiben bei dir." },
                { icon: <Coins size={40} />, title: "Fair Pricing", text: "Kostenlose Version verfügbar. Premium ab 4,99€/Monat. Premium ab 4,99€/Monat." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-brand-surface/50 border border-brand-border p-8 rounded-2xl text-center hover:border-brand-gold/50 transition-colors group"
                  tabIndex={0}
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-brand-border to-brand-dark rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-brand-text group-hover:text-brand-gold">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-brand-muted">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= MAGMA CORE SECTION ================= */}
        <MagmaCoreSection />

        {/* ================= ROADMAP SECTION ================= */}
        <Roadmap />

        {/* ================= PARALLAX DIVIDER ================= */}
        <ParallaxDivider />

        {/* ================= MOTIVATION GALLERY ================= */}
        <MotivationGallery />

        {/* ================= COMPARISON TABLE ================= */}
        <ComparisonTable />

        {/* ================= FEATURE GRID ================= */}
        <section id="features-list" className="py-24 relative overflow-hidden" aria-label="Additional Features">
           <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15]"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
                {[
                  { icon: "🎮", title: "Avatar Gamification", desc: "Dein Avatar wächst mit deinen Muskeln." },
                  { icon: "📸", title: "Foto-Progress", desc: "Automatische Analyse & Overlay-Tools." },
                  { icon: "📋", title: "Smart Plans", desc: "Pläne, die sich an deine Recovery anpassen." },
                  { icon: "⌚", title: "Apple Watch", desc: "Q2 2026: Nahtlose Health Integration." },
                  { icon: "🧬", title: "Body Age", desc: "Wie alt ist dein Stoffwechsel wirklich?" },
                  { icon: "🎯", title: "Metabolic Factor", desc: "Individueller Stoffwechsel-Typ." },
                ].map((f, i) => (
                  <motion.div 
                    key={i} 
                    variants={fadeInUp}
                    className="group p-6 border border-brand-border rounded-xl bg-brand-surface/60 backdrop-blur-sm hover:bg-brand-surface/90 transition-all hover:border-brand-orange/30 cursor-default hover:-translate-y-1 shadow-lg shadow-black/20" 
                    tabIndex={0}
                  >
                    <motion.div 
                      className="text-4xl mb-4 inline-block origin-left"
                      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {f.icon}
                    </motion.div>
                    <h4 className="font-bold text-white mb-2 text-lg group-hover:text-brand-gold transition-colors">{f.title}</h4>
                    <p className="text-sm text-brand-muted leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </section>
        
        {/* ================= FAQ SECTION ================= */}
        <FAQ />

        {/* ================= EARLY BIRD / CTA ================= */}
        <section id="early-bird" className="py-32 relative overflow-hidden" aria-label="Early Access Sign Up">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 max-w-3xl text-center">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black mb-6"
            >
              Launch-Rabatt sichern 🚀
            </motion.h2>
            <p className="text-xl text-brand-muted mb-10">
              Erhalte 50% Rabatt zum Start und werde Gründungsmitglied der Foundry.
            </p>

            <form onSubmit={handleEarlyAccessSubmit} className="flex flex-col gap-4 mb-8">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein Name (optional)" 
                className="px-6 py-4 rounded-full bg-brand-surface border border-brand-border focus:border-brand-gold focus:outline-none text-white placeholder:text-brand-muted transition-colors"
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Deine E-Mail Adresse" 
                  required
                  className="flex-1 px-6 py-4 rounded-full bg-brand-surface border border-brand-border focus:border-brand-gold focus:outline-none text-white placeholder:text-brand-muted transition-colors"
                  aria-label="Email Address for Early Access"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-brand-orange text-white font-bold text-lg rounded-full hover:bg-brand-gold hover:text-brand-dark transition-all shadow-lg shadow-brand-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Wird gesendet...' : 'Early Access'}
                </button>
              </div>
              
              <input 
                type="text" 
                name="website" 
                style={{ display: 'none' }} 
                tabIndex={-1} 
                autoComplete="off"
              />
            </form>

            {submitStatus && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-4 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}
              >
                {submitStatus.message}
              </motion.div>
            )}

            <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-muted">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Launch-Preis: 4,99€</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Kein Spam</span>
              <span className="flex items-center gap-2"><Globe2 size={16} className="text-green-500" /> Made in Germany</span>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-brand-border py-12 bg-brand-dark" aria-label="Footer">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8 opacity-80">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-orange/30 blur-md rounded-full" />
              <img 
                src="/assets/images/logo.png" 
                alt="FitFoundry Logo" 
                className="w-full h-full object-contain relative z-10 drop-shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.endsWith('png')) {
                    target.src = "/assets/images/logo.webp";
                  }
                }}
              />
            </div>
            <span className="font-bold text-xl text-white">FitFoundry</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-8 text-brand-muted text-sm">
            <button onClick={() => openLegal('impressum')} className="hover:text-brand-gold transition-colors">Impressum</button>
            <button onClick={() => openLegal('datenschutz')} className="hover:text-brand-gold transition-colors">Datenschutz</button>
            <button onClick={() => openLegal('agb')} className="hover:text-brand-gold transition-colors">AGB</button>
            <a href="mailto:info@fitfoundry.de" className="hover:text-brand-gold transition-colors">Support</a>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <a href="https://www.instagram.com/fitfoundry_app/" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-orange transition-colors" aria-label="Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@FitFoundry_app" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-orange transition-colors" aria-label="YouTube">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@fitfoundry_app" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-orange transition-colors" aria-label="TikTok">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>

          <p className="text-brand-muted/50 text-xs">
            © 2025 FitFoundry. All rights reserved. Designed for performance.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
