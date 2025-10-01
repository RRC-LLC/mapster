'use client'
import { motion } from "framer-motion";
import Link from "next/link";

export default function InfoModal({ closeModal }) {
    const handleClose = (e) => {
        e.stopPropagation()
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
            className="fixed z-[100000] flex items-center justify-center top-0 left-0 w-full h-[100svh] bg-black bg-opacity-60"
            onClick={handleBackdropClick}
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="wood-shadow drop-shadow-xl wood-550 max-w-[95vw] w-[500px] rounded flex justify-center my-24 p-2 pt-0 max-h-[80vh]"
            >
                <div className="z-[500] flex w-full items-center flex-col gap-1">
                    <div className="flex pt-[4px] pb-1 px-2 text-xl font-pg w-full text-trail-yellow justify-between">
                        <h1 className="">welcome to mapster!</h1>
                        <div className="cursor-pointer" onClick={handleClose}>x</div>
                    </div>

                    <section className="relative flex w-full px-4 pt-6 sm:pt-8 pb-5 rounded-sm shadow-inner-show bg-gray-2 flex-grow flex-col">
                        <div className="max-h-[50vh] overflow-scroll">
                            <p className="text-cream pb-8 px-2 sm:px-4">What is a map if not a registry of different places shows can happen?</p>
                            <p className="text-cream pb-8 px-2 sm:px-4">In 2014, with this philosophy in tow, we embarked on a 5 week US tour of DIY spaces across the country, along with our band-friend Tawny Peaks, booked totally by ourselves, using nothing but social media & a map.</p>
                            <p className="text-cream pb-8 px-2 sm:px-4">A decade later we'd played shows in all but 2 states (sorry WY, hi HI).</p>
                            <p className="text-cream pb-8 px-2 sm:px-4">Today, you can browse this website—a map-based archive of our manic odometer, of our gradual move from basements to theaters, & not least, of songs as changeable organisms over the course of 600ish shows.</p>
                            <p className="text-cream pb-8 px-2 sm:px-4">We'd like to invite you, as you browse the many flexible ways data can be organized on this website, to add any pictures or video from any of our shows you've been to, to leave comments about memories you have, to help create a collage of each show's singular experience.</p>
                            <p className="text-cream pb-8 px-2 sm:px-4">Enormous shout out to Router who designed the site in collaboration with pg.</p>
                            <p className="text-cream pb-8 px-2 sm:px-4">This website is, & will always be, open source. If you're in a band, please feel free to use the code as a model for tracking your show history & to bring footage, photos & fan experiences all in one place. I could even imagine one day using this skeleton to build an archive of house shows across the country—for any with the ambition, we've published the website under a General Public License, a copyleft protection, ensuring that any uses of it will remain open & freely available. If you have any ideas about how to improve the website, we're all ears!</p>
                        </div>
                        <div className="flex items-center gap-4 border-y border-gray-3 py-4 px-2 sm:px-4">
                            <div className="text-cream opacity-60 text-sm italic">
                                Search shortcuts:
                            </div>
                            <div className="text-cream opacity-60 text-sm italic">
                                f - filters
                            </div>
                            <div className="text-cream opacity-60 text-sm italic">
                                r - results
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 px-2 sm:px-4 flex flex-wrap gap-4">
                            <a href="/Pinegrove_Web_Release.pdf" className="text-cream opacity-60 hover:opacity-100 transition-opacity duration-150 ease text-sm underline" target="_blank">Terms of Service</a>
                            <Link href="/corrections" className="text-cream opacity-60 hover:opacity-100 transition-opacity duration-150 ease text-sm underline">Contact</Link>
                            <a href="https://pinegroveband.com/mailing-list/" className="text-cream opacity-60 hover:opacity-100 transition-opacity duration-150 ease text-sm underline" target="_blank" rel='noreferrer'>Mailing List</a>
                            <a href="https://github.com/RRC-LLC/mapster" className="text-cream opacity-60 hover:opacity-100 transition-opacity duration-150 ease text-sm underline" target="_blank" rel='noreferrer'>GitHub</a>
                        </div>

                    </section>
                    
                </div>
            </motion.div>
        </motion.div>
    )
} 