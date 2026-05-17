'use client'

import { INDUSTRY_TEMPLATES, INDUSTRY_KEYS } from '@/lib/seeds/industries'
import type { IndustryKey } from '@/lib/supabase/types'

interface Props {
  value: IndustryKey | null
  onChange: (key: IndustryKey) => void
}

export function IndustryPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {INDUSTRY_KEYS.map((key) => {
        const tpl = INDUSTRY_TEMPLATES[key]
        const selected = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`card text-left transition-all ${
              selected ? 'ring-2 ring-polaris-500 bg-polaris-50' : ''
            }`}
          >
            <div className="text-3xl mb-2">{tpl.icon}</div>
            <div className="font-semibold">{tpl.label}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{tpl.mission}</div>
          </button>
        )
      })}
    </div>
  )
}
