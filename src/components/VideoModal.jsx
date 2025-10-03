'use client'
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function VideoModal({ video, closeModal }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined" && !document.getElementById('modal-root')) {
            const div = document.createElement('div');
            div.id = 'modal-root';
            document.body.appendChild(div);
        }
        return () => setMounted(false);
    }, []);

    const handleBackdropClick = (e) => {
        // Only close if clicking the backdrop itself, not its children
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    const modalContent = (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="fixed z-[99999] flex items-center justify-center top-0 left-0 w-full h-full bg-black bg-opacity-90"
            onClick={handleBackdropClick}
        >
            <div className="font-pg text-3xl text-trail-yellow absolute top-3 hover:brightness-110 hover:scale-105 transition-all duration-100 ease right-6 cursor-pointer" onClick={handleBackdropClick}>x</div>
            <motion.div 
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="drop-shadow-xl w-full max-w-[90%] sm:max-w-[70%] max-h-[75%] flex justify-center my-24"
            >
                <div className="z-[500] flex w-full items-center flex-col gap-1">
                    <section className="relative flex w-full overflow-hidden flex-grow flex-col">
                        <div className="relative w-full bg-black aspect-video">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${video.youtube_id}?si=MtvprQqMdOAwGSd6&autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </section>
                </div>
            </motion.div>
        </motion.div>
    );

    if (!mounted) return null;
    const modalRoot = typeof window !== "undefined" ? document.getElementById('modal-root') : null;
    if (!modalRoot) return null;
    return createPortal(modalContent, modalRoot);
} 