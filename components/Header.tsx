import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../translations';

interface HeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const { language, setLanguage, t } = useLanguage();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { label: t.nav.home, path: '/' },
        { label: t.nav.about, path: '/nosotros' },
        { label: t.nav.services, path: '/servicios' },
        { label: t.nav.projects, path: '/proyectos' },
        { label: t.nav.imagine, path: '/imagina', special: true },
    ];

    const isActive = (path: string) => location.pathname === path;

    // Uso de imágenes de flagcdn para banderas reales
    // Nota: Para Cataluña usamos Wikimedia ya que flagcdn no siempre soporta regiones específicas con fiabilidad
    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'es', label: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
        { code: 'ca', label: 'Català', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Catalonia.svg/50px-Flag_of_Catalonia.svg.png' },
        { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/gb.png' }
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#050505]/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo & Brand */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-3 group" onClick={() => window.scrollTo(0, 0)}>
                         {/* LOGO IMAGE */}
                         <img 
                            src="/assets/Arnamar20200.jpg" 
                            alt="Arnamar Logo" 
                            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-md"
                         />
                         <div className="flex flex-col relative">
                            <h1 className="font-display font-bold text-2xl tracking-tighter text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                ARNAMAR
                            </h1>
                            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold absolute -bottom-3 left-0 w-full text-center group-hover:tracking-[0.5em] transition-all">
                                2011 SL
                            </span>
                         </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-1 items-center bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-full border border-gray-200 dark:border-gray-700/50">
                        {navLinks.map(link => (
                            <Link 
                                key={link.path}
                                to={link.path}
                                onClick={() => window.scrollTo(0, 0)}
                                className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isActive(link.path) ? 'text-black dark:text-white bg-white dark:bg-black shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
                            >
                                <span className="flex items-center gap-2 relative z-10">
                                    {link.label}
                                    {link.special && (
                                        <span className="flex h-1.5 w-1.5 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                                        </span>
                                    )}
                                </span>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                         {/* Language Selector (Click-based) */}
                        <div className="relative" ref={langMenuRef}>
                            <button 
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                            >
                                <img 
                                    src={currentLang.flag} 
                                    alt={currentLang.label} 
                                    className="w-5 h-auto rounded-sm object-cover shadow-sm"
                                />
                                <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">{currentLang.code.toUpperCase()}</span>
                                <span className={`material-icons text-sm text-gray-500 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`}>arrow_drop_down</span>
                            </button>

                            <AnimatePresence>
                                {isLangMenuOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#121212] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setIsLangMenuOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 text-xs font-bold uppercase flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${language === lang.code ? 'text-primary bg-primary/5' : 'text-gray-600 dark:text-gray-400'}`}
                                            >
                                                <img 
                                                    src={lang.flag} 
                                                    alt={lang.label} 
                                                    className="w-5 h-auto rounded-sm object-cover shadow-sm" 
                                                />
                                                {lang.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link 
                            to="/contacto"
                            className="px-6 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform"
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            {t.nav.contact_btn}
                        </Link>

                        <button 
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-icons text-lg text-gray-600 dark:text-gray-300">
                                {isDarkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2">
                            <span className="material-icons text-gray-600 dark:text-gray-300">
                                {isDarkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            <span className="material-icons text-3xl text-gray-800 dark:text-white">
                                {isMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                             {/* Mobile Language Selector */}
                            <div className="flex justify-center gap-4 py-4 border-b border-gray-100 dark:border-gray-800 mb-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase flex items-center gap-2 border ${language === lang.code ? 'border-primary text-primary bg-primary/10' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
                                    >
                                        <img src={lang.flag} alt={lang.code} className="w-4 h-auto rounded-sm" />
                                        {lang.code}
                                    </button>
                                ))}
                            </div>

                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}
                                    className={`block px-4 py-4 text-xl font-bold tracking-tight rounded-xl ${isActive(link.path) ? 'bg-gray-100 dark:bg-gray-800 text-primary' : 'text-gray-600 dark:text-gray-300'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link 
                                to="/contacto"
                                onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}
                                className="block mt-4 text-center py-4 bg-primary text-white font-bold rounded-xl mx-2 shadow-lg shadow-primary/30"
                            >
                                {t.nav.contact_btn}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Header;