export type IndustryKey = 'shopping' | 'cafe' | 'academy' | 'clinic' | 'manufacturing' | 'other'

export type AgentRoleKey =
  | 'ceo' | 'marketer' | 'writer' | 'editor'
  | 'designer' | 'sales' | 'support' | 'analyst'

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  onboarded_at: string | null
  openai_key: string | null
  anthropic_key: string | null
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  owner_id: string
  name: string
  industry: IndustryKey
  mission: string | null
  tone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  company_id: string
  role: AgentRoleKey
  name: string
  recommended_model: string
  is_hired: boolean
  hired_at: string | null
  created_at: string
}

export interface Task {
  id: string
  agent_id: string
  user_id: string
  prompt: string
  response: string | null
  status: 'pending' | 'streaming' | 'completed' | 'failed'
  model: string
  error_message: string | null
  created_at: string
  completed_at: string | null
}

export interface UsageLog {
  id: string
  user_id: string
  task_id: string
  model: string
  input_tokens: number
  output_tokens: number
  cost_usd: number
  cost_krw: number
  created_at: string
}
