'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  Clock,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
  Wand2,
  Users,
  Zap,
  ShieldCheck,
  ListChecks,
  Mailbox,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'
import { CandidateCard } from '@/components/screenwise/candidate-card'
import { SAMPLE_JD, SAMPLE_RESUMES } from '@/lib/sample-data'
import type { CandidateEvaluation, ScreeningResponse } from '@/lib/types'

type Phase = 'idle' | 'parsing-jd' | 'reading-resumes' | 'scoring' | 'drafting' | 'done'

const PHASE_LABEL: Record<Phase, string> = {
  idle: 'Idle',
  'parsing-jd': 'Parsing the job description…',
  'reading-resumes': 'Reading every resume line-by-line…',
  scoring: 'Scoring each candidate on the rubric…',
  drafting: 'Drafting personalized outreach emails…',
  done: 'Done',
}

export default function Home() {
  const [jd, setJd] = useState('')
  const [resumes, setResumes] = useState('')
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<ScreeningResponse | null>(null)
  const [resumeCount, setResumeCount] = useState(0)

  const parsedResumeCount = useCallback((text: string) => {
    const parts = text
      .split(/\n\s*---\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
    return parts.length
  }, [])

  function onResumesChange(v: string) {
    setResumes(v)
    setResumeCount(parsedResumeCount(v))
  }

  function loadSample() {
    setJd(SAMPLE_JD)
    setResumes(SAMPLE_RESUMES)
    setResumeCount(parsedResumeCount(SAMPLE_RESUMES))
    setResult(null)
    toast.success('Sample data loaded', {
      description: 'A fintech Senior Backend Engineer JD + 5 candidates.',
    })
  }

  function clearAll() {
    setJd('')
    setResumes('')
    setResumeCount(0)
    setResult(null)
    setPhase('idle')
  }

  async function runAnalysis() {
    if (jd.trim().length < 20) {
      toast.error('Add a job description first', { description: 'At least a paragraph is needed.' })
      return
    }
    const parts = resumes
      .split(/\n\s*---\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
    if (parts.length === 0) {
      toast.error('Add at least one resume', {
        description: 'Separate multiple resumes with a line of ---.',
      })
      return
    }
    if (parts.length > 8) {
      toast.error('Prototype limit', { description: 'Max 8 candidates per batch.' })
      return
    }

    setLoading(true)
    setResult(null)

    // Simulated phased progress so the recruiter sees motion while the LLM thinks.
    const phases: Phase[] = ['parsing-jd', 'reading-resumes', 'scoring', 'drafting']
    let pi = 0
    setPhase(phases[0])
    const interval = setInterval(() => {
      pi = Math.min(pi + 1, phases.length - 1)
      setPhase(phases[pi])
    }, 4500)

    try {
      const res = await fetch('/api/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, resumes: parts }),
      })
      const data: ScreeningResponse = await res.json()
      clearInterval(interval)
      setPhase('done')

      if (!data.success || !res.ok) {
        toast.error('Screening failed', { description: data.error ?? 'Unknown error.' })
        setResult(null)
      } else {
        setResult(data)
        toast.success(`${data.evaluations.length} candidates ranked`, {
          description: `Completed in ${((data.durationMs ?? 0) / 1000).toFixed(1)}s.`,
        })
      }
    } catch (err: any) {
      clearInterval(interval)
      setPhase('idle')
      toast.error('Network error', { description: err?.message ?? 'Could not reach the API.' })
    } finally {
      setLoading(false)
    }
  }

  const strong = result?.evaluations.filter((e) => e.recommendation === 'Strong Fit').length ?? 0
  const possible = result?.evaluations.filter((e) => e.recommendation === 'Possible Fit').length ?? 0
  const pass = result?.evaluations.filter((e) => e.recommendation === 'Pass').length ?? 0

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Toaster richColors position="top-center" />

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">ScreenWise</p>
              <p className="text-[11px] leading-tight text-slate-500">AI Fitment Copilot for Recruiters</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden border-emerald-200 bg-emerald-50 text-emerald-700 sm:inline-flex">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Prototype · v0.1
            </Badge>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs font-medium text-slate-500 hover:text-slate-900 sm:inline"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl"
            >
              <Badge variant="outline" className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-700">
                Built for Embark · Product & AI Intern Assignment
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Stop reading 200 resumes.
                <br />
                <span className="text-emerald-600">Start interviewing the right 20.</span>
              </h1>
              <p className="mt-4 text-base text-slate-600 sm:text-lg">
                Paste a job description and a batch of resumes. ScreenWise ranks every candidate with an
                explainable fitment score, surfaces red flags, and drafts a personalized outreach email for
                each one — in under a minute.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard icon={<Clock className="h-4 w-4" />} label="Screening time" value="~3 min" sub="per role, not per resume" />
                <StatCard icon={<ListChecks className="h-4 w-4" />} label="Rubric" value="5 signals" sub="skills · scope · seniority · domain · trajectory" />
                <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="Bias guardrails" value="On" sub="name-blind scoring, calibrated output" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* INPUT */}
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6" id="workspace">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* JD */}
            <Card className="flex flex-col">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                      <FileText className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-semibold">1 · Job description</h2>
                  </div>
                  <span className="text-xs text-slate-400">{jd.length} chars</span>
                </div>
                <Textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the full job description here — title, must-haves, nice-to-haves, location, anything that matters."
                  className="min-h-[260px] flex-1 resize-y border-slate-200 bg-white text-sm leading-relaxed"
                />
              </CardContent>
            </Card>

            {/* Resumes */}
            <Card className="flex flex-col">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                      <Users className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-semibold">2 · Candidate resumes</h2>
                  </div>
                  <Badge variant="outline" className="border-slate-200">
                    {resumeCount} candidate{resumeCount === 1 ? '' : 's'}
                  </Badge>
                </div>
                <Textarea
                  value={resumes}
                  onChange={(e) => onResumesChange(e.target.value)}
                  placeholder={
                    'Paste one resume per block. Separate candidates with a line that is just:\n\n---\n\nAarav Mehta\nSenior Backend Engineer — Razorpay\n...\n\n---\n\nPriya Nair\n...'
                  }
                  className="min-h-[260px] flex-1 resize-y border-slate-200 bg-white font-mono text-xs leading-relaxed"
                />
                <p className="mt-2 text-[11px] text-slate-400">
                  Separate candidates with <code className="rounded bg-slate-100 px-1 py-0.5">---</code> on its own line. Max 8 per batch in this prototype.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action bar */}
          <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadSample} className="h-9">
                <Wand2 className="mr-1.5 h-4 w-4 text-emerald-600" />
                Load sample data
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 text-slate-500">
                <Trash2 className="mr-1.5 h-4 w-4" />
                Clear
              </Button>
            </div>
            <Button
              onClick={runAnalysis}
              disabled={loading}
              size="lg"
              className="h-11 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Run AI fitment analysis
                </>
              )}
            </Button>
          </div>

          {/* Loading phased progress */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 overflow-hidden"
              >
                <Card className="border-emerald-100 bg-emerald-50/50">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-emerald-800">
                          {PHASE_LABEL[phase]}
                        </p>
                        <p className="text-xs text-emerald-700/70">
                          The model is reading the JD and each resume, scoring on a 5-signal rubric, then drafting outreach.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {(['parsing-jd', 'reading-resumes', 'scoring', 'drafting'] as Phase[]).map((p, i) => {
                        const active = phase === p
                        const done = PHASE_ORDER.indexOf(phase) > i
                        return (
                          <div
                            key={p}
                            className={`rounded-md border px-3 py-2 text-xs ${
                              active
                                ? 'border-emerald-300 bg-white text-emerald-800'
                                : done
                                  ? 'border-emerald-200 bg-emerald-100/40 text-emerald-700'
                                  : 'border-slate-200 bg-white text-slate-400'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              {done && <Sparkles className="h-3 w-3" />}
                              <span className="font-medium">{i + 1}. {PHASE_LABEL_SHORT[p]}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {result && !result.success && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
              <div>
                <p className="text-sm font-semibold text-rose-800">Couldn't complete screening</p>
                <p className="text-sm text-rose-700">{result.error}</p>
              </div>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          )}

          {/* RESULTS */}
          {result && result.success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-8"
            >
              {/* Summary bar */}
              <Card className="mb-5 border-slate-200 bg-white">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Role summary
                        </p>
                        <p className="text-sm text-slate-800">{result.jobSummary}</p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Analyzed {result.evaluations.length} candidates in{' '}
                          {((result.durationMs ?? 0) / 1000).toFixed(1)}s
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Tally label="Strong" count={strong} color="text-emerald-700 bg-emerald-50" />
                      <Tally label="Possible" count={possible} color="text-amber-700 bg-amber-50" />
                      <Tally label="Pass" count={pass} color="text-slate-600 bg-slate-100" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Ranked candidates
                </h2>
                <p className="text-xs text-slate-500">Sorted by fitment score · highest first</p>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {result.evaluations.map((e: CandidateEvaluation, i: number) => (
                  <CandidateCard key={e.candidateId} evaluation={e} rank={i} />
                ))}
              </div>
            </motion.div>
          )}
        </section>

        {/* HOW IT WORKS */}
        {!result && !loading && (
          <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">How ScreenWise works</h2>
              <p className="mt-1 text-sm text-slate-600">
                A calibrated, explainable pipeline — not a black box that just says “hire” or “don't”.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StepCard
                step={1}
                icon={<FileText className="h-5 w-5" />}
                title="Paste JD + resumes"
                body="Drop in a job description and any number of candidate resumes (separated by ---). No login, no setup."
              />
              <StepCard
                step={2}
                icon={<ListChecks className="h-5 w-5" />}
                title="AI scores on a rubric"
                body="Each candidate is scored 0–100 across 5 signals: skills, experience, seniority, domain, and trajectory. Every score comes with reasons."
              />
              <StepCard
                step={3}
                icon={<Mailbox className="h-5 w-5" />}
                title="Review + outreach in one click"
                body="See matched/missing skills, red flags, and a personalized outreach email referencing the candidate's actual background. Copy and send."
              />
            </div>

            <Card className="mt-6 border-emerald-100 bg-emerald-50/40">
              <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <ChevronRight className="mt-1 h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      No data? Try the sample.
                    </p>
                    <p className="text-sm text-emerald-700">
                      Loads a real-feeling fintech Senior Backend Engineer JD + 5 candidates so you can see ScreenWise end-to-end in 30 seconds.
                    </p>
                  </div>
                </div>
                <Button onClick={loadSample} variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                  <Wand2 className="mr-1.5 h-4 w-4" />
                  Load sample data
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      {/* FOOTER (sticky to bottom) */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                <strong className="font-semibold text-slate-700">ScreenWise</strong> — prototype built for the Embark Product & AI Intern assignment.
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Scores are AI-generated and should support, not replace, human review.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const PHASE_ORDER: Phase[] = ['idle', 'parsing-jd', 'reading-resumes', 'scoring', 'drafting', 'done']
const PHASE_LABEL_SHORT: Record<Phase, string> = {
  idle: 'Idle',
  'parsing-jd': 'Parse JD',
  'reading-resumes': 'Read resumes',
  scoring: 'Score',
  drafting: 'Draft outreach',
  done: 'Done',
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-1.5 text-slate-500">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
      <p className="text-[11px] text-slate-500">{sub}</p>
    </div>
  )
}

function StepCard({ step, icon, title, body }: { step: number; icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card className="h-full border-slate-200">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
            {icon}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Step {step}
          </span>
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1.5 text-sm text-slate-600">{body}</p>
      </CardContent>
    </Card>
  )
}

function Tally({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className={`rounded-lg px-3 py-1.5 text-center ${color}`}>
      <p className="text-xl font-bold tabular-nums">{count}</p>
      <p className="text-[11px] font-medium">{label}</p>
    </div>
  )
}
