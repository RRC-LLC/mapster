'use client'
import { motion } from "framer-motion";

export default function LyricsModal({ song, closeModal }) {
    const handleClose = () => {
        closeModal();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-[100000] flex items-center justify-center top-0 left-0 w-full h-full bg-black bg-opacity-60"
            onClick={handleBackdropClick}
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="wood-shadow drop-shadow-xl wood-550 w-auto rounded flex justify-center my-24 p-2 pt-[2px] max-h-[80vh]"
            >
                <div className="z-[500] flex w-full items-center flex-col gap-1">
                    <div className="flex p-1 px-2 text-xl font-pg w-full text-trail-yellow justify-between">
                        <h1 className="">{song.title} lyrics</h1>
                        <div className="cursor-pointer" onClick={handleClose}>x</div>
                    </div>

                    <section className="relative flex h-1/2 w-full px-3 sm:px-8 pt-[2px] pb-[2px] rounded-sm shadow-inner-show bg-gray-2 flex-grow flex-col w-full max-w-prose">
                        <div className="w-full h-full pb-6 sm:pb-8 pt-6 sm:pt-8 overflow-scroll hidden-scrollbar">
                            <div 
                                className="text-cream font-pg"
                                dangerouslySetInnerHTML={{ __html: song.songData.lyrics_html }} 
                            />
                        </div>
                    </section>
                </div>
            </motion.div>
        </motion.div>
    )
} 