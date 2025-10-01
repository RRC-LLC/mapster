'use client'
import { useState } from "react"
import dynamic from "next/dynamic"
import ShowPanel from "@/components/ShowPanel"
import MediaUpload from "@/components/MediaUpload"
import EscNav from "@/components/EscNav"
import ShowEditor from "./ShowEditor"
import MediaGallery from "./MediaGallery"
import MapLoading from "./MapLoading"
import { AnimatePresence } from "framer-motion";
import LyricsModal from "./LyricsModal"

const Map = dynamic(
    () => import('./Map'),
    { 
        ssr: false,
        loading: MapLoading
    }
)
  
export default function Show({ show }) {

    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const [artistModalOpen, setArtistModalOpen] = useState(false)
    const [setlistModalOpen, setSetlistModalOpen] = useState(false)
    const [lyricsModalOpen, setLyricsModalOpen] = useState(false)
    const [selectedSong, setSelectedSong] = useState(null)
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
    
    const openLyricsModal = (song) => {
        setSelectedSong(song);
        setLyricsModalOpen(true);
    }

    return <>
        <EscNav />
        <div className="flex flex-col relative md:flex-row w-screen">
            <ShowPanel 
                show={show} 
                openUploadModal={() => {setUploadModalOpen(true)}} 
                openArtistModal={() => {setArtistModalOpen(true)}} 
                openSetlistModal={() => {setSetlistModalOpen(true)}}
                openLyricsModal={openLyricsModal}
                selectedMediaIndex={selectedMediaIndex}
                setSelectedMediaIndex={setSelectedMediaIndex}
            />
            <div className="flex-auto sticky top-0 w-screen md:w-auto h-[100svh] relative">
                <Map show={show} />
                <AnimatePresence>
                    {(show.images?.length > 0 || show.videos?.length > 0) && (
                        <div className="absolute z-[10000] inset-0">
                            <MediaGallery
                                images={show.images} 
                                videos={show.videos} 
                                memories={show.memories}
                                selectedMediaIndex={selectedMediaIndex}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
        <AnimatePresence>
            {uploadModalOpen && <MediaUpload showId={show.id} closeModal={() => {setUploadModalOpen(false)}} />}
            {setlistModalOpen && <ShowEditor showId={show.id} type={"setlist"} content={show.setlist} closeModal={() => {setSetlistModalOpen(false)}} />} 
            {artistModalOpen && <ShowEditor showId={show.id} type={"artists"} content={show.other_artists} closeModal={() => {setArtistModalOpen(false)}} />}
            {lyricsModalOpen && selectedSong && (
                <LyricsModal 
                    song={selectedSong} 
                    closeModal={() => {
                        setLyricsModalOpen(false);
                        setSelectedSong(null);
                    }} 
                />
            )}
        </AnimatePresence>
    </>
}