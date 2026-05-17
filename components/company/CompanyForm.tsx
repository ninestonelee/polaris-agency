'use client'

import { useState } from 'react'
import { IndustryPicker } from './IndustryPicker'
import { INDUSTRY_TEMPLATES } from '@/lib/seeds/industries'
import type { IndustryKey } from '@/lib/supabase/types'
import { MSG } from '@/lib/i18n/messages'

export interface CompanyFormValue {
  name: string
  industry: IndustryKey | null
  mission: string
  tone: string
}

interface Props {
  initial?: Partial<CompanyFormValue>
  onSubmit: (value: CompanyFormValue) => Promise<void> | void
  submitting?: boolean
  submitLabel?: string
}

export function CompanyForm({ initial, onSubmit, submitting, submitLabel }: Props) {
  const [value, setValue] = useState<CompanyFormValue>({
    name: initial?.name ?? '',
    industry: (initial?.industry as IndustryKey) ?? null,
    mission: initial?.mission ?? '',
    tone: initial?.tone ?? '',
  })
  const [err, setErr] = useState<string | null>(null)

  const pickIndustry = (key: IndustryKey) => {
    const tpl = key !== 'other' ? INDUSTRY_TEMPLATES[key] : null
    setValue((v) => ({
      ...v,
      industry: key,
      mission: v.mission || tpl?.mission || '',
      tone: v.tone || tpl?.tone || '',
    }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (!value.name.trim()) return setErr(MSG.company.nameRequired)
    if (!value.industry) return setErr(MSG.company.industryRequired)
    await onSubmit(value)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">업종</label>
        <IndustryPicker value={value.industry} onChange={pickIndustry} />
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">회사 이름</label>
          <input
            type="text"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
            placeholder={MSG.company.namePlaceholder}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">미션 (한 줄)</label>
          <input
            type="text"
            value={value.mission}
            onChange={(e) => setValue({ ...value, mission: e.target.value })}
            placeholder={MSG.company.missionPlaceholder}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">톤앤매너</label>
          <input
            type="text"
            value={value.tone}
            onChange={(e) => setValue({ ...value, tone: e.target.value })}
            placeholder={MSG.company.tonePlaceholder}
            className="input"
          />
        </div>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
        {submitting ? MSG.common.loading : (submitLabel ?? MSG.company.create)}
      </button>
    </form>
  )
}
