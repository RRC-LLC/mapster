import type { Field } from 'payload'

import deepMerge from '@/payload/lib/deepMerge'
import formatSlug from '@/payload/hooks/formatSlug'

type Slug = (fieldToUses?: Array<string>, overrides?: Partial<Field>) => Field

export const slugField: Slug = (fieldToUse = ['title'], overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true
      },
      hooks: {
        beforeChange: [formatSlug(fieldToUse)],
      },
    },
    overrides,
  )
