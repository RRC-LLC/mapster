'use client'
import VideoForm from "./VideoForm";
import ImageForm from "./ImageForm";
import TextForm from "./TextForm";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useState, useMemo, useRef } from "react";
import useMeasure from "react-use-measure";
import ReCAPTCHA from "react-google-recaptcha";

const variants = {
    initial: (direction) => ({
        x: `${110 * direction}%`,
        opacity: 0
    }),
    active: {
        x: "0%",
        opacity: 1
    },
    exit: (direction) => ({
        x: `${-110 * direction}%`,
        opacity: 0
    })
};

const tabColors = {
    photo: "bg-trail-yellow",
    video: "bg-trail-yellow",
    note: "bg-trail-yellow",
};

export default function MediaUpload({ showId, closeModal }) {
    const [isClosing, setIsClosing] = useState(false);
    const [activeTab, setActiveTab] = useState('photo');
    const [direction, setDirection] = useState(1);
    const [ref, bounds] = useMeasure();
    const [formActive, setFormActive] = useState(true);
    const recaptchaRef = useRef();

    const handleClose = () => {
        setIsClosing(true);
        closeModal();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsClosing(true);
            closeModal();
        }
    };

    const tabs = [
        { id: 'photo', label: 'photo' },
        { id: 'video', label: 'video' },
        { id: 'note', label: 'note' }
    ];

    const handleTabChange = (newTab) => {
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
        const newIndex = tabs.findIndex(tab => tab.id === newTab);
        setDirection(newIndex > currentIndex ? 1 : -1);
        setFormActive(false);
        setActiveTab(newTab);
    };

    const content = useMemo(() => {
        switch (activeTab) {
            case 'photo':
                return <ImageForm showId={showId} closeModal={closeModal} recaptchaRef={recaptchaRef}/>;
            case 'video':
                return <VideoForm showId={showId} closeModal={closeModal} recaptchaRef={recaptchaRef}/>;
            case 'note':
                return <TextForm showId={showId} closeModal={closeModal} recaptchaRef={recaptchaRef}/>;
        }
    }, [activeTab, showId, closeModal, isClosing, formActive, recaptchaRef]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="absolute font-serif z-[100000] flex items-center justify-center top-0 left-0 w-full h-full bg-black bg-opacity-60"
            onClick={handleBackdropClick}
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="wood-shadow wood-550 w-full max-w-[350px] rounded flex flex-col justify-center my-24 p-2 pt-0"
            >
                <div  className="flex p-2 px-2 text-xl font-pg w-full text-trail-yellow justify-between">
                    <h1 className="pl-2">media upload</h1>
                    <div className="cursor-pointer" onClick={handleClose}>x</div>
                </div>
                <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
                    <motion.div
                        initial={false}
                        animate={{ height: bounds.height + 36 }}
                        className="relative w-full px-[2px] py-2 rounded-sm shadow-inner-show bg-gray-2 max-w-[400px] overflow-hidden"
                        style={{ minHeight: 291 }}
                    >
                        <div ref={ref}>
                            <div className="relative px-2 gap-2 flex justify-start mb-4 border-b-[1px] border-trail-yellow border-opacity-10" ref={ref}>
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`relative px-2 pb-2 text-sm font-serif transition-colors duration-200`}
                                        style={{ zIndex: 1 }}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="tab-underline"
                                                className={`absolute left-0 right-0 -bottom-[2px] h-[3px] ${tabColors[tab.id]}`}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="px-4">
                                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                                    <motion.div
                                        key={activeTab}
                                        variants={variants}
                                        initial="initial"
                                        animate="active"
                                        exit="exit"
                                        custom={direction}
                                        onAnimationComplete={() => setFormActive(true)}
                                        className="pt-2"
                                    >
                                        {content}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </MotionConfig>
            </motion.div>
            <div id="recaptcha-container">
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                />
            </div>
        </motion.div>
    )
}