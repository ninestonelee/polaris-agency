import { notFound } from 'next/navigation'
import { ProgressBar } from '@/components/onboarding/ProgressBar'
import { Step1Welcome } from '@/components/onboarding/Step1Welcome'
import { Step2Industry } from '@/components/onboarding/Step2Industry'
import { Step3Company } from '@/components/onboarding/Step3Company'
import { Step4ApiKey } from '@/components/onboarding/Step4ApiKey'
import { Step5Agent } from '@/components/onboarding/Step5Agent'
import { Step6Demo } from '@/components/onboarding/Step6Demo'
import { Step7Done } from '@/components/onboarding/Step7Done'

const STEPS = [Step1Welcome, Step2Industry, Step3Company, Step4ApiKey, Step5Agent, Step6Demo, Step7Done]

export default async function OnboardingStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params
  const n = parseInt(step, 10)
  if (!Number.isInteger(n) || n < 1 || n > 7) return notFound()
  const StepComponent = STEPS[n - 1]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <ProgressBar step={n} total={7} />
      <StepComponent />
    </div>
  )
}
