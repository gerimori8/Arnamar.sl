import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

// --- ANIMATION UTILS ---
const StaggerContainer: React.FC<{ children: React.ReactNode, delay?: number }> = ({ children, delay = 0 }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={{
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: delay }
            }
        }}
    >
        {children}
    </motion.div>
);

const RevealItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 20, stiffness: 100 } }
        }}
    >
        {children}
    </motion.div>
);

const ParallaxImage: React.FC<{ src: string, alt: string }> = ({ src, alt }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div ref={ref} className="overflow-hidden rounded-[2rem] h-full w-full relative shadow-2xl">
            <motion.img 
                style={{ y, scale: 1.15 }}
                src={src} 
                alt={alt} 
                className="w-full h-full object-cover will-change-transform" 
            />
        </div>
    );
};

const MagneticButton: React.FC<{ to: string, variant?: 'primary' | 'outline', children: React.ReactNode }> = ({ to, variant = 'primary', children }) => {
    return (
        <Link to={to}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-full font-bold transition-all relative overflow-hidden group ${
                    variant === 'primary' 
                    ? 'bg-brand-black text-white shadow-xl hover:shadow-2xl' 
                    : 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
                <span className="relative z-10">{children}</span>
                {variant === 'primary' && (
                    <div className="absolute inset-0 h-full w-full bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out z-0"></div>
                )}
            </motion.button>
        </Link>
    );
};

const Home: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="w-full overflow-hidden">
            
            {/* HERO SECTION WITH PARALLAX */}
            <section className="relative min-h-screen flex items-center justify-center pt-24 pb-32 overflow-hidden bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Text Content */}
                        <div className="w-full lg:w-1/2 order-2 lg:order-1">
                            <StaggerContainer>
                                <RevealItem>
                                    <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 backdrop-blur-md">
                                        <span className="text-primary font-bold uppercase tracking-widest text-[10px]">{t.hero.since}</span>
                                    </div>
                                </RevealItem>
                                <RevealItem>
                                    <h1 className="font-display text-7xl md:text-9xl font-bold text-gray-900 dark:text-white leading-[0.85] tracking-tighter mb-2">
                                        Arnamar
                                    </h1>
                                </RevealItem>
                                <RevealItem>
                                    <h1 className="font-display text-7xl md:text-9xl font-bold text-primary leading-[0.85] tracking-tighter mb-8">
                                        2011 SL
                                    </h1>
                                </RevealItem>
                                <RevealItem>
                                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light max-w-lg mb-10 leading-relaxed">
                                        {t.hero.subtitle}
                                    </p>
                                </RevealItem>
                                <RevealItem>
                                    <div className="flex flex-wrap gap-4">
                                        <MagneticButton to="/contacto" variant="primary">{t.hero.cta_contact}</MagneticButton>
                                        <MagneticButton to="/proyectos" variant="outline">{t.hero.cta_projects}</MagneticButton>
                                    </div>
                                </RevealItem>
                            </StaggerContainer>
                        </div>

                        {/* Hero Image - casa.jpg (LOCAL) */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 1, delay: 0.2 }}
                            className="w-full lg:w-1/2 order-1 lg:order-2 aspect-[4/3] md:aspect-[16/9] max-h-[80vh]"
                        >
                             <ParallaxImage src="/assets/casa.jpg" alt="Obra Nueva Arnamar" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section className="py-32 bg-white/50 dark:bg-black/20 backdrop-blur-sm relative border-t border-gray-100 dark:border-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-16 mb-20">
                        <div className="md:w-1/2">
                            <StaggerContainer>
                                <RevealItem>
                                    <h2 className="font-display text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                                        {t.services.title}
                                    </h2>
                                </RevealItem>
                            </StaggerContainer>
                        </div>
                        <div className="md:w-1/2">
                             <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                                {t.services.desc1}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: t.services.items.new_build, img: "/assets/baño.jpg" }, 
                            { title: t.services.items.renovation_in, img: "/assets/baño-reforma2.jpg" }, 
                            { title: t.services.items.renovation_out, img: "/assets/exterior3.jpg" }, 
                            { title: t.services.items.windows, img: "/assets/ventana-reforma.jpg" } 
                        ].map((service, idx) => (
                            <StaggerContainer key={idx} delay={idx * 0.1}>
                                <RevealItem>
                                    <Link to="/servicios" className="group relative h-[450px] w-full block rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors z-10"></div>
                                        <img src={service.img} alt={service.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 will-change-transform" />
                                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-3xl font-display font-bold text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{service.title}</h4>
                                                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                                    <span className="material-icons">arrow_forward</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </RevealItem>
                            </StaggerContainer>
                        ))}
                    </div>
                </div>
            </section>

             {/* PROYECTOS DESTACADOS */}
            <section className="py-32 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <StaggerContainer>
                        <RevealItem>
                             <div className="text-center mb-20 max-w-3xl mx-auto">
                                <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
                                    {t.projects.title}
                                </h2>
                            </div>
                        </RevealItem>
                    </StaggerContainer>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                title: t.projects.items.new_build, 
                                desc: t.projects.items.new_build_desc,
                                img: "/assets/exterior3.jpg" 
                            },
                            { 
                                title: t.projects.items.renovations, 
                                desc: t.projects.items.renovations_desc,
                                img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2000&auto=format&fit=crop" 
                            },
                            { 
                                title: t.projects.items.windows, 
                                desc: t.projects.items.windows_desc,
                                img: "/assets/ventana2-reforma.jpg" 
                            }
                        ].map((project, idx) => (
                            <StaggerContainer key={idx} delay={idx * 0.1}>
                                <RevealItem>
                                     <Link to="/proyectos" className="group relative h-[500px] block rounded-[2rem] overflow-hidden cursor-pointer bg-gray-900 border border-gray-800">
                                        <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-60" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
                                        
                                        <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <h3 className="text-2xl font-bold mb-3 text-white">{project.title}</h3>
                                            <p className="text-gray-300 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">
                                                {project.desc}
                                            </p>
                                            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                                <span>{t.projects.cta}</span>
                                                <span className="material-icons text-sm">arrow_forward</span>
                                            </div>
                                            <div className="w-12 h-1 bg-primary mt-4 group-hover:w-full transition-all duration-500"></div>
                                        </div>
                                     </Link>
                                </RevealItem>
                            </StaggerContainer>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA CONTACTO FINAL */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
                    <RevealItem>
                        <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            {t.cta_section.title}
                        </h2>
                    </RevealItem>
                    <RevealItem>
                        <p className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                            {t.cta_section.subtitle}
                        </p>
                    </RevealItem>
                    <RevealItem>
                        <Link to="/contacto">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto"
                            >
                                <span>{t.cta_section.button}</span>
                                <span className="material-icons">arrow_forward</span>
                            </motion.button>
                        </Link>
                    </RevealItem>
                </div>
            </section>

        </div>
    );
};

export default Home;