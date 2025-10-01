'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function ImageModal({ image, closeModal }) {
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
                initial={{ opacity: 0, }}
                animate={{ opacity: 1, }}
                exit={{ opacity: 0, }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="drop-shadow-xl max-w-[90%] sm:max-w-[75%] flex justify-center my-24"
            >
                <div className="z-[500] flex w-full items-center flex-col gap-1">
                    <section className="relative flex w-full p-2 bg-cream bg-cream-paper overflow-scroll flex-grow flex-col">
                        <div className="relative w-full h-full">
                            <Image
                                src={image.url}
                                alt={image.alt}
                                width={image.width}
                                height={image.height}
                                className="w-auto h-auto mx-auto border-[1px] border-stone-300"
                                style={{ maxWidth: '100%' }}
                            />
                        </div>
                    </section>
                </div>
            </motion.div>
        </motion.div>
    );

    if (!mounted) return null;
    return createPortal(modalContent, document.getElementById('modal-root'));
} 