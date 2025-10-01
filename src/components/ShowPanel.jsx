'use client'
import ShowCard from "./ShowCard"
import InnerButton from "./InnerButton"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function ShowPanel({ show, openUploadModal, openArtistModal, openSetlistModal, openLyricsModal }) {

    const [displayDetails, setDisplayDetails] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) { // sm breakpoint
                const hasMedia = show.images.length > 0 || show.videos.length > 0 || (show.memories?.length ?? 0) > 0;
                setDisplayDetails(!hasMedia);
            } else {
                setDisplayDetails(true);
            }
        };

        // Initial check
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [show.images.length, show.videos.length, show.memories?.length]);

    return (
        <div className={`duration-500 z-10 bottom-0 fixed md:sticky w-full md:max-w-[375px]`}>
            <div className={`shadow-sidebar flex flex-col overflow-hidden flex-none overscroll-none pb-3 ${displayDetails ? "gap-3" : "gap-0"} md:gap-3 wood-550 rounded-t-2xl md:rounded-t-none w-full md:max-w-[408px] h-auto max-h-[90svh] sm:max-h-[100svh] md:h-screen bg-green-500 p-3 pb-0 sm:pb-3`}>
                <div className="flex px-2 w-full items-center justify-between">

                    <div className="px-0 sm:px-2 font-pg text-xl text-trail-yellow ">{new Date(show.date).toLocaleString('en-US', {month: "long", day: "numeric", timeZone: "UTC"})}, <Link className="hover:underline" href={`/?years=${encodeURIComponent(new Date(show.date).getUTCFullYear())}`}>{new Date(show.date).getUTCFullYear()}</Link> {show.time == 'day' ? '(Day)' : ''}{show.time == 'night' ? '(Night)' : ''}</div>

                    <div className="flex gap-2">
                        {/* Desktop and up: Back icon link */}
                        <Link
                        href="/"
                        className="dark-wood-small sm:hover:brightness-110 transition-brightness duration-100 ease p-1 h-8 w-8 font-pg flex shadow-inner-button justify-center items-center rounded text-base text-trail-yellow flex"
                        >
                        <img
                            src="/ampersand.svg"
                            alt="Back to all shows"
                            className="w-[14px] h-[14px] opacity-90"
                        />
                        </Link>

                        {/* Mobile: Down/info icon button */}
                        <button
                            id="details-button"
                            className="dark-wood-small sm:hover:brightness-110 transition-brightness duration-100 ease p-1 h-8 w-8 font-pg flex shadow-inner-button justify-center items-center rounded text-base text-trail-yellow flex sm:hidden"
                            onClick={() => setDisplayDetails((prev) => !prev)}
                            aria-label="Details"
                        >
                            <img
                                src={displayDetails ? "/compress.svg" : "/expand.svg"}
                                alt="Details"
                                className="w-4 h-4 opacity-90"
                            />
                        </button>


                    </div>
                    
                </div>

                <ShowCard 
                    show={show} 
                    openArtistModal={openArtistModal} 
                    openSetlistModal={openSetlistModal}
                    openLyricsModal={openLyricsModal}
                    displayDetails={displayDetails}
                />

                <div className="text-base flex px-2 flex-none w-full justify-between items-center gap-3 text-trail-yellow">
                    <InnerButton text={"upload media"} onClick={openUploadModal}/>
                </div>
            </div>
        </div>
    )
}