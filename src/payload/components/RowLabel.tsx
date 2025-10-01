'use client'

import { useRowLabel } from '@payloadcms/ui'
import { Data } from 'payload'
import React from 'react'

export const RowLabel = ({ field, fallback } : { field: string, fallback : string}) => {
  const { data, rowNumber } = useRowLabel<Data>()

  return (
    <div>
      {data[field] || `${fallback} ${String(rowNumber).padStart(2, '0')}`}
    </div>
  )
}