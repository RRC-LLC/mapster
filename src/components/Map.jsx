'use client'
import { useEffect, useRef, useState } from "react"
import Search from "./Search"
import stateData from '@/lib/geojson/us-states'
import InfoModal from "./InfoModal"
import { AnimatePresence } from "framer-motion"
const BREAKPOINT = 768

export default function Map({ show, data }) {

    const [mapInstance, setMapInstance] = useState(null); // https://stackoverflow.com/questions/69697017/use-leaflet-map-object-outside-useeffect-in-react
    const [markers, setMarkers] = useState(null);
    const [route, setRoute] = useState(null);
    const [showMarker, setShowMarker] = useState(null)
    const [searchOpen, setSearchOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [infoModalOpen, setInfoModalOpen] = useState(false)

    // Map refs:
    const mapRef = useRef(null);
    const markersRef = useRef(null);
    const showMarkerRef = useRef(null);
    const showStateRef = useRef(null);
    const routeRef = useRef(null)

    useEffect(() => {
        const initializeMap = async () => {

            const L = (await import('leaflet')).default
            await import('proj4leaflet')

            let crs = new L.Proj.CRS('ESRI:102003',
                '+proj=aea +lat_0=23 +lon_0=-96 +lat_1=29.5 +lat_2=45.5 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs',
                {
                    resolutions: [
                        (16384 * 2), 16384, 8192, 4096, 2048, 1024, 512, 256
                    ],
                    origin: [0, 0]
                })
                
            if (mapRef.current !== null) return

            mapRef.current = L.map('map', 
                {   crs: crs, 
                    attributionControl: false,
                    scrollWheelZoom: false, 
                    zoomControl: false,
                    zoomSnap: 0.1, 
                    maxZoom: 6
                }).setView([34.8, -97], 0)
            let imageUrl = window.innerWidth < BREAKPOINT ? '/pinegrove_map_quarter_80.webp' : '/pinegrove_map_half_70.webp';
            let altText = 'The Pinegrove map.';

            let imageBounds = L.bounds(
                [-2.49e6, 3.45e6],
                [2.29e6, -2.6e5]
            )
            let latLngBounds = L.latLngBounds([[51, -119.5], [14, -63.5]])
            let searchBounds = L.latLngBounds([[20 + (0.032294 * (window.innerWidth - 768)), -70 + (0.01333 * (window.innerWidth - 768))], [15 + (-1 / 724. * (window.innerWidth - 768)), -180 + (0.05732 * (window.innerWidth - 768))]])
            let imageOverlay = L.Proj.imageOverlay(imageUrl, imageBounds, {
                opacity: 1,
                alt: altText,
                interactive: true,
            })
            mapRef.current.addLayer(imageOverlay)
            mapRef.current.fitBounds(window.innerWidth < BREAKPOINT ? latLngBounds : searchBounds, {animate: false})
            // mapRef.current.setMaxBounds(latLngBounds) 
            mapRef.current.setMinZoom(mapRef.current.getBoundsZoom(window.innerWidth < BREAKPOINT ? latLngBounds : searchBounds))
            mapRef.current.on('resize', () => {

                setSearchOpen(false)
                mapRef.current.setMinZoom(undefined)
                mapRef.current.fitBounds(latLngBounds, {animate: false})
                mapRef.current.setMinZoom(mapRef.current.getBoundsZoom((latLngBounds)))
                if (showStateRef.current !== null) {
                    let showLat = show.latitude
                    let showLng = show.longitude
                    if (show.state == "AK") {
                        showLat -= 38
                        showLng += 35.4
                    }   
                    mapRef.current.fitBounds(showStateRef.current.getBounds(), {animate: false}).setView([showLat, showLng], mapRef.current.getZoom(), { animate: false });        
                }
            })

            let geojson = L.geoJson()
            mapRef.current.addLayer(geojson)

            function style(feature) {
                return {
                    weight: 0,
                    opacity: 0,
                    fillOpacity: 0
                };
            }

            function highlightFeature(e) {
                var layer = e.target;
            
                layer.setStyle({
                    weight: 5,
                    opacity: 1,
                    color: '#666',
                    dashArray: '1',
                });
            
                layer.bringToFront();
            }

            function resetHighlight(e) {
                geojson.resetStyle(e.target);
            }

            function zoomToFeature(e) {
                mapRef.current.fitBounds(e.target.getBounds(), {animate: false});
            }
            
            geojson.addData(stateData)
            geojson.setStyle(style)
            geojson.eachLayer((layer) => {
                layer.on({
                    // mouseover: highlightFeature,
                    // mouseout: resetHighlight,
                    click: zoomToFeature
                });
                let showLat = show?.latitude
                let showLng = show?.longitude
                if (show?.state == "AK") {
                    showLat -= 38
                    showLng += 35.4
                }
                if(layer.feature.properties.abbr == show?.state) {
                    showStateRef.current = layer
                    mapRef.current.fitBounds(layer.getBounds(), {animate: false}).setView([showLat, showLng], mapRef.current.getZoom(), { animate: false });
                } 
            })
            setMapInstance(mapRef.current);

            if (window.innerWidth >= BREAKPOINT) setSearchOpen(true)
        }
        initializeMap()
        return () => {
            mapRef.current?.remove()
        }
      }, [])

    useEffect(() => {
        const initializeMarkers = async () => {
            if (!mapInstance) return;

            const L = (await import('leaflet')).default

            markersRef.current = L.featureGroup()
            showMarkerRef.current = L.layerGroup()
            routeRef.current = L.featureGroup()

            markersRef.current.addTo(mapInstance)
            showMarkerRef.current.addTo(mapInstance)
            routeRef.current.addTo(mapInstance)
            setMarkers(markersRef.current)
            setShowMarker(showMarkerRef.current)
            setRoute(routeRef.current)

            mapInstance.on('zoomstart', () => {
                mapInstance.removeLayer(markersRef.current)
            })

            mapInstance.on('zoomend', () => {
                let resizedIcon = L.divIcon({
                    iconSize: [5 + (mapInstance.getZoom() * 3.5), 5 + (mapInstance.getZoom() * 3.5)],
                    className: `shadow light-green-paper`
                });
                let resizedSoloIcon = L.divIcon({
                    iconSize: [5 + (mapInstance.getZoom() * 3.5), 5 + (mapInstance.getZoom() * 3.5)],
                    className: `shadow dark-green-paper`
                });
                markersRef.current.eachLayer(function(layer) {
                    if( layer instanceof L.Marker ) {
                            if (layer.options.icon.options.className.includes("dark-green-paper")) {
                                layer.setIcon(resizedSoloIcon);
                            } else {
                                layer.setIcon(resizedIcon);
                            }                            
                        }
                    })
                    mapInstance.addLayer(markersRef.current)
            })

            if (show != undefined) {
                let showIcon = L.icon({
                    iconSize: [10 + (mapInstance.getZoom() * 10), 10 + (mapInstance.getZoom() * 10)],
                    iconUrl: '/ampersand_alt.png',
                });           
    
                let showLat = show.latitude
                let showLng = show.longitude
                if (show.state == "AK") {
                    showLat -= 38
                    showLng += 35.4
                }
    
                let showMarker = L.marker([showLat, showLng], {icon: showIcon, zIndexOffset: 500})
                showMarker.addTo(mapInstance)
    
                mapInstance.on('zoomstart', () => {
                    mapInstance.removeLayer(showMarker)
                })
                mapInstance.on('zoomend', () => {
                    let resizedIcon = L.icon({
                        iconSize: [10 + (mapInstance.getZoom() * 10), 10 + (mapInstance.getZoom() * 10)],
                        iconUrl: '/ampersand_alt.png',
                    });
                    showMarker.setIcon(resizedIcon);      
                    mapInstance.addLayer(showMarker)
                })
            }
        }
        initializeMarkers()

    }, [mapInstance])

    useEffect(() => {
        if (localStorage.getItem("viewed_modal") !== "true") {
            setInfoModalOpen(true)
            localStorage.setItem("viewed_modal", "true")
        }
    }, [])

    const closeSearch = (e) => {
        e.stopPropagation()

        if (!infoModalOpen) setSearchOpen(false)
    }

    return (
        <div className="w-full h-[100dvh] relative" onClick={closeSearch}>
            {show == null && <Search 
                data={data} 
                markers={markers} 
                showMarker={showMarker} 
                route={route}
                map={mapInstance} 
                searchOpen={searchOpen} 
                setSearchOpen={setSearchOpen}
                setLoading={setLoading}
                setInfoModalOpen={setInfoModalOpen}
            />}
            <div id='map' className="w-full h-full"></div>
            <div className="fixed z-40 left-0 top-0 w-screen h-full bg-v2-wallpaper bg-medium sm:bg-small">
            </div>
            <div className="fixed z-30 left-0 top-0 w-screen h-full bg-gray-1">
            </div>
            {
                show == null ? 
                    <>
                    <div className="fixed flex flex-col z-[1000] right-1 bottom-2 gap-2 text-trail-yellow p-2">
                        <button onClick={() => {
                                const markerBounds = markersRef.current?.getBounds()
                                if (markerBounds.getEast() - markerBounds.getWest() < 25) {
                                    mapRef.current?.fitBounds(markerBounds)
                                } else {
                                    mapRef.current?.zoomIn()
                                }
                            }} 
                          className="dark-wood wood-shadow p-2 pt-[3px] w-8 h-8 flex font-se drop-shadow-lg justify-center rounded text-3xl sm:text-2xl">
                            +
                        </button>
                        <button onClick={() => mapRef.current?.zoomOut()} className="dark-wood wood-shadow p-2 pt-[3px] w-8 h-8 flex font-se drop-shadow-lg justify-center rounded text-3xl sm:text-2xl">–</button>
                    </div>
                    </>
                : null
            }
            <AnimatePresence>
                {infoModalOpen && <InfoModal closeModal={() => setInfoModalOpen(false)} />}
            </AnimatePresence>
        </div>
    )
}