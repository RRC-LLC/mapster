import { CollectionConfig } from "payload";
import { isAdminOrEditor } from "@/payload/access";

export const Corrections: CollectionConfig = {
    slug: 'corrections',
    access: {
        create: isAdminOrEditor,
        update: isAdminOrEditor,
        delete: isAdminOrEditor,
    },
    admin: {
        hidden: ({ user }) => !(user?.role === 'admin' || user?.role === 'editor'),
    },
    fields: [
        {
            name: 'show',
            type: 'relationship',
            relationTo: 'shows',
            label: "Show (if Artist/Setlist update)"
        },
        {
            name: 'contact',
            type: 'text',
        },
        {
            name: 'details',
            type: 'textarea',
        },
    ]
}