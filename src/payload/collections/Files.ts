import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/payload/access'

export const Files: CollectionConfig = {
  slug: 'files',
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.filename = data.filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
          return {
            ...data,
          }
        }
      },
    ],
  },
  access: {
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    read: () => true,
    delete: isAdminOrEditor,
  },
  admin: {
    hidden: ({ user }) => !(user?.role === 'admin' || user?.role === 'editor'),
  },
  fields: [
    
  ],
}