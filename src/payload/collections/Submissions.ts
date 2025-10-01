import { CollectionConfig } from "payload";
import { isAdmin } from "@/payload/access";

export const Submissions: CollectionConfig = {
    slug: 'submissions',
    access: {
      create: isAdmin,
      delete: isAdmin
    },
    hooks: {
      afterChange: [
        async ({ doc, operation, req }) => {
          if (operation === 'update' && doc.review_status !== 'pending') {
            if (doc.review_status === 'approved') {
              const show = await req.payload.findByID({
                req,
                collection: 'shows',
                id: doc.show
              })
              if (doc.youtube_id) {
                // payload.update show with video
                show.videos = show.videos ? [...show.videos, { youtube_id: doc.youtube_id }] : [{ youtube_id: doc.youtube_id }]
                await req.payload.update({
                  req,
                  collection: 'shows',
                  id: doc.show,
                  data: {
                    videos: show.videos
                  }
                })
              } else if (doc.memory) {
                show.memories = show.memories ? [...show.memories, { content: doc.memory }] : [{ content: doc.memory }]
                await req.payload.update({
                  req,
                  collection: 'shows',
                  id: doc.show,
                  data: {
                    memories: show.memories
                  }
                })
              } else {
                // payload.update show with image
                show.images = show.images ? [...show.images, { image: doc.image }] : [{ image: doc.image }]
                await req.payload.update({
                  req,
                  collection: 'shows',
                  id: doc.show,
                  data: {
                    images: show.images
                  }
                })
              }
            } else if (doc.review_status === 'rejected' && doc.image) {
              // payload.delete image
              await req.payload.delete({
                req,
                collection: 'images',
                id: doc.image
              })
            }
            // payload.delete submission
            await req.payload.delete({
              req,
              collection: 'submissions',
              id: doc.id
            })
          }
        }
      ]
    },
    fields: [
        {
            name: 'show',
            type: 'relationship',
            relationTo: 'shows',
            required: true,
            admin: {
                readOnly: true
            }
        },
        {
              name: 'review_status',
              label: 'Status',
              type: 'radio',
              required: true,
              defaultValue: 'pending',
              options: [
                {
                  label: 'Pending',
                  value: 'pending',
                },
                {
                  label: 'Approved',
                  value: 'approved',
                },
                {
                  label: 'Rejected',
                  value: 'rejected',
                },
              ]
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'images',
        },
        {
            name: 'youtube_id',
            label: 'YouTube ID',
            type: 'text',
            admin: {
                readOnly: true,
                components: {
                  Field: '@/payload/fields/YoutubeEmbed#YoutubeEmbed'
                }
                
            }
        },
        {
            name: 'memory',
            label: 'Memory',
            type: 'textarea',
        },
        
    ]
}