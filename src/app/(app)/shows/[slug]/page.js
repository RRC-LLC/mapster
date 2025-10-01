import { redirect } from "next/navigation"
import Show from "@/components/Show"
import { getPayload } from "payload"
import configPromise from '@payload-config'
import { unstable_cache } from "next/cache"

const payload = await getPayload({ config: configPromise })

export async function generateMetadata({ params }) {
  const slug = (await params).slug

  const show = await unstable_cache(
    async () => payload.find({
      collection: 'shows',
      where: {
        slug: {
          equals: slug
        }
      },
      limit: 1,
    }),
    ['show', slug],
    {
      tags: ['shows']
    }
  )()

  const showData = show?.docs[0]
  
  if (!showData?.id) {
    return {
      title: {
        default: "Show Not Found",
      },
      description: "The requested show could not be found.",
    }
  }

  const showDate = showData.date ? new Date(showData.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'TBD'

  const location = showData.city && showData.state 
    ? `${showData.city}, ${showData.state}`
    : showData.venue || 'Location TBD'

  const title = `Pinegrove | ${showDate}`
  const description = `A show in ${location}.`

  return {
    title: {
      default: title,
    },
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
    twitter: {
      title: title,
      description: description,
    },
  }
}

export default async function ShowPage({ params }) {

  const slug = (await params).slug

    const show = await unstable_cache(
        async () => payload.find({
          collection: 'shows',
          where: {
            slug: {
                equals: slug
            }
          },
          limit: 1,
          depth: 3,
        }),
        ['show', slug],
        {
          tags: ['shows']
        }
      )()

    if (!show?.docs[0].id || parseInt(slug.split('-')[0]) < 1900) redirect('/')
    
    return (
        <main>
            <Show show={show.docs[0]} />
        </main>
    )
}