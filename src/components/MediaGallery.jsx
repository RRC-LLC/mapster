'use client'
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import ImageModal from "./ImageModal"
import VideoModal from "./VideoModal"
import NoteModal from "./NoteModal"
import HandDrawnPlay from "./HandDrawnPlay"

// Helper to generate a deterministic pseudo-random rotation between 0 and 0.5 degree, alternating sign
function getRotation(index) {
    const seed = Math.sin(index + 1) * 10000;
    const base = (seed - Math.floor(seed)) * 0.5; // 0 to 0.5
    const sign = index % 2 === 0 ? 1 : -1;
    return base * sign;
}

export default function MediaGallery({ images, videos, memories }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    };

    const handleCloseImageModal = () => {
        setSelectedImage(null);
    };

    const handleCloseVideoModal = () => {
        setSelectedVideo(null);
    };

    const handleCloseNoteModal = () => {
        setSelectedNote(null);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "ease" }}
            className="bg-transparent px-4 sm:px-10 pt-6 sm:pt-12 pb-[124px] sm:pb-16 w-full h-full overflow-y-auto"
        >
            <AnimatePresence>
                {selectedImage && (
                    <ImageModal 
                        image={selectedImage} 
                        closeModal={handleCloseImageModal} 
                    />
                )}
                {selectedVideo && (
                    <VideoModal 
                        video={selectedVideo} 
                        closeModal={handleCloseVideoModal} 
                    />
                )}
                {selectedNote && (
                    <NoteModal
                        note={selectedNote}
                        closeModal={handleCloseNoteModal}
                    />
                )}
            </AnimatePresence>
            
            {images.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-xl font-pg text-cream mb-8 green-texture-dark w-min px-4 py-1 drop-shadow -rotate-2">Photos</h2>
                    <div className="flex sm:pl-8 justify-center sm:justify-start flex-wrap gap-8 items-end">
                        {images.map(({ image }, i) => (
                            <div
                                key={`image${i}`}
                                className="cream-paper p-2 overflow-hidden cursor-pointer transition-transform duration-200 drop-shadow-lg hover:scale-105"
                                style={{ transform: `rotate(${getRotation(i).toFixed(2)}deg)` }}
                                onClick={() => handleImageClick(image)}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    width={image.width}
                                    height={image.height}
                                    className="h-64 w-auto border-[1px] border-stone-300"
                                    style={{ maxWidth: '100%' }}
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {videos.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-xl font-pg text-cream mb-8 green-texture-dark w-min px-4 py-1  drop-shadow -rotate-2">videos</h2>
                    <div className="flex sm:pl-8 justify-center sm:justify-start flex-wrap gap-8 items-end">
                        {videos.map((video, i) => (
                            <div
                                key={`video${i}`}
                                className="h-64 w-auto p-2 cream-paper overflow-hidden cursor-pointer transition-transform duration-200 drop-shadow-lg hover:scale-105"
                                style={{ transform: `rotate(${getRotation(i + images.length).toFixed(2)}deg)` }}
                                onClick={() => handleVideoClick(video)}
                            >
                                <div className="relative aspect-video w-full h-full">
                                    <Image
                                        src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                                        alt="Video thumbnail"
                                        fill
                                        className="object-cover aspect-video border-[1px] border-stone-300"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                            style={{ transform: `rotate(${getRotation(i + images.length).toFixed(2)}deg)` }}
                                            className="w-12 h-12 green-texture rounded-full flex items-center justify-center"
                                        >
                                            <HandDrawnPlay size={28} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {memories && memories.length > 0 && (
                <section>
                    <h2 className="text-xl font-pg text-cream mb-8 green-texture-dark w-min px-4 py-1  drop-shadow -rotate-2">Notes</h2>
                    <div className="flex sm:pl-8 justify-center sm:justify-start flex-wrap gap-8 items-end">
                        {memories.map((memory, i) => (
                            <div
                                key={`memory${i}`}
                                className="w-64 h-64 cream-paper p-6 overflow-hidden cursor-pointer transition-transform duration-200 drop-shadow-lg hover:scale-105 flex items-start justify-start"
                                style={{ transform: `rotate(${getRotation(i + images.length + videos.length).toFixed(2)}deg)` }}
                                onClick={() => handleNoteClick(memory)}
                            >
                                <p className="text-stone-800 font-serif text-sm">
                                    {memory.content.length > 100 ? memory.content.slice(0, 250) + '...' : memory.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </motion.div>
    )
}