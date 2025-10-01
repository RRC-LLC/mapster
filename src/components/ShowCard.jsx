'use client'
import Link from "next/link";
import { motion } from "framer-motion";

export default function ShowCard({ show, openArtistModal, openSetlistModal, openLyricsModal, displayDetails = true }) {

    return (
        <motion.div
            id="show-card"
            initial={false}
            animate={{ height: displayDetails ? 'auto' : 0, opacity: displayDetails ? 1 : 0, }}
            transition={{ duration: 0.3, type: "tween", bounce: 0 }}
            className={`w-full h-full max-h-[70svh] sm:max-h-[100svh] relative rounded flex-auto overflow-y-scroll no-scrollbar overscroll-none text-cream text-sc shadow-inner-show text-opacity-90 p-2 green-paper`}
        >
            <div className="flex pb-4 flex-col h-full border-light-blue border-[1px] border-opacity-80 overscroll-none overflow-scroll gap-4 z-[5500]">

                {show.event_name && 
                    <>
                        <div className="bg-light-blue px-2 opacity-80 text-dark-blue">event name</div>
                        <div className="px-2 my-1">{show.event_name}</div>
                    </>
                }
                {show.show_type == 'solo' && 
                    <>
                        <div className="bg-light-blue px-2 opacity-80 text-dark-blue">event type</div>
                        <Link href={`/?show_type=${encodeURIComponent(show.show_type)}`} className="hover:underline px-2 my-1">Solo Show</Link>
                    </>
                }
                {show.tour && 
                    <>
                        <div className="bg-light-blue px-2 opacity-80 text-dark-blue">tour</div>
                        <Link href={`/?tour=${encodeURIComponent(show.tour)}`} className="hover:underline px-2 my-1">{show.tour}</Link>
                    </>
                }
                <div className="bg-light-blue px-2 opacity-80 text-dark-blue">location</div>
                <div className="flex flex-col gap-0 my-2 px-2">
                    <Link className="hover:underline" href={`/?venues=${encodeURIComponent(show.venue)}`}>{show.venue}</Link>
                    {show.address &&  <>
                        <div>{show.address}</div>
                    </>}
                    <div>
                    <Link className="hover:underline" href={`/?cities=${encodeURIComponent(show.city)}`}>{show.city}</Link>{`, `} 
                    <Link className="hover:underline" href={`/?states=${encodeURIComponent(show.state)}`}>{show.state}</Link>
                    </div>
                </div>
                <div className="bg-light-blue flex items-center justify-between opacity-80 px-2 text-dark-blue">
                    <div>other artists</div>
                    <button className="text-sm hover:underline duration-300 ease cursor-pointer" onClick={openArtistModal}>
                        edit
                    </button>
                </div>
                <div className="flex flex-col gap-0 my-2 px-2">
                {show.other_artists.map((artist, idx) => {
                    return <div key={`otherArtist${idx}`}>{artist.name}</div>
                })}
                </div>
                <div className="bg-light-blue flex items-center justify-between opacity-80 px-2 text-dark-blue">
                    <div>setlist</div>
                    <button className="text-sm hover:underline duration-300 ease cursor-pointer" onClick={openSetlistModal}>
                        edit
                    </button>
                </div>
                <div className="flex flex-col gap-0 my-2 px-2">
                    {show.setlist.map((song, idx) => {
                        return <div className="flex gap-3 w-full" key={`song${idx}`}>
                            <Link className="hover:underline" href={`/?songs=${encodeURIComponent(song.title)}`}>{song.title}</Link>
                            <div className="flex gap-1 items-center">
                                {song.songData?.lyrics_html && (
                                    <div
                                        className="cursor-pointer group w-4 h-4 relative" 
                                        title="lyrics"
                                        aria-label={`View lyrics for ${song.title}`}
                                        onClick={() => openLyricsModal(song)}
                                    >
                                        <img 
                                            src="/lyrics_outline.svg" 
                                            alt="" 
                                            aria-hidden="true"
                                            className="invert opacity-30 w-full h-full absolute sm:group-hover:opacity-0 transition-opacity duration-200"
                                        />
                                        <img 
                                            src="/lyrics_fill.svg" 
                                            alt="" 
                                            aria-hidden="true"
                                            className="invert w-full h-full absolute opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                                        />
                                    </div>
                                )}
                                {song.songData?.tab && (
                                    <a 
                                        href={song.songData.tab.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group w-4 h-4 relative" 
                                        title="View guitar tab"
                                        aria-label={`View guitar tab for ${song.title}`}
                                    >
                                        <img 
                                            src="/guitar_outline.svg" 
                                            alt="" 
                                            aria-hidden="true"
                                            className="invert opacity-30 w-full h-full absolute sm:group-hover:opacity-0 transition-opacity duration-200"
                                        />
                                        <img 
                                            src="/guitar_fill.svg" 
                                            alt="" 
                                            aria-hidden="true"
                                            className="invert w-full h-full absolute opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                                        />
                                    </a>
                                )}
                            </div>
                        </div>
                    })}
                </div>
                {show.notes && 
                    <>
                        <div className="bg-light-blue px-2 opacity-80 text-dark-blue">Show Notes</div>
                        <div className="px-2 my-1 whitespace-pre-line">{show.notes}</div>
                    </>
                }
            </div>
        </motion.div>
    )
}