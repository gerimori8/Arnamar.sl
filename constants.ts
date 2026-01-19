import { ProjectItem, ServiceItem, StatItem } from "./types";

export const NAV_LINKS = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Sobre nosotros', href: '#nosotros' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Nuestros proyectos', href: '#proyectos' },
    { label: 'Contacto', href: '#contacto' },
];

export const SERVICES: ServiceItem[] = [
    {
        id: '1',
        image: '/assets/obra-nueva-casa-piscina.jpg',
        title: 'Obra nueva',
    },
    {
        id: '2',
        image: '/assets/reforma-integral-cocina-moderna.jpg',
        title: 'Reformas interior',
    },
    {
        id: '3',
        image: '/assets/reforma-exterior-fachada.jpg',
        title: 'Reformas exterior',
    },
    {
        id: '4',
        image: '/assets/instalacion-ventanas-vistas.jpg',
        title: 'Instalación de ventanas',
    }
];

export const PROJECTS: ProjectItem[] = [
    {
        id: '1',
        image: '/assets/obra-nueva-casa-piscina.jpg',
        title: 'Obra nueva',
        description: 'Realizamos obra nueva al gusto del cliente. Contáctanos para más información.'
    },
    {
        id: '2',
        image: '/assets/reforma-bano-ducha.jpg',
        title: 'Reformas',
        description: 'En Arnamar estamos dispuestos a reformar la parte de tu hogar que desees. Contáctanos para más información.'
    },
    {
        id: '3',
        image: '/assets/instalacion-ventanas-vistas.jpg',
        title: 'Instalación ventanas',
        description: 'En Arnamar somos expertos en dar luz a tu hogar. Contáctanos para más información.'
    }
];

export const STATS: StatItem[] = [
    { value: '10+', label: 'Años Exp.' },
    { value: '150+', label: 'Proyectos' },
    { value: '100%', label: 'Satisfacción' },
];