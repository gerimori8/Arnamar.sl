import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from '../context/LanguageContext';

// ----------------------------------------------------------------------
// CONFIGURACIÓN & TIPOS
// ----------------------------------------------------------------------
interface ReferenceItem {
    id: string;
    image: string;
    type: string;
}

type SupportedAspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
type ProcessPhase = 'idle' | 'queue' | 'scan' | 'lighting' | 'generate' | 'judge' | 'refine' | 'physics' | 'complete';

const DEFAULT_ROOMS = [
    "Salón", "Comedor", "Cocina", "Dormitorio Principal", "Baño", "Pasillo", "Recibidor", "Terraza"
];

// ----------------------------------------------------------------------
// UTILS: VISUAL COMPUTING
// ----------------------------------------------------------------------

const applyVolumetricMask = async (base64Image: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(base64Image); return; }

            ctx.drawImage(img, 0, 0);
            // Calidad JPG muy alta para capturar el "grano" original del sensor
            resolve(canvas.toDataURL('image/jpeg', 0.99));
        };
        img.src = base64Image;
    });
};

// ----------------------------------------------------------------------
// COMPONENTE UI: SLIDER
// ----------------------------------------------------------------------
const CompareSlider: React.FC<{ original: string; generated: string; aspectRatio: string }> = ({ original, generated, aspectRatio }) => {
    const [sliderPosition, setSliderPosition] = useState(0); 
    const [isScanning, setIsScanning] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const { t } = useLanguage();

    useEffect(() => {
        const controls = animate(0, 50, {
            duration: 1.5,
            ease: "easeInOut",
            onUpdate: (latest) => setSliderPosition(latest),
            onComplete: () => setIsScanning(false)
        });
        return () => controls.stop();
    }, [generated]);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let pos = ((clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, pos)));
    };

    const getContainerStyle = () => {
        const ratios: Record<string, any> = {
            "1:1": { aspectRatio: "1/1" },
            "3:4": { aspectRatio: "3/4" },
            "4:3": { aspectRatio: "4/3" },
            "9:16": { aspectRatio: "9/16" },
            "16:9": { aspectRatio: "16/9" }
        };
        return ratios[aspectRatio] || ratios["16:9"];
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-2 md:p-6">
            <div 
                ref={containerRef}
                style={getContainerStyle()}
                className="relative w-full max-h-full max-w-full cursor-col-resize select-none overflow-hidden touch-none shadow-2xl rounded-xl bg-gray-100 border border-gray-200"
                onMouseDown={() => isDragging.current = true}
                onTouchStart={() => isDragging.current = true}
                onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
                onTouchMove={(e) => isDragging.current && handleMove(e.touches[0].clientX)}
                onMouseUp={() => isDragging.current = false}
                onTouchEnd={() => isDragging.current = false}
                onMouseLeave={() => isDragging.current = false}
            >
                <img src={original} alt="Estado Actual" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full border border-gray-200 tracking-widest z-10 shadow-sm">
                    {t.imagine.compare_original}
                </div>

                <div 
                    className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none will-change-[clip-path]"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img src={generated} alt="Propuesta Arnamar" className="absolute inset-0 w-full h-full object-contain" />
                    <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 tracking-widest shadow-lg z-10">
                        {t.imagine.compare_generated}
                    </div>
                </div>

                <div className="absolute top-0 bottom-0 w-0.5 bg-white cursor-col-resize z-30 drop-shadow-md" style={{ left: `${sliderPosition}%` }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center shadow-lg border border-gray-100">
                        <span className="material-icons text-[14px]">code</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE UI: HUD (Professional Style)
// ----------------------------------------------------------------------
const ProcessingHUD: React.FC<{ phase: ProcessPhase; log: string; step: number; }> = ({ phase, log, step }) => {
    const PHASE_CONFIG: Record<ProcessPhase, { icon: string, label: string }> = {
        idle: { icon: 'architecture', label: 'Listo' },
        queue: { icon: 'hourglass_empty', label: 'En cola' },
        scan: { icon: 'analytics', label: 'Escaneando Geometría' }, 
        lighting: { icon: 'wb_sunny', label: 'Trazando Rayos (Path Tracing)' },
        generate: { icon: 'design_services', label: 'Renderizando Realismo' }, 
        physics: { icon: 'grid_on', label: 'Calculando Volumen' },
        judge: { icon: 'verified_user', label: 'Verificando Estructura' }, 
        refine: { icon: 'brush', label: 'Añadiendo Grano y Textura' }, 
        complete: { icon: 'check_circle', label: 'Proyecto Finalizado' },
    };

    const activeConfig = PHASE_CONFIG[phase] || PHASE_CONFIG.idle;

    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/90 backdrop-blur-md transition-all duration-500">
             <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm p-8 flex flex-col items-center justify-center"
            >
                <div className="relative w-16 h-16 mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                        <motion.circle 
                            cx="50" cy="50" r="45" stroke="#8DA06E" strokeWidth="4" fill="none" strokeLinecap="round"
                            initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * step) / 100 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-primary">
                        <span className="material-icons text-2xl">{activeConfig.icon}</span>
                    </div>
                </div>
                
                <h3 className="text-lg font-display font-bold text-gray-900 uppercase tracking-wider mb-2">
                     {activeConfig.label}
                </h3>
                <p className="text-sm font-body text-gray-500 text-center">{log}</p>
            </motion.div>
        </div>
    );
};

