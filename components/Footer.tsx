import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white border-t border-gray-800 transition-colors duration-500 font-body">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/assets/Arnamar20200.jpg" 
                                alt="Arnamar Logo" 
                                className="h-12 w-auto object-contain rounded bg-white p-1"
                            />
                            <div>
                                <h2 className="font-display font-bold text-xl tracking-wide uppercase">
                                    Arnamar
                                </h2>
                                <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium">
                                    2011 SL
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Construcciones y reformas integrales con más de 50 años de experiencia. Calidad, compromiso y tradición familiar.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-l-2 border-primary pl-3">
                            Enlaces Rápidos
                        </h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#inicio" className="hover:text-primary transition-colors">Inicio</a></li>
                            <li><a href="#nosotros" className="hover:text-primary transition-colors">Sobre Nosotros</a></li>
                            <li><a href="#servicios" className="hover:text-primary transition-colors">Servicios</a></li>
                            <li><a href="#proyectos" className="hover:text-primary transition-colors">Proyectos</a></li>
                            <li><a href="#contacto" className="hover:text-primary transition-colors">Contacto</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-l-2 border-primary pl-3">
                            Servicios
                        </h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>Obra Nueva</li>
                            <li>Reformas Integrales</li>
                            <li>Reformas de Cocinas</li>
                            <li>Reformas de Baños</li>
                            <li>Rehabilitación de Fachadas</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-l-2 border-primary pl-3">
                            Contacto
                        </h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <span className="material-icons text-primary text-sm mt-1">location_on</span>
                                <span>Calle Pintor Pahissa, 17<br/>Barcelona</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-icons text-primary text-sm">email</span>
                                <a href="mailto:arnamar2011sl@gmail.com" className="hover:text-primary transition-colors">arnamar2011sl@gmail.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-icons text-primary text-sm">phone</span>
                                <a href="tel:670968931" className="hover:text-primary transition-colors">670 968 931</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© {currentYear} Arnamar 2011 SL. {t.footer.rights}.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Aviso Legal</a>
                        <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;