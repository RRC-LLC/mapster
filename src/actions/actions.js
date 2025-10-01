'use server'
import { getPayload } from 'payload'
import configPromise from '@payload-config' 

const payload = await getPayload({ config: configPromise })

export async function verifyReCAPTCHA(token) {
    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`, {
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        method: "post",
    })
    const json = await res.json()
    return json.success
}

export async function submitShowEditorData(data) {
    if (data.type == 'artists') {
        await payload.create({
            collection: 'corrections',
            data: {
                show: data.showId,
                details: `Other Artist(s) Update:
${data.array.map(artist => artist.name+'\n').join("")}
`
            }
        })
    } else if (data.type == 'setlist') {
        await payload.create({
            collection: 'corrections',
            data: {
                show: data.showId,
                details: `Setlist Update:
${data.array.map(song => song.name+'\n').join("")}
`
            }
        })
    }
}

export async function submitCorrection(data) {
    
    await payload.create({
        collection: 'corrections',
        data: {
            contact: data.email,
            details: data.details
        }
    })
}

export async function submitVideoProposal(data) {
    await payload.create({
        collection: 'submissions',
        data: {
            show: data.showId,
            youtube_id: data.url
        }
    })
}

export async function submitImageProposal(data) {
    await payload.create({
        collection: 'submissions',
        data: {
            show: data.showId,
            image: data.image
        }
    })
}

export async function submitTextProposal(data) {
    await payload.create({
        collection: 'submissions',
        data: {
            show: data.showId,
            memory: data.content
        }
    })
}

export async function uploadImage(file) {
    const buffer = Buffer.from(await file.arrayBuffer())
    let image = await payload.create({
        collection: 'images',
        data: {
            alt: 'Fan Submission',
        },
        file: {
            data: buffer,
            mimetype: file.type,
            name: file.name,
            size: file.size,
        },
    })
    return { id: image.id }
}

export async function deleteImage(id) {
    await payload.delete({
        collection: 'images',
        id
    })
}