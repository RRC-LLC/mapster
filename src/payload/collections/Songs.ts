import { CollectionConfig } from "payload";
import { isAdminOrEditor } from "@/payload/access";
import { lexicalHTML } from "@payloadcms/richtext-lexical";

export const Songs: CollectionConfig = {
    slug: 'songs',
    access: {
        create: isAdminOrEditor,
        update: isAdminOrEditor,
        read: () => true,
        delete: isAdminOrEditor,
    },
    admin: {
        hidden: ({ user }) => !(user?.role === 'admin' || user?.role === 'editor'),
        useAsTitle: 'title'
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true
        },
        {
            name: 'album',
            type: 'text',
            label: 'Album(s) [Comma-separated]'
        },
        {
            name: 'lyrics',
            type: 'richText',
        },
        lexicalHTML('lyrics', { name: 'lyrics_html'}),
        {
            name: 'tab',
            type: 'upload',
            relationTo: 'files',
        },
    ]
}