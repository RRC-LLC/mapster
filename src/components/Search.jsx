'use client'
import { Fragment, useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";
import Link from "next/link";
import useMeasure from "react-use-measure";
import { motion, AnimatePresence } from "framer-motion";
import HandDrawnBorder from './HandDrawnBorder';
import SummaryStatistics from './SummaryStatistics';
import IconButton from './IconButton';
import LinkButton from './LinkButton';

export default function Search({ data, markers, showMarker, route, map, searchOpen, setSearchOpen, setLoading, setInfoModalOpen }) {

    const router = useRouter()
    const searchParams = useSearchParams()
    const [ref, bounds] = useMeasure();
    const [direction, setDirection] = useState(1);
    const [autoFlippedToResults, setAutoFlippedToResults] = useState(false);
    const [scoot, setScoot] = useState(false)

    const filterData = (dataFilters) => {
        let tempData = data.docs
        let filteredData = []

        for (const perf of tempData) {
            const cutoff_year = new Date(1900, 0, 1)
            if (new Date(perf.date) <= cutoff_year) continue
            filteredData.push(perf)
        }
        tempData = filteredData
        filteredData = []
        
        for (const filter of dataFilters) {
            for (const perf of tempData) {
                switch (filter.set) {
                    case 'years':
                        const year = new Date(filter.filter, 0, 1)
                        const nextYear = new Date(filter.filter, 11, 31)
                        if (new Date(perf.date) >= year && new Date(perf.date) < nextYear) filteredData.push(perf)
                        break
                    case 'months':
                        if (filter.filter === new Date(perf.date).toLocaleString('en-US', {month: "long", timeZone: "UTC"})) filteredData.push(perf)
                        break
                    case 'songs':
                        for (const song of perf.setlist) {
                            if (filter.filter == song.title) {
                                filteredData.push(perf)
                                break
                            }
                        }
                        break
                    case 'cities': 
                        if (filter.filter == perf.city) filteredData.push(perf)
                        break
                    case 'states':
                        if (filter.filter == perf.state) filteredData.push(perf)
                        break
                    case 'venues':
                        if (filter.filter == perf.venue) filteredData.push(perf)
                        break
                    case 'show_type':
                        if (filter.filter == perf.show_type) filteredData.push(perf)
                        break
                    case 'tour':
                        if (filter.filter == perf.tour) filteredData.push(perf)
                        break
                }
            }
            tempData = filteredData
            filteredData = []
        }
        tempData.sort((a, b) => new Date(a.date) - new Date(b.date))
        return tempData
    }

    const generateFilters = (data, actives) => {
        const tempFilters = {
            years: [],
            songs: {
                originals: [],
                covers: []
            },
            cities: [],
            states: [],
            venues: [],
            show_type: [],
            tour: [],
            months: []
        }

        const counts = {
            years: {},
            songs: {},
            cities: {},
            states: {},
            tour: {},
            venues: {}
        }

        for (const perf of data) {
            const year = new Date(perf.date).getFullYear().toString()
            const month = new Date(perf.date).toLocaleString('en-US', {month: "long", timeZone: "UTC"})
            if (!tempFilters.years.includes(year)) tempFilters.years.push(year)
            if (!tempFilters.months.includes(month)) tempFilters.months.push(month)
            if (!tempFilters.cities.includes(perf.city)) tempFilters.cities.push(perf.city)
            if (!tempFilters.states.includes(perf.state)) tempFilters.states.push(perf.state)
            if (!tempFilters.venues.includes(perf.venue)) tempFilters.venues.push(perf.venue)
            if (!tempFilters.show_type.includes(perf.show_type)) tempFilters.show_type.push(perf.show_type)
            if (perf.tour && !tempFilters.tour.includes(perf.tour)) tempFilters.tour.push(perf.tour)
            for (const song of perf.setlist) {
                if (song.title.toLowerCase().includes("cover)")) {
                    if (!tempFilters.songs.covers.includes(song.title)) tempFilters.songs.covers.push(song.title)
                } else {
                    if (!tempFilters.songs.originals.includes(song.title)) tempFilters.songs.originals.push(song.title)
                }
            }

            counts.years[year] = year in counts.years ? counts.years[year] + 1 : 1
            counts.cities[perf.city] = perf.city in counts.cities ? counts.cities[perf.city] + 1 : 1
            counts.states[perf.state] = perf.state in counts.states ? counts.states[perf.state] + 1 : 1
            counts.venues[perf.venue] = perf.venue in counts.venues ? counts.venues[perf.venue] + 1 : 1
            if (perf.tour) counts.tour[perf.tour] = perf.tour in counts.tour ? counts.tour[perf.tour] + 1 : 1
            for (const song of perf.setlist) {
                counts.songs[song.title] = song.title in counts.songs ? counts.songs[song.title] + 1 : 1
            }
                
        }

        for (const key in tempFilters) {
            if (key == "songs") {
                tempFilters.songs.covers.sort()
                tempFilters.songs.originals.sort()
                tempFilters.songs = [...tempFilters.songs.originals, ...tempFilters.songs.covers]
            } else if (key == "months") {
                tempFilters.months.sort((a, b) => new Date(`${a} 1, 1997`) - new Date(`${b} 1, 1997`))
            } else if (key == "tour") {
                tempFilters.tour.sort((a, b) => new Date(`January 1, ${a.split(" ")[1]}`) - new Date(`January 1, ${b.split(" ")[1]}`))
            } else {
                tempFilters[key].sort()
            } 
        }

        for (const filter of actives) {
            tempFilters[filter.set].splice(tempFilters[filter.set].indexOf(filter.filter), 1)
            if (filter.set in counts) delete counts[filter.set][filter.filter]
        }

        const tempStatistics = {
            songs: {
                name: "",
                count: 0,
            },
            cities: {
                name: "",
                count: 0,
            },
            years: {
                name: "",
                count: 0,
            },
            states: {
                name: "",
                count: 0,
            },
            tour: {
                name: "",
                count: 0
            },
            venues: {
                name: "",
                count: 0
            }
        }

        for (const key in counts) {
            for (const item in counts[key]) {
                if (counts[key][item] > tempStatistics[key].count) {
                    tempStatistics[key].name = item
                    tempStatistics[key].count = counts[key][item]
                }
            }
        }

        return [ tempFilters, tempStatistics ]
    }

    const initialActiveFilters = []
    let params = new URLSearchParams(searchParams.toString())

    for (const [key, value] of searchParams.entries()) {
        initialActiveFilters.push({ set: key, filter: value })
    }

    const initialActiveData = filterData(initialActiveFilters)

    const [initialFilters, initialStatistics] = generateFilters(initialActiveData, initialActiveFilters)

    const [searchState, setSearchState] = useState(
        {
            topStatistics: initialStatistics,
            activeFilters: initialActiveFilters,
            filters: initialFilters,
            activeData: initialActiveData,
            query: "",
            filteredFilters: initialFilters
        }
    )
    const [expandedFilters, setExpandedFilters] = useState({
        years: true,
        months: true,
        songs: false,
        cities: false,
        states: false,
        venues: false,
        show_type: true,
        tour: false
    })
    const [displayResults, setDisplayResults] = useState(false)
    const [showCTA, setShowCTA] = useState(false)

    const deactivateFilter = (e) => {
        e.stopPropagation()

        const updateArray = []
        params = new URLSearchParams()

        for (let i = 0; i < searchState.activeFilters.length; i++) {
            if (searchState.activeFilters[i].set == e.target.getAttribute('set') 
                && searchState.activeFilters[i].filter == e.target.getAttribute('filter'))
                continue
            if (searchState.activeFilters[i].set == 'months'
                && e.target.getAttribute('set') == 'years')
                continue
            updateArray.push({ set: searchState.activeFilters[i].set, filter: searchState.activeFilters[i].filter})
            params.set(searchState.activeFilters[i].set, searchState.activeFilters[i].filter)
        }

        const updateData = filterData(updateArray)
        const [ updateFilters, updateTopStatistics ] = generateFilters(updateData, updateArray)
        
        setSearchState({
            topStatistics: updateTopStatistics,
            activeFilters: updateArray,
            filters: updateFilters,
            activeData: updateData,
            query: "",
            filteredFilters: updateFilters
        })

        // Hide CTA if no filters are active
        if (updateArray.length === 0) {
            setShowCTA(false)
        }

        if (scoot) setScoot(false)

        window.history.pushState(null, '', `?${params.toString()}`)

    }

    const activateFilter = (e) => {
        e.stopPropagation()

        const updateArray = [...searchState.activeFilters, {set: e.target.getAttribute('set'), filter: e.target.getAttribute('filter')}]
        const updateData = filterData(updateArray)
        const [ updateFilters, updateTopStatistics ] = generateFilters(updateData, updateArray)
                
        setSearchState({
            topStatistics: updateTopStatistics,
            activeFilters: updateArray,
            filters: updateFilters,
            activeData: updateData,
            query: "",
            filteredFilters: updateFilters
        })

        // Show CTA after first filter, hide after second
        // Don't show CTA if there's only one result (will auto-flip to results)
        if (searchState.activeFilters.length === 0 && updateData.length > 1 && !displayResults) {
            setShowCTA(true)
        } else if (searchState.activeFilters.length === 1) {
            setShowCTA(false)
        }

        params.set(e.target.getAttribute('set'), e.target.getAttribute('filter'))
        window.history.pushState(null, '', `?${params.toString()}`)

    }

    const showMoreFilters = (e, type) => {
        e.stopPropagation()

        const tempFilters = {...expandedFilters}
        tempFilters[type] = true
        setExpandedFilters(tempFilters)
    }

    const openSearch = (e) => {
        e.stopPropagation()
        setSearchOpen(!searchOpen)
    }

    const setQuery = (query) => {
        let stateMap = {
            "AL": "Alabama",
            "AK": "Alaska",
            "AS": "American Samoa",
            "AZ": "Arizona",
            "AR": "Arkansas",
            "CA": "California",
            "CO": "Colorado",
            "CT": "Connecticut",
            "DE": "Delaware",
            "DC": "District Of Columbia",
            "FM": "Federated States Of Micronesia",
            "FL": "Florida",
            "GA": "Georgia",
            "GU": "Guam",
            "HI": "Hawaii",
            "ID": "Idaho",
            "IL": "Illinois",
            "IN": "Indiana",
            "IA": "Iowa",
            "KS": "Kansas",
            "KY": "Kentucky",
            "LA": "Louisiana",
            "ME": "Maine",
            "MH": "Marshall Islands",
            "MD": "Maryland",
            "MA": "Massachusetts",
            "MI": "Michigan",
            "MN": "Minnesota",
            "MS": "Mississippi",
            "MO": "Missouri",
            "MT": "Montana",
            "NE": "Nebraska",
            "NV": "Nevada",
            "NH": "New Hampshire",
            "NJ": "New Jersey",
            "NM": "New Mexico",
            "NY": "New York",
            "NC": "North Carolina",
            "ND": "North Dakota",
            "MP": "Northern Mariana Islands",
            "OH": "Ohio",
            "OK": "Oklahoma",
            "OR": "Oregon",
            "PW": "Palau",
            "PA": "Pennsylvania",
            "PR": "Puerto Rico",
            "RI": "Rhode Island",
            "SC": "South Carolina",
            "SD": "South Dakota",
            "TN": "Tennessee",
            "TX": "Texas",
            "UT": "Utah",
            "VT": "Vermont",
            "VI": "Virgin Islands",
            "VA": "Virginia",
            "WA": "Washington",
            "WV": "West Virginia",
            "WI": "Wisconsin",
            "WY": "Wyoming"
        }

        if (query) {
            const tempFilters = {
                years: [],
                songs: [],
                cities: [],
                states: [],
                venues: [],
                show_type: [],
                months: [],
                tour: []
            }
    
            for (const key in searchState.filters) {
                for (const filter of searchState.filters[key]) {
                    if (filter.toLowerCase().includes(query.toLowerCase())) {
                        tempFilters[key].push(filter)
                    } else if (key == 'states' && stateMap[filter].toLowerCase().includes(query.toLowerCase())) {
                        tempFilters[key].push(filter)
                    }
                }
            }
            
            setSearchState({
                ...searchState,
                filteredFilters: tempFilters,
                query
            }) 
            setDisplayResults(false)
            setSearchOpen(true)
        } else {
            setSearchState({
                ...searchState,
                filteredFilters: searchState.filters,
                query
            }) 
            setDisplayResults(false)
            setSearchOpen(true)
        }
        
    }

    const highlightShowMarker = (show) => {
        showMarker.clearLayers()

        let pineIcon = L.divIcon({
            iconSize: [(5 + (map.getZoom() * 3.5)) * 1.5, (5 + (map.getZoom() * 3.5)) * 1.5],
            className: 'shadow light-green-paper border-2 border-solid border-[#174E00]',
        });

        let soloIcon = L.divIcon({
            iconSize: [(5 + (map.getZoom() * 3.5)) * 1.5, (5 + (map.getZoom() * 3.5)) * 1.5],
            className: 'shadow dark-green-paper border-2 border-solid border-[#73B700]',
        });

        let lat = show.latitude
        let lng = show.longitude
        if (show.state == "AK") {
            lat -= 38
            lng += 35.4
        }

        if (show.show_type == 'solo') {
            L.marker([lat, lng], {icon: soloIcon, zIndexOffset: 10000}).addTo(showMarker)
        } else {
            L.marker([lat, lng], {icon: pineIcon, zIndexOffset: 10000}).addTo(showMarker)
        }
    }

    const clearShowMarker = () => {
        showMarker.clearLayers()
    }

    useEffect(() => {

        if (!markers) return;

        markers.clearLayers()
        route.clearLayers()

        let drawTour = false

        if ((searchState.activeFilters.length == 1 && searchState.activeFilters[0].set == 'tour') || scoot) {
            drawTour = true
        } 

        let pineIcon = L.divIcon({
            iconSize: [5 + (map.getZoom() * 3.5), 5 + (map.getZoom() * 3.5)],
            className: 'shadow light-green-paper'
        });

        let soloIcon = L.divIcon({
            iconSize: [5 + (map.getZoom() * 3.5), 5 + (map.getZoom() * 3.5)],
            className: 'shadow dark-green-paper'
        });

        let nextShow = 0

        for (const show of searchState.activeData) {
            let lat = show.latitude
            let lng = show.longitude
            if (show.state == "AK") {
                lat -= 38
                lng += 35.4
            }
            if (drawTour && nextShow < searchState.activeData.length - 1){
                nextShow++
                if (show.state != "AK" && searchState.activeData[nextShow].state != "AK") {
                    let nextLat = searchState.activeData[nextShow].latitude,
                        nextLng = searchState.activeData[nextShow].longitude
                    L.polyline([[lat, lng], [nextLat, nextLng]], {color: '#7D7C85', lineCap: 'butt', weight: 6, dashArray: "10 10", dashOffset: '0'}).addTo(route);
                }
            }
            if (show.show_type == 'solo') {
                L.marker([lat, lng], {icon: soloIcon, zIndexOffset: 1000})
                    .on('mouseover', (e) => {
                        e.target._icon.style.transform += ' scale(1.3) translateX(-10%) translateY(-10%)'
                        e.target._icon.style.border = "2px solid #73B700"
                        e.target._icon.style.zIndex = 100 + Number(e.target._icon.style.zIndex)
                    })
                    .on('mouseout', (e) => {
                        e.target._icon.style.transform = e.target._icon.style.transform.split(') ')[0] + ")"
                        e.target._icon.style.border = ""
                        e.target._icon.style.zIndex = Number(e.target._icon.style.zIndex) - 100
                    })
                    .on('click', () => {
                        setLoading(true)
                        router.push(`/shows/${show.slug}`)
                    })
                    .addTo(markers)
                
            } else {
                L.marker([lat, lng], {icon: pineIcon, zIndexOffset: 1000})
                    .on('mouseover', (e) => {
                        e.target._icon.style.transform += ' scale(1.3) translateX(-10%) translateY(-10%)'
                        e.target._icon.style.border = "2px solid #174E00"
                        e.target._icon.style.zIndex = 100 + Number(e.target._icon.style.zIndex)
                    })
                    .on('mouseout', (e) => {
                        e.target._icon.style.transform = e.target._icon.style.transform.split(') ')[0] + ")"
                        e.target._icon.style.border = ""
                        e.target._icon.style.zIndex = Number(e.target._icon.style.zIndex) - 100
                    })
                    .on('click', () => {
                        setLoading(true)
                        router.push(`/shows/${show.slug}`)
                    })
                    .addTo(markers)
            
            }
        }
    }, [searchState, markers])

    useEffect(() => {
        setExpandedFilters({
            show_type: true,
            years: true,
            months: true,
            tour: false,
            songs: false,
            cities: false,
            states: false,
            venues: false,
        })
    }, [searchOpen])

    useEffect(() => {
        if ((!displayResults && searchState.activeData.length === 1 && !autoFlippedToResults) || (scoot && !autoFlippedToResults)) {
            setDirection(1);
            setDisplayResults(true);
            setAutoFlippedToResults(true);
            setShowCTA(false);
        }
        if ((searchState.activeData.length !== 1 && autoFlippedToResults && !scoot)) {
            setDirection(-1);
            setDisplayResults(false);
            setAutoFlippedToResults(false);
        }
    }, [searchState.activeData.length, displayResults, autoFlippedToResults, scoot]);

    const handleShowFilters = () => {
        setDirection(-1);
        setDisplayResults(false);
    };
    const handleShowResults = () => {
        setDirection(1);
        setDisplayResults(true);
        setShowCTA(false);
    };

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key
            if (e.target instanceof HTMLInputElement || (e.metaKey || e.ctrlKey)) return
            if (key === 'r') {
                handleShowResults()
            } else if (key === 'f') {
                handleShowFilters()
            }
        }

        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    const playScoot = () => {
        setScoot(true)

        let tempData = data.docs
        let filteredData = []
        for (const perf of tempData) {
            const cutoff_year = new Date(1900, 0, 1)
            if (new Date(perf.date) <= cutoff_year) filteredData.push(perf)
        }
        
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date))
        setSearchState({
            topStatistics: {},
            activeFilters: [{ set: 'scoot', filter: 'Scoot'}],
            filters: {
                years: [],
                songs: [],
                cities: [],
                states: [],
                venues: [],
                show_type: [],
                months: [],
                tour: []
            },
            activeData: filteredData,
            query: "",
            filteredFilters: {
                years: [],
                songs: [],
                cities: [],
                states: [],
                venues: [],
                show_type: [],
                months: [],
                tour: []
            }
        })
    }

    return (
        <div className={`fixed z-[5001] ${searchOpen ? 'h-full' : 'h-min'} top-1 left-1/2 md:left-auto right-auto md:!left-3 -translate-x-1/2 md:-translate-x-0 w-[95vw] max-w-sm flex flex-col pb-4`} onClick={(e) => e.stopPropagation()}>

                <div className="w-full fixed z-[6000] left-1/2 -translate-x-1/2 top-2 rounded flex flex-col gap-2 text-trail-yellow wood-shadow drop-shadow-xl font-pg wood-550 p-2 text-3xl rounded">
                    <div className="flex pl-2 w-full items-center justify-between">
                        <div className="font-pg text-2xl text-trail-yellow ">pinegrove</div>
                        <div className="flex gap-2">
                            <IconButton 
                                onClick={() => setInfoModalOpen(true)} 
                                tooltip="about"
                            >
                                <img 
                                    src="/info_icon.svg" 
                                    alt="about"
                                    className="w-[15px] h-[15px] opacity-90"
                                />
                            </IconButton>
                            <LinkButton 
                                href="https://pinegroveband.com/"
                                tooltip="home"
                                ariaLabel="Visit Pinegrove's official website"
                            >
                                <img 
                                    src="/home_outline.svg" 
                                    alt="home"
                                    className="w-4 h-4 opacity-90"
                                />
                            </LinkButton>
                            <LinkButton 
                                href="https://pinegrove.merchtable.com/"
                                tooltip="shop"
                                ariaLabel="Visit Pinegrove merchandise store"
                            >
                                <img 
                                    src="/shop.svg" 
                                    alt="shop"
                                    className="w-4 h-4 opacity-90"
                                />
                            </LinkButton>
                            <IconButton 
                                onClick={() => setSearchOpen(!searchOpen)}
                                tooltip={searchOpen ? "collapse search" : "expand search"}
                            >
                                <img 
                                    src={searchOpen ? "/compress.svg" : "/expand.svg"} 
                                    alt={searchOpen ? "Collapse search bar" : "Expand search bar"}
                                    className="w-4 h-4 opacity-90"
                                />
                            </IconButton>
                        </div>
                    </div>

                    <motion.div
                        id="search-container"
                        animate={{ height: bounds.height + 40 }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        className="search-input flex flex-col gap-1 py-2 h-auto parchment-dark rounded shadow-inner-search overflow-hidden"
                    >
                        <input 
                            type="text" 
                            name="search" 
                            autoComplete="off"
                            placeholder={`search by year, song, state, venue...`} 
                            className={`z-[7000] font-serif px-4 bg-transparent text-black text-base w-full flex flex-col`} 
                            value={searchState.query}
                            onChange={(e) => {setQuery(e.target.value)}}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!searchOpen) setSearchOpen(true);
                            }}
                        />
                            {searchState.activeFilters.length > 0 && <div ref={ref} className="flex gap-2 p-2 flex-col w-full">
                            <div className="flex gap-2 items-center flex-wrap">
                                {searchState.activeFilters.map((filter, idx) => {
                                    return (
                                        <Fragment key={`activeFilter${idx}`}>
                                            <div onClick={deactivateFilter} className="z-[7000] drop-shadow bg-trail-yellow text-black font-serif bg-cover text-sm max-w-[35ch] font-serif flex gap-2 items-center pl-2 pr-1 py-1 cursor-pointer" set={filter.set} filter={filter.filter}>
                                                {filter.set === 'show_type' && (filter.filter == 'solo' ? 'Solo Show' : 'Full Band')}
                                                {filter.set !== 'show_type' && filter.filter}
                                                <IoCloseSharp className="pointer-events-none w-6" set={filter.set} filter={filter.filter} />
                                            </div>
                                            {idx < searchState.activeFilters.length - 1 && <div className="mt-1 text-sm text-pg-red">&</div>}
                                        </Fragment>
                                    )
                                })}
                            </div>
                        </div>}
                    </motion.div>
                </div>

            
                
                <div className={`${searchOpen ? "flex" : "hidden" } font-serif w-full text-sm px-2 font-pg h-full overflow-y-scroll mt-2 drop-shadow-lg flex-col text-black`}>

                    <div className={` ${searchOpen ? "pb-6" : "pb-0"} hidden-scrollbar pointer-events-auto shadow-inner-dropdown parchment-dark overflow-y-scroll flex flex-col px-3`}>

                            <div className="mt-4 w-full text-sm items-center font-pg font-serif justify-between flex gap-2">
                                <div className="flex items-center gap-2 font-pg text-gray-3 relative">
                                    <div className="pl-1 pr-2 text-black text-base">view:</div>
                                    <div
                                        className={`cursor-pointer relative px-2 py-1 text-gray-3`}
                                        onClick={handleShowFilters}
                                        id="filters-tab"
                                    >
                                        filters
                                        { !displayResults && (
                                            <motion.div
                                                layoutId="search-tab-underline"
                                                className="absolute left-0 right-0 bottom-0 h-full w-full pointer-events-none"
                                                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                            >
                                                <HandDrawnBorder active />
                                            </motion.div>
                                        )}
                                    </div>
                                    <div
                                        className={`cursor-pointer relative px-2 py-1 text-gray-3`}
                                        onClick={handleShowResults}
                                        id="results-tab"
                                    >
                                        {`results (${searchState.activeData.length})`}
                                        { displayResults && (
                                            <motion.div
                                                layoutId="search-tab-underline"
                                                className="absolute left-0 right-0 bottom-0 h-full w-full pointer-events-none"
                                                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                            >
                                                <HandDrawnBorder active />
                                            </motion.div>
                                        )}
                                        {/* CTA overlay */}
                                        {showCTA && (
                                            <div className="absolute bottom-[-2px] right-[-42px] translate-x-1/2 translate-y-1/2 pointer-events-none z-10">
                                                <img 
                                                    src="/click_cta.svg" 
                                                    alt="Click here for shows"
                                                    className="w-auto h-auto"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            
                            </div>

                                    {displayResults ? (
                                        <div className={`flex gap-2 flex-col w-full ${scoot ? 'mt-0' : 'mt-6'}`}>
                                            {!scoot && <SummaryStatistics topStatistics={searchState.topStatistics} activateFilter={activateFilter}/>}
                                            <div className="mb-1 mt-6 border-b-[1px] border-black text-base w-full flex flex-col">
                                                <div className="px-1">
                                                selected shows
                                                </div>
                                            </div>
                                            <ul className="flex px-1 gap-1 flex-col">
                                                {searchState.activeData.map(((show, i) => <Link 
                                                    className="hover:underline" 
                                                    key={`result${i}`} 
                                                    href={`/shows/${show.slug}`}
                                                    onPointerOver={() => {highlightShowMarker(show)}}
                                                    onPointerOut={clearShowMarker}
                                                >
                                                    <b>{show.venue}</b> ({`${(1 + new Date(show.date).getUTCMonth()).toString().padStart(2, '0')}-${new Date(show.date).getUTCDate().toString().padStart(2, '0')}-${new Date(show.date).getUTCFullYear()}`})
                                                </Link>))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <>
                                            {searchState.filteredFilters.show_type.length > 0 && <div className="flex gap-2 mt-6 flex-col">
                                                <div className="mb-1 border-b-[1px] border-black text-base w-full flex flex-col">
                                                    <div className="px-1">
                                                    show type
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    {searchState.filteredFilters.show_type.slice(0, expandedFilters.show_type ? searchState.filteredFilters.show_type.length : 9).map((value, idx) => {
                                                        return <div key={`showType${idx}`} className={`drop-shadow max-w-[35ch] text-cream font-serif px-2 py-1 cursor-pointer ${value == 'solo' ? 'bg-dark-green' : 'bg-light-green'}`} set={'show_type'} filter={value} onClick={activateFilter}>{value == 'solo' ? 'Solo Show' : 'Full Band'}</div>
                                                    })}
                                                    {!expandedFilters.show_type && searchState.filteredFilters.show_type.length > 10 && <div onClick={(e) => showMoreFilters(e, 'show_type')} className="drop-shadow bg-light-blue text-black font-serif bg-cover w-min px-2 py-1 cursor-pointer" >more...</div>}
                                                </div>
                                            </div>}
                                    
                                            {searchState.filteredFilters.years.length > 0 && <div className="flex gap-2 mt-6 flex-col">
                                                <div className="mb-1 border-b-[1px] border-black text-base w-full flex flex-col">
                                                    <div className="px-1">
                                                    year
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    {searchState.filteredFilters.years.slice(0, expandedFilters.years ? searchState.filteredFilters.years.length : 9).map((value, idx) => {
                                                        return <div key={`year${idx}`} className="drop-shadow bg-dark-blue font-serif text-cream bg-cover w-min px-2 py-1 cursor-pointer" set={'years'} filter={value} onClick={activateFilter} >{value}</div>
                                                    })}
                                                    {!expandedFilters.years && searchState.filteredFilters.years.length > 10 && <div onClick={(e) => showMoreFilters(e, 'years')} className="drop-shadow bg-light-blue font-serif bg-cover w-min px-2 py-1 text-cream cursor-pointer" >more...</div>}
                                                </div>
                                            </div>}

                                            {(searchState.filteredFilters.years.length == 0 && searchState.filteredFilters.months.length > 0) && <div className="flex gap-2 mt-6 flex-col">
                                                <div className="mb-1 border-b-[1px] border-black text-base w-full flex flex-col">
                                                    <div className="px-1">
                                                    month
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    {searchState.filteredFilters.months.slice(0, expandedFilters.months ? searchState.filteredFilters.months.length : 9).map((value, idx) => {
                                                        return <div key={`month${idx}`} className="drop-shadow bg-dark-blue font-serif text-cream bg-cover w-min px-2 py-1 cursor-pointer" set={'months'} filter={value} onClick={activateFilter} >{value}</div>
                                                    })}
                                                    {!expandedFilters.months && searchState.filteredFilters.months.length > 10 && <div onClick={(e) => showMoreFilters(e, 'months')} className="drop-shadow bg-light-blue font-serif bg-cover w-min px-2 py-1 text-cream cursor-pointer" >more...</div>}
                                                </div>
                                            </div>}

                                            {searchState.filteredFilters.tour.length > 0 && <div className="flex gap-2 mt-6 flex-col">
                                                <div className="mb-1 border-b-[1px] border-black text-base w-full flex flex-col">
                                                    <div className="px-1">
                                                    tour
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    {searchState.filteredFilters.tour.slice(0, expandedFilters.tour ? searchState.filteredFilters.tour.length : 9).map((value, idx) => {
                                                        return <div key={`tour${idx}`} className="drop-shadow max-w-[35ch]   bg-dark-blue text-cream font-serif px-2 py-1 cursor-pointer" set={'tour'} filter={value} onClick={activateFilter}>{value}</div>
                                                    })}
                                                    {!expandedFilters.tour && searchState.filteredFilters.tour.length > 10 && <div onClick={(e) => showMoreFilters(e, 'tour')} className="drop-shadow bg-light-blue text-black font-serif bg-cover w-min px-2 py-1 cursor-pointer" >more...</div>}
                                                </div>
                                            </div>}

                                            
                                            {searchState.filteredFilters.songs.length > 0 && <div className="flex gap-2 mt-6 flex-col">
                                                <div className="mb-1 border-b-[1px] border-black text-base w-full flex flex-col">
                                                    <div className="px-1">
                                                    song
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    {searchState.filteredFilters.songs.slice(0, expandedFilters.songs ? searchState.filteredFilters.songs.length : 9).map((value, idx) => {
                                                        return <div key={`song${idx}`} className="drop-shadow max-w-[35ch]   bg-dark-blue text-cream font-serif px-2 py-1 cursor-pointer" set={'songs'} filter={value} onClick={activateFilter}>{value}</div>
                                                    })}
                                                    {!expandedFilters.songs && searchState.filteredFilters.songs.length > 10 && <div onClick={(e) => showMoreFilters(e, 'songs')} className="drop-shadow bg-light-blue text-black font-serif bg-cover w-min px-2 py-1 cursor-pointer" >more...</div>}
                                                </div>
                                            </div>}

                                            {searchState.filteredFilters.states.length > 0 && <div className="flex gap-2 mt-6 flex-col">
                                                <div className="mb-1 border-b-[1px] border-black text-base w-full flex flex-col">
                                                    <div className="px-1">
                                                    state
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    {searchState.filteredFilters.states.slice(0, expandedFilters.states ? searchState.filteredFilters.states.length : 9).map((value, idx) => {
                                                        return <div key={`state${idx}`} className="drop-shadow     bg-dark-blue text-cream font-serif bg-cover px-2 py-1 cursor-pointer" set={'states'} filter={value} onClick={activateFilter}>{value}</div>
                                                    })}
                                                    {!expandedFilters.states && searchState.filteredFilters.states.length > 10 && <div onClick={(e) => showMoreFilters(e, 'states')} className="drop-shadow bg-light-blue font-serif bg-cover w-min px-2 py-1 text-black cursor-pointer" >more...</div>}
                                                
                                                </div>
                                            </div>}

                                            {searchState.filteredFilters.cities.length > 0 && <div className="flex gap-2 mt-6 flex-col">
                                                <div className="mb-1 border-b-[1px] border-black text-base w-full flex flex-col">
                                                    <div className="px-1">
                                                    city
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    {searchState.filteredFilters.cities.slice(0, expandedFilters.cities ? searchState.filteredFilters.cities.length : 9).map((value, idx) => {
                                                        return <div key={`city${idx}`} className="drop-shadow     bg-dark-blue text-cream font-serif bg-cover px-2 py-1 cursor-pointer" set={'cities'} filter={value} onClick={activateFilter}>{value}</div>
                                                    })}
                                                    {!expandedFilters.cities && searchState.filteredFilters.cities.length > 10 && <div onClick={(e) => showMoreFilters(e, 'cities')} className="drop-shadow bg-light-blue font-serif bg-cover w-min px-2 py-1 text-black cursor-pointer" >more...</div>}
                                                </div>
                                            </div>} 

                                            {searchState.filteredFilters.venues.length > 0 && <div className="flex gap-2 mt-6 flex-col">
                                                <div className="mb-1 border-b-[1px] border-black text-base w-full flex flex-col">
                                                    <div className="px-1">
                                                    venue
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    {searchState.filteredFilters.venues.slice(0, expandedFilters.venues ? searchState.filteredFilters.venues.length : 9).map((value, idx) => {
                                                        return <div key={`venue${idx}`} className="drop-shadow max-w-[34ch] bg-dark-blue text-cream font-serif bg-cover px-2 py-1 cursor-pointer" set={'venues'} filter={value} onClick={activateFilter}>{value}</div>
                                                    })}
                                                    {!expandedFilters.venues && searchState.filteredFilters.venues.length > 10 && <div onClick={(e) => showMoreFilters(e, 'venues')} className="drop-shadow bg-light-blue font-serif bg-cover w-min px-2 py-1 text-black cursor-pointer" >more...</div>}                          

                                                </div>
                                            </div>}

                                            {!scoot && Object.keys(expandedFilters).every(value => expandedFilters[value]) && searchState.activeFilters.length < 1 && <div className="flex gap-2 mt-6 flex-col">
                                                <div className="mb-1 border-b-[1px] border-black text-base w-full flex flex-col">
                                                    <div className="px-1">
                                                    Scoot
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    <div key={`scoot`} className="drop-shadow max-w-[34ch] bg-trail-yellow text-black font-serif bg-cover px-2 py-1 cursor-pointer" onClick={playScoot}>Play</div>                

                                                </div>
                                            </div>}
                                        </>
                                    )}
                            {scoot && <audio src="/scoot.m4a" autoPlay />}
                    </div>
                </div>

            </div>
    )
}