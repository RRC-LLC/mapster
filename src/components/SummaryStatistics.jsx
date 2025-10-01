export default function SummaryStatistics({topStatistics, activateFilter}) {
    
    return <>
        {Object.keys(topStatistics).some((category) => { return topStatistics[category].count > 1 }) && <>
            <div className="mb-1 border-b-[1px] border-black text-base w-full flex flex-col">
                <div className="px-1">
                    summary statistics
                </div>
            </div>
            <div>
                <ul className="flex col-span-2 px-1 gap-1 flex-col">
                    {topStatistics.songs.count > 1 && <li><b>Top Song:</b> <span className="cursor-pointer hover:underline" set={'songs'} filter={topStatistics.songs.name} onClick={activateFilter}>{topStatistics.songs.name} ({topStatistics.songs.count})</span></li>}
                    {topStatistics.venues.count > 1 && <li><b>Top Venue:</b> <span className="cursor-pointer hover:underline" set={'venues'} filter={topStatistics.venues.name} onClick={activateFilter}>{topStatistics.venues.name} ({topStatistics.venues.count})</span></li>}
                    {topStatistics.cities.count > 1 && <li><b>Top City:</b> <span className="cursor-pointer hover:underline" set={'cities'} filter={topStatistics.cities.name} onClick={activateFilter}>{topStatistics.cities.name} ({topStatistics.cities.count})</span></li>}
                    {(topStatistics.states.count > 1 && topStatistics.cities.count > 1) && <li><b>Top State:</b> <span className="cursor-pointer hover:underline" set={'states'} filter={topStatistics.states.name} onClick={activateFilter}>{topStatistics.states.name} ({topStatistics.states.count})</span></li>}
                    {topStatistics.years.count > 1 && <li><b>Top Year:</b> <span className="cursor-pointer hover:underline" set={'years'} filter={topStatistics.years.name} onClick={activateFilter}>{topStatistics.years.name} ({topStatistics.years.count})</span></li>}
                    {topStatistics.tour.count > 1 && <li><b>Top Tour:</b> <span className="cursor-pointer hover:underline" set={'tour'} filter={topStatistics.tour.name} onClick={activateFilter}>{topStatistics.tour.name} ({topStatistics.tour.count})</span></li>}
                </ul>
            </div>
        </>}
        
    </>
}