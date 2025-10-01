import type { CollectionConfig } from 'payload'
import { isAdmin, userOrAdmin, isAdminFieldLevel } from '@/payload/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: isAdmin,
    read: userOrAdmin,
    update: userOrAdmin,
    delete: userOrAdmin,
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'role',
      // Save this field to JWT so we can use from `req.user`
      saveToJWT: true,
      type: 'radio',
      required: true,
      defaultValue: 'member',
      access: {
        // Only admins can update a value for this field
        update: isAdminFieldLevel,
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Moderator',
          value: 'moderator',
        },
      ]
    },
    {
      name: 'name',
      type: 'text',
    }
  ],
}
