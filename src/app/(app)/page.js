import dynamic from "next/dynamic"
import { unstable_cache } from "next/cache"
import MapLoading from "@/components/MapLoading"
import { getPayload } from "payload"
import configPromise from '@payload-config'

const Map = dynamic(
  () => import('../../components/Map'),
  { 
    loading: MapLoading
  }
)

const payload = await getPayload({ config: configPromise })

export default async function Home({ }) {

  const data = await unstable_cache(
    async () => payload.find({
      collection: 'shows',
      pagination: false,
      select: {
        tour: true,
        venue: true,
        latitude: true,
        longitude: true,
        date: true,
        city: true,
        state: true,
        setlist: {
          title: true
        },
        show_type: true,
        slug: true
      }
    }),
    ['shows'],
    {
      tags: ['shows']
    }
  )()

  return (
    <main className="w-screen h-screen">
      <Map data={data} />
    </main>
  )
}
