// Shared types for ScreenWise AI fitment screening

export type Recommendation = 'Strong Fit' | 'Possible Fit' | 'Pass'
export type ExperienceRelevance = 'Direct' | 'Adjacent' | 'Stretch'
export type SeniorityAlignment = 'Match' | 'Junior' | 'Senior'

export interface CandidateEvaluation {
  candidateName: string
  candidateId: string
  fitmentScore: number // 0 - 100
  recommendation: Recommendation
  skillsMatched: string[]
  skillsMissing: string[]
  experienceRelevance: ExperienceRelevance
  seniorityAlignment: SeniorityAlignment
  yearsOfExperience: number
  keyStrengths: string[]
  redFlags: string[]
  oneLineSummary: string
  outreachEmail: {
    subject: string
    body: string
  }
}

export interface ScreeningRequest {
  jobDescription: string
  resumes: string[] // each entry is one resume text block
}

export interface ScreeningResponse {
  success: boolean
  jobSummary: string
  evaluations: CandidateEvaluation[]
  error?: string
  durationMs?: number
}
