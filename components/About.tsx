import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
    const { t } = useLanguage();

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="py-24 bg-white dark:bg-[#181818] min-h-screen"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-16 items-start">
                    
                    <motion.div 
                        className="w-full md:w-1/2"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="font-display text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-12">
                            {t.about.title} <span className="text-primary inline-block transform hover:scale-110 transition-transform origin-left">{t.about.title_highlight}</span>
                        </h2>
                        
                        <div className="space-y-8 text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="border-l-4 border-primary pl-4"
                            >
                                {t.about.p1}
                            </motion.p>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {t.about.p2}
                            </motion.p>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                {t.about.p3}
                            </motion.p>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 }}
                                className="bg-background-light dark:bg-surface-dark p-8 rounded-2xl shadow-inner border border-gray-100 dark:border-gray-800"
                            >
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {t.about.offer}
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="w-full md:w-1/2 mt-8 md:mt-0"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl group">
                            {/* IMAGEN DE STOCK: Representando planificación y experiencia */}
                            <motion.img 
                                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
                                alt="Equipo de Arquitectura y Construcción" 
                                className="absolute inset-0 w-full h-full object-cover"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 1.5 }}
                            />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
                            <motion.div 
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.2, type: "spring" }}
                                className="absolute bottom-10 right-10 bg-white/95 dark:bg-surface-dark/95 backdrop-blur p-8 rounded-xl shadow-2xl max-w-xs border-l-8 border-primary"
                            >
                                <span className="block text-6xl font-bold text-primary mb-1">3</span>
                                <span className="text-sm uppercase tracking-wider font-bold text-gray-800 dark:text-white">{t.about.badge}</span>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.section>
    );
};

export default About;