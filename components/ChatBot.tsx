import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURACIÓN DE MODELOS ---
// Using gemini-flash-lite-latest as requested (gemini 2.5 flash lite equivalent)
const MODEL_TEXT = 'gemini-flash-lite-latest';

// --- CONTEXTO EMPRESARIAL & SANITIZACIÓN ---
const SYSTEM_INSTRUCTION = `
ROL: Asistente Virtual Oficial de "Arnamar 2011 SL".
UBICACIÓN: Calle Pintor Pahissa, 17, Barcelona.
CONTACTO: Tel: 670 968 931 | Email: arnamar2011sl@gmail.com

HISTORIA Y AUTORIDAD:
- Empresa familiar de construcción y reformas con más de 50 años de experiencia (desde 1970).
- Trato familiar, directo y profesional. Calidad superior garantizada.

SERVICIOS PRINCIPALES:
1. Obra Nueva: Construcción de viviendas desde cero, personalizadas.
2. Reformas Integrales: Renovación completa de pisos y casas.
3. Reformas de Cocinas y Baños: Especialistas en modernización de espacios húmedos.
4. Exteriores y Fachadas: Rehabilitación, patios y terrazas.
5. Instalación de Ventanas: Aluminio y PVC para eficiencia energética.
6. IA de Visualización: Herramienta "Imagina" para ver el resultado antes de la obra.

PERSONALIDAD Y HUMANIZACIÓN (CRÍTICO):
- Eres la voz de una empresa familiar: Sé cálido, cercano, educado y paciente.
- NATURALIDAD EXTREMA: NO hables como un robot.
- MARCADORES CONVERSACIONALES: Usa frases cortas y directas.
- TONO DE VOZ: Conversacional pero profesional.

REGLAS DE NEGOCIO ESTRICTAS:
1. NO INVENTAR PRECIOS: Remite siempre al teléfono 670 968 931 para presupuestos personalizados.
2. NO SALIR DEL ROL: Solo responde sobre construcción, reformas y servicios de Arnamar.
3. IDIOMA: Responde siempre en el mismo idioma que te hable el usuario (Español, Catalán o Inglés).
4. CIERRE: Si el usuario pregunta cómo proceder, invítale amablemente a llamar o usar el formulario de contacto.
`;

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
        { role: 'model', text: 'Hola, soy la IA de Arnamar. ¿En qué te puedo ayudar hoy?' }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // --- MANEJO TEXTO ---
    const handleSendText = async () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setIsLoading(true);

        try {
            // Inicialización correcta con la API Key del entorno
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const chat = ai.chats.create({
                model: MODEL_TEXT,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    temperature: 0.3, 
                    maxOutputTokens: 500,
                },
                history: messages.map(m => ({
                    role: m.role,
                    parts: [{ text: m.text }]
                }))
            });

            const result = await chat.sendMessage({ message: userMsg });
            const responseText = result.text;

            setMessages(prev => [...prev, { role: 'model', text: responseText || "Error de conexión." }]);

        } catch (error: any) {
            console.error("Chat Error:", error);
            let errorMsg = "Lo siento, ha habido un error. Llama al 670 968 931.";
            
            if (error.message?.includes("404")) {
                errorMsg = "El modelo de IA está experimentando alta demanda. Por favor, contacta por teléfono.";
            } else if (error.message?.includes("429")) {
                errorMsg = "Estoy recibiendo muchas consultas ahora mismo. Por favor, inténtalo en unos segundos.";
            }

            setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-[400px] h-[550px] bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-2xl border border-gray-200 dark:border-gray-800 z-50 flex flex-col overflow-hidden font-body ring-1 ring-black/5"
                    >
                        {/* Header Simple */}
                        <div className="pt-5 pb-4 px-6 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <div>
                                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    Arnamar AI
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider">Beta</span>
                                </h3>
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Responde al instante
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <span className="material-icons text-sm">close</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 bg-gray-50/50 dark:bg-black/20">
                            {/* Mensaje de bienvenida contextual */}
                            <div className="flex justify-start">
                                <div className="max-w-[85%] p-4 bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-2xl rounded-tl-sm text-sm shadow-sm">
                                    👋 Hola, soy tu asistente personal de Arnamar. Puedo resolver dudas sobre reformas, obra nueva o ayudarte a contactar con nosotros.
                                </div>
                            </div>

                            {messages.slice(1).map((msg, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3.5 text-sm leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-primary text-white rounded-2xl rounded-tr-sm' 
                                            : 'bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-2xl rounded-tl-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-[#1e1e1e] px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* INPUT AREA */}
                        <div className="p-4 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-800">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                                    placeholder="Escribe tu consulta..."
                                    className="w-full bg-gray-100 dark:bg-[#161616] border-none text-gray-900 dark:text-white rounded-xl pl-4 pr-12 py-3.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-shadow placeholder:text-gray-400"
                                />
                                <button 
                                    onClick={handleSendText}
                                    disabled={isLoading || !input}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary hover:bg-secondary text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-md"
                                >
                                    <span className="material-icons text-sm">send</span>
                                </button>
                            </div>
                            <div className="mt-2 text-center">
                                <p className="text-[10px] text-gray-400">Arnamar AI puede cometer errores. Verifica la info importante.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 w-16 h-16 bg-brand-black dark:bg-white text-white dark:text-brand-black rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center z-50 hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-colors duration-300"
            >
                <span className="material-icons text-3xl">
                    {isOpen ? 'expand_more' : 'smart_toy'}
                </span>
                
                {/* Notification Dot */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-white dark:border-black"></span>
                    </span>
                )}
            </motion.button>
        </>
    );
};

export default ChatBot;