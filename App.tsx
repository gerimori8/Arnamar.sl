import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Imagine from './components/Imagine'; 
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ChatBot from './components/ChatBot';

// --- BACKGROUND CANVAS ANIMATION (Simulating WebGL Particles) ---
const FluidBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
        const particleCount = 30; // Reduced count for cleaner look

        for(let i=0; i<particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3, // Slower movement
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 1
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Update and Draw Particles
            ctx.fillStyle = "rgba(141, 160, 110, 0.1)"; // Primary Color Very Low Opacity
            
            for(let i=0; i<particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if(p.x < 0 || p.x > width) p.vx *= -1;
                if(p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Connections
                for(let j=i+1; j<particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);

                    if(dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(141, 160, 110, ${0.05 - dist/3000})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const animId = requestAnimationFrame(animate);
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-50 dark:opacity-20" />;
};

const AnimatedRoutes: React.FC = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/nosotros" element={<About />} />
                <Route path="/servicios" element={<Services />} />
                <Route path="/proyectos" element={<Projects />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/imagina" element={<Imagine />} /> 
            </Routes>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        // DEFAULT TO LIGHT MODE
        // Only set dark if explicitly stored in localStorage
        if (localStorage.theme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

    const noiseSvg = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

    return (
        <LanguageProvider>
            <Router>
                <div className="min-h-screen flex flex-col relative w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 transition-colors duration-500">
                    {/* Scroll Progress Indicator */}
                    <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]" style={{ scaleX }} />

                    {/* DYNAMIC FLUID BACKGROUND */}
                    <FluidBackground />
                    
                    {/* NOISE OVERLAY FOR TEXTURE */}
                    <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-[1] mix-blend-overlay"
                         style={{ backgroundImage: `url("${noiseSvg}")` }} 
                    />

                    <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                    <main className="flex-grow z-10 w-full relative">
                        <AnimatedRoutes />
                    </main>
                    <Footer />
                    <ChatBot />
                    <CookieBanner />
                </div>
            </Router>
        </LanguageProvider>
    );
};

export default App;