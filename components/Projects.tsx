import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Project3DCard: React.FC<{ item: any, index: number }> = ({ item, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => { setIsMobile(window.innerWidth < 768); };
        checkMobile(); window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
    
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (isMobile || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX: isMobile ? 0 : rotateX, rotateY: isMobile ? 0 : rotateY, transformStyle: "preserve-3d" }}
            className={`relative rounded-[2rem] overflow-hidden group w-full h-full cursor-pointer bg-gray-900 shadow-xl border border-gray-800 ${item.span || 'col-span-1 row-span-1'}`}
        >
            <div className="w-full h-full relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-out scale-110 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 pointer-events-none">
                    <motion.div style={{ transform: "translateZ(20px)" }} initial={{ y: 20, opacity: 0 }} animate={isInView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.5 }}>
                        <h3 className="text-white font-bold text-2xl md:text-3xl mb-2">{item.title}</h3>
                        <div className="h-1 bg-primary w-12 mb-4"></div>
                        <p className="text-gray-200 text-lg">{item.desc}</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

const Projects: React.FC = () => {
    const { t } = useLanguage();

    const gridItems = [
        {
            type: 'text-main',
            content: t.projects.main_card_title,
            sub: t.projects.main_card_sub,
            span: "md:col-span-1 md:row-span-1"
        },
        {
            type: 'image',
            title: t.projects.items.new_build,
            desc: t.projects.items.new_build_desc,
            image: "/assets/exterior3.jpg",
            span: "md:col-span-2 md:row-span-1" 
        },
        {
            type: 'image',
            title: t.projects.items.renovations,
            desc: t.projects.items.renovations_desc,
            image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2000&auto=format&fit=crop",
            span: "md:col-span-1 md:row-span-2" 
        },
        {
            type: 'image',
            title: t.projects.items.windows,
            desc: t.projects.items.windows_desc,
            image: "/assets/ventana2-reforma.jpg",
            span: "md:col-span-2 md:row-span-1" 
        },
         {
            type: 'image',
            title: t.projects.items.facade_side,
            desc: t.projects.items.facade_side_desc,
            image: "/assets/exterior3.jpg",
            span: "md:col-span-1 md:row-span-1" 
        },
         {
            type: 'image',
            title: t.projects.items.kitchen,
            desc: t.projects.items.kitchen_desc,
            image: "/assets/cocina-reforma.jpg",
            span: "md:col-span-1 md:row-span-1" 
        },
         {
            type: 'image',
            title: t.projects.items.facade_main,
            desc: t.projects.items.facade_main_desc,
            image: "/assets/casa.jpg",
            span: "md:col-span-1 md:row-span-1" 
        }
    ];

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 bg-background-light dark:bg-background-dark min-h-screen w-full perspective-[2000px]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[350px] md:grid-flow-dense pb-12">
                    {gridItems.map((item, index) => {
                        if (item.type === 'text-main') {
                            return (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className={`${item.span} flex flex-col justify-center p-8 bg-white dark:bg-surface-dark rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800`}
                                >
                                    <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">{item.content}</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-lg">{item.sub}</p>
                                </motion.div>
                            );
                        } else {
                            return <Project3DCard key={index} item={item} index={index} />;
                        }
                    })}
                </div>
            </div>
        </motion.section>
    );
};

export default Projects;