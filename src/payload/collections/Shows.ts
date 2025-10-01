import { CollectionConfig } from "payload";
import { isAdminOrEditor } from "@/payload/access";
import { slugField } from "../fields/slug";
import { revalidateTag } from "next/cache";

export const Shows: CollectionConfig = {
    slug: 'shows',
    access: {
        create: isAdminOrEditor,
        update: isAdminOrEditor,
        read: () => true,
        delete: isAdminOrEditor,
    },
    hooks: {
        afterChange: [
          async () => revalidateTag('shows')
        ]
    },
    admin: {
        hidden: ({ user }) => !(user?.role === 'admin' || user?.role === 'editor'),
        useAsTitle: 'date_string'
    },
    fields: [
        {
            name: 'tour',
            type: 'text'
        },
        {
            name: 'venue',
            type: 'text',
            required: true
        },
        {
            name: 'address',
            type: 'text',
        },
        {
            name: 'city',
            type: 'text',
            required: true
        },
        {
            name: 'state',
            type: 'text',
            required: true
        },
        {
            name: 'postal_code',
            type: 'text',
            required: true
        },
        {
            name: 'country',
            type: 'text',
            required: true
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'latitude',
                    type: 'number',
                    required: true
                },
                {
                    name: 'longitude',
                    type: 'number',
                    required: true
                },
            ]
        },
        {
            name: 'date',
            type: 'date',
            timezone: true,
            required: true,
        },
        {
            name: 'date_string',
            type: 'text',
            label: 'Date',
            admin: {  
                hidden: true
            },
            hooks: {
                beforeValidate: [
                    async ({siblingData}) => {
                        return siblingData.date.split("T")[0]
                    }
                ]
            },
        },
        {
            name: 'time',
            type: 'select',
            options: [
                {
                    label: 'Day',
                    value: 'day',
                },
                {
                    label: 'Night',
                    value: 'night',
                },
            ]
        },
        {
            name: 'show_type',
            type: 'select',
            required: true,
            defaultValue: 'band',
            label: 'Show Type',
            options: [
                {
                    label: 'Full Band',
                    value: 'band',
                },
                {
                    label: 'Solo',
                    value: 'solo',
                },
            ]
        },
        {
            name: 'event_name',
            label: 'Event Name',
            type: 'text',
        },
        {
            name: 'notes',
            label: 'Show Notes',
            type: 'textarea',
        },
        {
            name: 'other_artists',
            type: 'array',
            admin: {
                components: {
                    RowLabel: {
                        path: '@/payload/components/RowLabel.tsx#RowLabel',
                        clientProps: {
                            fallback: 'Artist',
                            field: 'name'
                        }
                    }
                },
                initCollapsed: true
            },
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true
                }
            ],
            label: 'Other Artists'
        },
        {
            name: 'setlist',
            type: 'array',
            admin: {
                components: {
                    RowLabel: {
                        path: '@/payload/components/RowLabel.tsx#RowLabel',
                        clientProps: {
                            fallback: 'Song',
                            field: 'title'
                        }
                    }
                },
                initCollapsed: true
            },
            fields: [
                {
                    name: 'title',
                    type: 'text',
                },
                {
                    name: 'songData',
                    type: 'relationship',
                    relationTo: 'songs'
                }
            ]
        },
        {
            name: 'images', 
            type: 'array',
            admin: {
                components: {
                    RowLabel: {
                        path: '@/payload/components/RowLabel.tsx#RowLabel',
                        clientProps: {
                            fallback: 'Image',
                            field: 'title'
                        }
                    }
                },
                initCollapsed: true
            },
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    admin: {  
                        hidden: true
                    },
                    hooks: {
                        beforeChange: [
                            async ({siblingData, req}) => {
                                const image = await req.payload.findByID({
                                    collection: 'images',
                                    id: siblingData.image
                                })
                
                                return image.filename
                            }
                        ]
                    },
                },
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'images',
                    required: true,
                },
            ],
        },
        {
            name: 'videos',
            type: 'array',
            admin: {
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'youtube_id',
                    label: 'YouTube ID',
                    type: 'text'
                }
            ]
        },
        {
            name: 'memories',
            type: 'array',
            admin: {
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'content',
                    label: 'Details',
                    type: 'textarea'
                }
            ]
        },
        slugField(['date_string', 'time'])
    ]
}