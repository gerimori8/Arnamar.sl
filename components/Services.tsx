import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const ServiceCard: React.FC<{ service: any; index: number }> = ({ service, index }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative h-[450px] md:h-[550px] w-full rounded-[2.5rem] bg-white dark:bg-surface-dark overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800"
        >
            {/* Image Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
                />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12 transition-opacity duration-300">
                <div className="transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                    <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight drop-shadow-md">
                        {service.title}
                    </h3>
                    <div className="h-1 w-12 bg-primary rounded-full mt-4 transition-all duration-500 group-hover:w-20"></div>
                </div>
            </div>
        </motion.div>
    );
};

const Services: React.FC = () => {
    const { t } = useLanguage();

    // LISTA DE SERVICIOS DINÁMICA
    const servicesList = [
        {
            title: t.services.items.new_build,
            image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" 
        },
        {
            title: t.services.items.renovation_in,
            image: "/assets/baño.jpg" 
        },
        {
            title: t.services.items.renovation_out,
            image: "/assets/exterior3.jpg" 
        },
        {
            title: t.services.items.windows,
            image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=2000&auto=format&fit=crop" 
        }
    ];

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 md:py-32 bg-background-light dark:bg-background-dark min-h-screen relative overflow-hidden w-full"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
                    <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="font-display text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tighter"
                    >
                        {t.services.title}
                    </motion.h2>
                    <motion.p 
                         initial={{ y: 20, opacity: 0 }}
                         whileInView={{ y: 0, opacity: 1 }}
                         transition={{ delay: 0.1 }}
                         className="text-xl text-gray-500 dark:text-gray-400 mb-6"
                    >
                        {t.services.subtitle}
                    </motion.p>
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-300 text-lg space-y-4"
                    >
                        <p>{t.services.desc1}</p>
                        <p>{t.services.desc2}</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                    {servicesList.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default Services;