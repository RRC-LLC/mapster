import * as fs from 'fs';
import { parse } from "csv-parse/sync";
import { getPayload } from 'payload'
import config from '@payload-config'

const seed = async () => {
    // Get a local copy of Payload by passing your config
    const payload = await getPayload({ config })
  
    const file = fs.readFileSync("shows.csv")
    const records = parse(file, { delimiter: ",", from_line: 2 })
    for (let row of records) {
        const otherArtists = row[8] !== '' ? row[8].split(", ").map((artist) => {return {name: artist }}) : []
        const setlist = []
        for (let i = 13; i < 39; i++) {
            if (row[i]) {
                const songData = await payload.find({
                    collection: 'songs',
                    where: {
                        title: { equals: row[i] }
                    }
                })
                setlist.push({title: row[i], songData: songData.docs.length ? songData.docs[0].id : null })
            } else {
                break
            }
        }
        await payload.create({
            collection: 'shows',
            data: {
                date: row[0],
                time: row[1] ? row[1] : undefined,
                venue: row[2],
                address: row[3] ? row[3] : null,
                city: row[4],
                state: row[5],
                country: row[6],
                postal_code: row[7],
                other_artists: otherArtists,
                event_name: row[9] ? row[9] : null,
                show_type: row[10] ? row[10] : 'band',
                latitude: parseFloat(row[11]),
                longitude: parseFloat(row[12]),
                setlist
            },
          })
    }
  
  }
  
await seed()