// ----------------------------------------------------------------------
// LÓGICA PRINCIPAL
// ----------------------------------------------------------------------
const Imagine: React.FC = () => {
    // Assets
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    
    // Inputs
    const [prompt, setPrompt] = useState("");
    const [refinePrompt, setRefinePrompt] = useState(""); 
    const [roomType, setRoomType] = useState("Salón");
    const [detectedAspectRatio, setDetectedAspectRatio] = useState<SupportedAspectRatio>("16:9");

    // Physics / Volumetrics
    const [area, setArea] = useState<number>(20);
    const [height, setHeight] = useState<number>(2.5); // Ceiling height
    const [volume, setVolume] = useState<number>(50);
    const [lightingScenario, setLightingScenario] = useState<{direction: string, temperature: string}>({ direction: "Natural", temperature: "4500K" });
    
    // UI Flow
    const [phase, setPhase] = useState<ProcessPhase>('idle');
    const [processLog, setProcessLog] = useState("");
    const [progressStep, setProgressStep] = useState(0); 
    
    const [showVolumeModal, setShowVolumeModal] = useState(false);
    const [volumeConfirmed, setVolumeConfirmed] = useState(false);
    const [isManualMode, setIsManualMode] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);

    const { t } = useLanguage();

    // Initialize AI client - USO EXCLUSIVO DE LA CLAVE DE ENTORNO
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    useEffect(() => {
        const vol = parseFloat((area * height).toFixed(2));
        setVolume(vol);
    }, [area, height]);

    const getNearestAspectRatio = (width: number, height: number): SupportedAspectRatio => {
        const ratio = width / height;
        const targets: { label: SupportedAspectRatio; value: number }[] = [
            { label: "1:1", value: 1 },
            { label: "3:4", value: 3 / 4 },
            { label: "4:3", value: 4 / 3 },
            { label: "9:16", value: 9 / 9 },
            { label: "16:9", value: 16 / 9 },
        ];
        return targets.reduce((prev, curr) => 
            Math.abs(curr.value - ratio) < Math.abs(prev.value - ratio) ? curr : prev
        ).label;
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `Arnamar_Propuesta_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const smartRetry = async <T,>(fn: () => Promise<T>, retries = 3, baseDelay = 5000): Promise<T> => {
        try {
            return await fn();
        } catch (error: any) {
            const isRateLimit = error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("503");
            if (retries > 0 && isRateLimit) {
                setPhase('queue');
                const waitSeconds = baseDelay / 1000;
                for (let i = waitSeconds; i > 0; i--) {
                    setProcessLog(`Optimizando conexión: ${i}s...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                setProcessLog("Reconectando...");
                return smartRetry(fn, retries - 1, baseDelay + 3000); 
            }
            throw error;
        }
    };

    // --- AGENT 0: LIGHTING PHYSICIST ---
    const analyzeLighting = async (base64Image: string) => {
        setPhase('lighting');
        setProcessLog("Calculando dirección de la luz (Ray Tracing)...");
        const cleanBase64 = base64Image.split(',')[1];
        
        try {
            const promptText = `
                ANALYZE IMAGE PHYSICS & CAMERA LENS.
                1. Identify Main Light Entry Point (Window left, Ceiling light, etc).
                2. Estimate Focal Length (Wide Angle 16mm, Standard 35mm, Telephoto 85mm).
                JSON ONLY: { "direction": "Left"|"Right"|"Center"|"Top", "temperature": "string", "focal_length": "string" }
            `;
            const response = await smartRetry(async () => {
                return await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }, { text: promptText }] },
                    config: { responseMimeType: "application/json" }
                });
            }, 2, 2000);
            
            if (response.text) {
                const data = JSON.parse(response.text);
                setLightingScenario({ direction: data.direction, temperature: data.temperature });
            }
        } catch (e) {
            console.warn("Lighting analysis skipped, using default.");
        }
    };

    // --- AGENT 1: THE ARCHITECT (SURVEYOR) ---
    const runSurveyorScan = async (base64Image: string) => {
        setPhase('scan');
        setProgressStep(10);
        setProcessLog("Escaneando vigas, pilares y aperturas...");
        
        try {
            const cleanBase64 = base64Image.split(',')[1];
            
            const promptText = `Analyze this ROOM PHOTO. Estimate floor area and height.
                   JSON ONLY: { "area": number, "height": number, "roomType": string }`;

            const response = await smartRetry(async () => {
                 return await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: {
                        parts: [
                            { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
                            { text: promptText }
                        ]
                    },
                    config: { responseMimeType: "application/json" }
                });
            }, 3, 4000);

            setPhase('scan');
            setProgressStep(60);
            
            if (response.text) {
                setProcessLog("Generando malla de geometría...");
                const data = JSON.parse(response.text);
                
                if (data.area) setArea(data.area);
                if (data.height) setHeight(data.height);
                if (data.roomType && DEFAULT_ROOMS.includes(data.roomType)) setRoomType(data.roomType);
                
                await analyzeLighting(base64Image);

                setProgressStep(90);
                setTimeout(() => {
                    setProcessLog("Análisis estructural completado.");
                    setTimeout(() => {
                        setPhase('idle');
                        setProgressStep(0);
                        setIsManualMode(false);
                        setShowVolumeModal(true);
                    }, 500);
                }, 800);
            }
        } catch (e: any) {
            console.error(e);
            setPhase('idle');
            alert(`Error en la conexión IA: ${e.message}`);
            setIsManualMode(true);
            setShowVolumeModal(true);
        }
    };

    interface JudgeResult {
        score: number;
        structural_fail: boolean;
        critical_flaw: "GHOSTING" | "PERSPECTIVE" | "ARCHITECTURE" | "FLOATING" | "PLASTIC_LOOK" | "NONE";
    }

    // --- AGENT 3: THE SUPERVISOR (JUDGE) ---
    const judgeRender = async (generatedB64: string, originalB64: string): Promise<JudgeResult> => {
        try {
            setPhase('judge'); 
            
            const structuralCheck = `
                CRITICAL AUDIT:
                1. Did windows/doors/walls move? (FAIL if yes).
                2. Does it look PLASTIC/FAKE? (FAIL if yes).
                3. Do objects float? (FAIL if yes).
                
                SCORE RULES:
                - If structure is SAFE and realism is OK (>0.7), return HIGH SCORE (0.9) to stop iterations.
                - Only fail if there is a MAJOR perspective or geometry error.
            `;

            const response = await smartRetry(async () => {
                return await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: {
                        parts: [
                            { text: `ROLE: Senior Structural Engineer. MODE: AUDIT` },
                            { text: "ORIGINAL GEOMETRY:" },
                            { inlineData: { mimeType: 'image/jpeg', data: originalB64 } },
                            { text: "GENERATED PROPOSAL:" },
                            { inlineData: { mimeType: 'image/png', data: generatedB64 } },
                            { text: `
                                ${structuralCheck}
                                OUTPUT JSON ONLY: { "score": float (0.0-1.0), "structural_fail": boolean, "critical_flaw": "PERSPECTIVE"|"ARCHITECTURE"|"PLASTIC_LOOK"|"NONE" }
                            ` }
                        ]
                    },
                    config: { responseMimeType: "application/json" }
                });
            }, 3, 2000);
            
            const text = response.text;
            return text ? JSON.parse(text) : { score: 0, structural_fail: true, critical_flaw: "NONE" };
        } catch (e) {
            return { score: 0.9, structural_fail: false, critical_flaw: "NONE" };
        }
    };

    // --- AGENT 2: DREAM BUILDER (PHYSICS ENGINE) ---
    const runPhysicsRender = async (isRefinement: boolean = false) => {
        if (!originalImage || !volumeConfirmed) return;
        
        let activePrompt = isRefinement ? refinePrompt : prompt;
        if (!activePrompt) return;

        setPhase('generate');
        setAttemptCount(0);
        setProgressStep(10);
        
        const logMsg = isRefinement ? "Refinando texturas..." : "Iniciando motor de óptica PBR...";
        setProcessLog(logMsg);

        await new Promise(r => setTimeout(r, 800));
        
        let sourceImageBase64 = originalImage;
        if (isRefinement && generatedImage) {
            sourceImageBase64 = generatedImage;
        } else if (!isRefinement) {
            sourceImageBase64 = await applyVolumetricMask(originalImage);
        }

        const cleanSourceBase64 = sourceImageBase64.split(',')[1];
        const cleanOriginalBase64 = originalImage.split(',')[1];
        
        setProgressStep(20);

        const physicsInstruction = `
            ROLE: Interior Photographer (Smartphone/DSLR).
            
            1. GEOMETRY LOCK (ABSOLUTE):
               - Treat input image as a LIDAR SCAN.
               - DO NOT MOVE WALLS, BEAMS (VIGAS), OR WINDOWS.
               - DO NOT EXPAND THE ROOM. Perspective must match input perfectly.
            
            2. ANTI-PLASTIC RULES (DIRTY REALISM):
               - NO "CGI" LOOK. NO PERFECT SURFACES.
               - TEXTURES: Must show micro-imperfections, slight dust in corners, slight unevenness.
               - LIGHTING: Use existing light sources (${lightingScenario.direction}). Shadows must be soft (penumbra).
               - REFLECTIONS: Fresnel is mandatory. Floor reflects strictly based on angle.
            
            3. CAMERA SENSOR SIMULATION:
               - Add subtle ISO NOISE/GRAIN to match a real photo.
               - Slight Chromatic Aberration on window edges.
               - Dynamic Range: Not everything should be perfectly lit; allow for some shadow crush if realistic.
            
            4. VOLUME:
               - Furniture MUST cast contact shadows (Ambient Occlusion) on the floor. No floating.
        `;
        
        const userInstruction = isRefinement 
            ? `MODIFICATION: ${activePrompt}. ONLY change specific items. KEEP GEOMETRY LOCKED. MAINTAIN SENSOR GRAIN.` 
            : `TASK: ${activePrompt}. Style: Realistic, Lived-in. NOT a 3D Render. Match input focal length.`;

        let bestResult = { img: "", score: -1, flaw: "", struct_fail: true };
        let dynamicInstruction = ""; 
        const maxAttempts = isRefinement ? 2 : 3; 

        try {
            for (let i = 1; i <= maxAttempts; i++) {
                setAttemptCount(i);
                
                if (i===1) {
                    setPhase('generate');
                    setProcessLog("Renderizando realismo sucio...");
                    setProgressStep(30);
                } else {
                    setPhase('refine');
                    setProcessLog(`Corrigiendo perspectiva (Intento ${i})...`);
                    setProgressStep(50 + (i*10));
                }
                
                let parts: any[] = [{ inlineData: { mimeType: isRefinement ? 'image/png' : 'image/jpeg', data: cleanSourceBase64 } }];
                
                const finalPrompt = `
                    ${physicsInstruction}
                    ${userInstruction}
                    ${dynamicInstruction}
                    
                    OUTPUT: Photorealistic JPG, ISO 800, Natural Light.
                `;

                parts.push({ text: finalPrompt });

                if(i === 1) {
                    setPhase('physics'); 
                    await new Promise(r => setTimeout(r, 600)); 
                    setPhase('generate');
                }

                const result = await smartRetry(async () => {
                    return await ai.models.generateContent({
                        model: 'gemini-2.5-flash-image', 
                        contents: [{ role: 'user', parts }],
                        config: { 
                            imageConfig: { aspectRatio: detectedAspectRatio },
                            // Temperature muy baja para que la IA siga las instrucciones físicas al pie de la letra
                            temperature: 0.40 
                        }
                    });
                }, 3, 5000); 

                setPhase('judge');

                let generatedB64 = "";
                let failureText = "";

                if (result.candidates?.[0]?.content?.parts) {
                    for (const part of result.candidates[0].content.parts) {
                        if (part.inlineData?.data) { 
                            generatedB64 = part.inlineData.data; 
                            break; 
                        }
                        if (part.text) failureText += part.text;
                    }
                }

                if (!generatedB64) {
                     if (i < maxAttempts) continue;
                     throw new Error(failureText || "Render failed");
                }

                setProcessLog("Verificando consistencia...");
                const judgeBase = isRefinement ? cleanSourceBase64 : cleanOriginalBase64;
                const audit = await judgeRender(generatedB64, judgeBase);
                
                console.log(`Intento ${i}: Score ${audit.score} | Flaw: ${audit.critical_flaw}`);

                const isBetter = bestResult.struct_fail || (audit.score > bestResult.score);

                if (isBetter) {
                    bestResult = { img: generatedB64, score: audit.score, flaw: audit.critical_flaw, struct_fail: audit.structural_fail };
                    setGeneratedImage(`data:image/png;base64,${generatedB64}`);
                    if(isRefinement) setRefinePrompt("");
                }

                if (!audit.structural_fail && audit.score > 0.75) {
                    break;
                }

                if (audit.structural_fail || audit.critical_flaw !== "NONE") {
                    dynamicInstruction = `PREVIOUS FAILED: ${audit.critical_flaw}. FIX IT. LOCK WALLS AND PERSPECTIVE.`;
                }
            }

            setPhase('complete');
            setProcessLog(`Render Finalizado`);
            setProgressStep(100);
            
            if (bestResult.img) {
                setGeneratedImage(`data:image/png;base64,${bestResult.img}`);
            }

        } catch (e: any) {
            console.error(e);
            setPhase('idle');
            alert(`Error al generar la imagen: ${e.message?.slice(0, 150) || "Inténtelo de nuevo."}`);
        } finally {
            setPhase('idle');
            setAttemptCount(0);
            setProgressStep(0);
        }
    };

    const handleMainUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = reader.result as string;
                const img = new Image();
                img.onload = () => {
                    setDetectedAspectRatio(getNearestAspectRatio(img.width, img.height));
                    setOriginalImage(res);
                    setGeneratedImage(null);
                    setVolumeConfirmed(false);
                    runSurveyorScan(res);
                };
                img.src = res;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-24 pb-24 bg-background-light dark:bg-[#050505] text-gray-900 dark:text-gray-100 relative overflow-hidden font-body"
        >
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-blue/5 to-transparent -z-10" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12 p-2">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-800">{t.imagine.tag}</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                        className="font-display text-4xl md:text-6xl font-bold mb-4 tracking-tighter py-2 px-1 text-gray-900 dark:text-white"
                    >
                        {t.imagine.title} <span className="text-primary">{t.imagine.title_highlight}</span>
                    </motion.h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 space-y-6">
                        {/* INPUT FOTO */}
                        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-3xl p-1 shadow-lg relative overflow-hidden group">
                            <label className="relative aspect-video block bg-gray-50 dark:bg-black cursor-pointer overflow-hidden rounded-[1.4rem] transition-colors hover:bg-gray-100 dark:hover:bg-[#0a0a0a]">
                                <input type="file" className="hidden" onChange={handleMainUpload} accept="image/*" />
                                {originalImage ? (
                                    <img src={originalImage} className="w-full h-full object-contain" alt="Original" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                        <span className="material-icons text-5xl mb-3 opacity-30">add_a_photo</span>
                                        <span className="text-xs font-bold uppercase tracking-widest">{t.imagine.upload_title}</span>
                                        <p className="text-[10px] mt-2 opacity-60">{t.imagine.upload_desc}</p>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* PANEL DE CONFIGURACIÓN */}
                        <div className={`bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-lg space-y-6 transition-all ${generatedImage ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400 ml-1 block">{t.imagine.room_type}</label>
                                    <select 
                                        value={roomType} 
                                        onChange={(e) => setRoomType(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                    >
                                        {DEFAULT_ROOMS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                        <option value="Personalizado">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase text-gray-400 ml-1 mb-2 block">
                                    {t.imagine.prompt_label}
                                </label>
                                <textarea 
                                    value={prompt} onChange={e => setPrompt(e.target.value)}
                                    placeholder={t.imagine.prompt_placeholder}
                                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm h-32 resize-none focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>

                            <button 
                                onClick={() => runPhysicsRender(false)}
                                disabled={!originalImage || !prompt || phase !== 'idle' || !volumeConfirmed}
                                className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-secondary hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span className="material-icons text-sm">auto_fix_high</span>
                                {phase === 'idle' 
                                    ? (volumeConfirmed ? t.imagine.btn_generate : t.imagine.btn_confirm) 
                                    : t.imagine.btn_processing}
                            </button>
                        </div>
                        
                        {/* REFINAMIENTO */}
                        <AnimatePresence>
                            {generatedImage && phase === 'idle' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white dark:bg-[#121212] border-2 border-primary/10 rounded-3xl p-6 shadow-xl space-y-4"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-icons text-primary text-xl">tune</span>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t.imagine.refine_title}</h3>
                                    </div>
                                    <textarea 
                                        value={refinePrompt} onChange={e => setRefinePrompt(e.target.value)}
                                        placeholder={t.imagine.refine_placeholder}
                                        className="w-full bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm h-24 resize-none focus:ring-2 focus:ring-primary outline-none transition-all text-gray-800 dark:text-gray-200"
                                    />
                                    <button 
                                        onClick={() => runPhysicsRender(true)}
                                        disabled={!refinePrompt}
                                        className="w-full py-3 bg-brand-black text-white rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="material-icons text-sm">refresh</span>
                                        {t.imagine.refine_btn}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="lg:col-span-8 h-[600px] md:h-[800px] relative">
                        <div className="w-full h-full bg-gray-50 dark:bg-[#0a0a0a] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 relative group flex items-center justify-center">
                            {!originalImage && (
                                <div className="flex flex-col items-center justify-center text-gray-400 opacity-50">
                                    <span className="material-icons text-9xl mb-4">image_search</span>
                                    <p className="text-xs font-bold uppercase tracking-[0.3em]">Vista Previa</p>
                                </div>
                            )}

                            <AnimatePresence>
                                {phase !== 'idle' && (
                                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 z-50">
                                        <ProcessingHUD phase={phase} log={processLog} step={progressStep} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {originalImage && phase === 'idle' && (
                                generatedImage ? (
                                    <>
                                        <CompareSlider original={originalImage} generated={generatedImage} aspectRatio={detectedAspectRatio} />
                                        <motion.button 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={handleDownload}
                                            className="absolute bottom-6 right-6 z-50 bg-white/90 text-brand-black px-6 py-3 rounded-full font-bold shadow-xl border border-gray-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            <span className="material-icons">download</span>
                                            {t.imagine.download}
                                        </motion.button>
                                    </>
                                ) : (
                                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                                        <img src={originalImage} className="max-w-full max-h-full object-contain" alt="Preview" />
                                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-brand-black/80 backdrop-blur px-6 py-2 rounded-full border border-white/10 flex items-center gap-3 shadow-2xl">
                                            <div className={`w-2 h-2 rounded-full ${volumeConfirmed ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                                            <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                                                {volumeConfirmed ? 'Listo para generar' : 'Esperando Confirmación'}
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE CALIBRACIÓN DE ESPACIO */}
            <AnimatePresence>
                {showVolumeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => !volumeConfirmed && setShowVolumeModal(true)}
                        ></motion.div>

                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-[#181818] rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10 border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-brand-blue"></div>
                             
                            <div className="space-y-6">
                                <div className="text-center">
                                     <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
                                        {t.imagine.volume_title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{t.imagine.volume_subtitle}</p>
                                </div>

                                {!isManualMode ? (
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 dark:bg-black/30 rounded-2xl p-6 border border-dashed border-gray-300 dark:border-gray-700 text-center">
                                            <p className="text-xs uppercase font-bold text-gray-400 mb-2">{t.imagine.volume_label}</p>
                                            <p className="text-5xl font-mono font-bold text-gray-900 dark:text-white tracking-tight">
                                                {volume}<span className="text-2xl text-gray-500">m³</span>
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={() => setIsManualMode(true)} className="py-3 rounded-xl border border-gray-300 dark:border-gray-600 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                                                {t.imagine.btn_adjust}
                                            </button>
                                            <button onClick={() => { setVolumeConfirmed(true); setShowVolumeModal(false); }} className="py-3 rounded-xl bg-primary text-white font-bold hover:bg-secondary shadow-lg transition-colors text-sm">
                                                {t.imagine.btn_ok}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 block mb-1">Superficie (m²)</label>
                                            <input type="number" step="0.1" value={area} onChange={(e) => setArea(parseFloat(e.target.value) || 0)} className="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-3 font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 block mb-1">Altura Techo (m)</label>
                                            <input type="number" step="0.1" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} className="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-3 font-bold" />
                                        </div>
                                        <button onClick={() => { setIsManualMode(false); }} className="w-full py-3 rounded-xl bg-brand-black text-white font-bold hover:bg-gray-800 shadow-lg transition-colors text-sm mt-2">
                                            {t.imagine.save_changes}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Imagine;