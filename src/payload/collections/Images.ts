import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/payload/access'
import { getPlaiceholder } from "plaiceholder"

async function getImagePlaceholder(url: string, buffer: Buffer): Promise<string> {
  if (url) {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer())
    const { base64 } = await getPlaiceholder(imageBuffer, {
      size: 10,
    })

    return base64
  } else {
    const { base64 } = await getPlaiceholder(buffer, {
      size: 10,
    })

    return base64
  }
  
}


export const Images: CollectionConfig = {
  slug: 'images',
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          const placeholder = await getImagePlaceholder(data.url, req.file?.data || Buffer.alloc(0))
          data.filename = Date.now().toString(36) + Math.random().toString(36).substring(2) + "." + data.filename.split(".").pop()
          return {
            ...data,
            placeholder,
          }
        }
      },
    ],
  },
  access: {
    create: isAdminOrEditor,
    read: () => true,
    delete: isAdminOrEditor,
  },
  admin: {
    hidden: ({ user }) => !(user?.role === 'admin' || user?.role === 'editor'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: "placeholder",
      type: "text",
      label: "Placeholder",
      admin: {
        readOnly: true
      }
    },
  ],
}