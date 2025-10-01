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
                className="wood-shadow drop-shadow-xl wood-550 max-w-[95vw] min-w-[288px] rounded flex justify-center my-24 p-2 pt-[2px] max-h-[80vh]"
            >
                <div className="z-[500] flex w-full items-center flex-col gap-1">
                    <div className="flex p-1 px-2 text-xl font-pg w-full text-trail-yellow justify-between">
                        <h1 className="">{song.title} lyrics</h1>
                        <div className="cursor-pointer" onClick={handleClose}>x</div>
                    </div>

                    <section className="relative flex w-full p-6 rounded-sm shadow-inner-show bg-gray-2 overflow-scroll hidden-scrollbar flex-grow flex-col">
                        <div 
                            className="text-cream font-pg"
                            dangerouslySetInnerHTML={{ __html: song.songData.lyrics_html }} 
                        />
                    </section>
                </div>
            </motion.div>
        </motion.div>
    )
} 