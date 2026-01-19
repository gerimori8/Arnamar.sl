import React, { useState, useEffect } from 'react';

const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Delay showing to be less intrusive initially
        const timer = setTimeout(() => {
            const accepted = localStorage.getItem('cookies-accepted');
            if (!accepted) {
                setIsVisible(true);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleAccept = () => {
        setIsVisible(false);
        localStorage.setItem('cookies-accepted', 'true');
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <div 
            className={`fixed bottom-0 w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center md:text-left">
                    Usamos cookies en nuestra página web para ver cómo interactúas con ella. Al aceptarlas, estás de acuerdo con nuestro uso de dichas cookies.
                </p>
                <div className="flex gap-3">
                    <button onClick={handleClose} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Opciones
                    </button>
                    <button onClick={handleAccept} className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                        Aceptar
                    </button>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <span className="material-icons text-xl">close</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
