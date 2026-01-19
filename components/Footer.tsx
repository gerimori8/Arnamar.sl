import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-brand-blue text-white py-12 border-t border-blue-800/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    
                    {/* Brand / Logo */}
                    <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-4">
                        {/* LOGO CHANGED TO JPG */}
                        <img 
                            src="/assets/logo.jpg" 
                            alt="Arnamar Logo" 
                            className="h-16 w-auto object-contain bg-white/10 p-2 rounded-lg backdrop-blur-sm"
                        />
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h2 className="font-display font-bold text-2xl tracking-tighter text-white">
                                    ARNAMAR <span className="text-sm font-normal opacity-80">2011 SL</span>
                                </h2>
                            </div>
                            <p className="text-sm text-blue-100 opacity-80">{t.footer.since}</p>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center">
                         <p className="text-sm text-blue-100 opacity-70">
                            ©2024 Arnamar 2011 SL - {t.footer.rights}
                         </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;