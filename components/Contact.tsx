import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Contact: React.FC = () => {
    const { t } = useLanguage();

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 bg-background-light dark:bg-background-dark min-h-screen relative overflow-hidden"
        >
             {/* Background decoration */}
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                    
                    {/* Info */}
                    <div className="space-y-12">
                        <div>
                            <span className="text-primary font-bold tracking-[0.2em] uppercase">{t.contact.tag}</span>
                            <h2 className="font-display text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-8 whitespace-pre-line">
                                {t.contact.title}
                            </h2>
                        </div>

                        <div className="space-y-8">
                             <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1e1e1e] shadow-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-icons">location_on</span>
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">Calle Pintor Pahissa, 17 | Barcelona</p>
                                </div>
                             </div>

                             <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1e1e1e] shadow-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-icons">email</span>
                                </div>
                                <div>
                                    <a href="mailto:arnamar2011sl@gmail.com" className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">arnamar2011sl@gmail.com</a>
                                </div>
                             </div>

                             <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1e1e1e] shadow-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-icons">phone</span>
                                </div>
                                <div>
                                    <a href="tel:670968931" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">670 968 931</a>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-[#121212] p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
                        
                        <form action="https://formsubmit.co/arnamar2011sl@gmail.com" method="POST" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="nombre" className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.form.name}</label>
                                    <input type="text" id="nombre" name="nombre" className="w-full px-5 py-4 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.form.email}</label>
                                    <input type="email" id="email" name="email" className="w-full px-5 py-4 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" required />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="telefono" className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.form.phone}</label>
                                    <input type="tel" id="telefono" name="telefono" className="w-full px-5 py-4 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="direccion" className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.form.address}</label>
                                    <input type="text" id="direccion" name="direccion" className="w-full px-5 py-4 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="asunto" className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.form.subject}</label>
                                <input type="text" id="asunto" name="asunto" className="w-full px-5 py-4 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="mensaje" className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.form.message}</label>
                                <textarea id="mensaje" name="mensaje" rows={4} placeholder={t.contact.form.placeholder} className="w-full px-5 py-4 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"></textarea>
                            </div>

                            <button type="submit" className="w-full py-5 px-8 bg-primary text-white font-bold rounded-xl hover:bg-secondary hover:shadow-lg transition-all transform hover:-translate-y-1">
                                {t.contact.form.send}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Satellite Map with Fluid Transition */}
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 relative z-10"
                >
                    <iframe 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        loading="lazy" 
                        allowFullScreen 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación Arnamar"
                        className="filter grayscale-[20%] contrast-125 hover:grayscale-0 transition-all duration-700"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.687483694086!2d2.1221893!3d41.3809066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a498877197c75f%3A0x6295669055811c0!2sCarrer%20del%20Pintor%20Pahissa%2C%2017%2C%2008028%20Barcelona!5e0!3m2!1ses!2ses!4v1710000000000!5m2!1ses!2ses&t=k"
                    ></iframe>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Contact;