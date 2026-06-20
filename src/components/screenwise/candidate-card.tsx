'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  Copy,
  Mail,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { CandidateEvaluation } from '@/lib/types'

interface Props {
  evaluation: CandidateEvaluation
  rank: number
}

function scoreColor(score: number) {
  if (score >= 80) return { ring: 'ring-emerald-500/40', bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' }
  if (score >= 60) return { ring: 'ring-amber-500/40', bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' }
  return { ring: 'ring-slate-300/60', bg: 'bg-slate-50', text: 'text-slate-600', bar: 'bg-slate-400' }
}

function recStyle(rec: CandidateEvaluation['recommendation']) {
  switch (rec) {
    case 'Strong Fit':
      return 'bg-emerald-600 text-white'
    case 'Possible Fit':
      return 'bg-amber-500 text-white'
    default:
      return 'bg-slate-400 text-white'
  }
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'C'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function CandidateCard({ evaluation, rank }: Props) {
  const [copied, setCopied] = useState(false)
  const [shortlisted, setShortlisted] = useState<null | boolean>(null)
  const sc = useMemo(() => scoreColor(evaluation.fitmentScore), [evaluation.fitmentScore])

  async function copyEmail() {
    const txt = `Subject: ${evaluation.outreachEmail.subject}\n\n${evaluation.outreachEmail.body}`
    try {
      await navigator.clipboard.writeText(txt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // ignore
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(rank * 0.06, 0.4) }}
    >
      <Card className={cn('overflow-hidden border-l-4 ring-1', sc.ring)}>
        <div className={cn('h-1 w-full', sc.bar)} aria-hidden />
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                sc.bg,
                sc.text
              )}
              aria-hidden
            >
              {initials(evaluation.candidateName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold text-slate-900">
                  {evaluation.candidateName}
                </h3>
                <span className="text-xs font-medium text-slate-400">#{rank + 1}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {evaluation.yearsOfExperience} yrs ·{' '}
                <span className="capitalize">
                  {evaluation.experienceRelevance.toLowerCase()} relevance
                </span>{' '}
                ·{' '}
                <span className="capitalize">
                  {evaluation.seniorityAlignment.toLowerCase() === 'match'
                    ? 'seniority match'
                    : evaluation.seniorityAlignment.toLowerCase()}
                </span>
              </p>
              <p className="mt-2 text-sm text-slate-700">
                “{evaluation.oneLineSummary}”
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <div className={cn('flex items-baseline gap-1 rounded-lg px-2.5 py-1', sc.bg)}>
                <span className={cn('text-2xl font-bold tabular-nums', sc.text)}>
                  {evaluation.fitmentScore}
                </span>
                <span className={cn('text-xs font-medium', sc.text)}>/100</span>
              </div>
              <Badge
                className={cn(
                  'rounded-full text-[11px] font-medium',
                  recStyle(evaluation.recommendation)
                )}
              >
                {evaluation.recommendation}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">Skills gap</TabsTrigger>
              <TabsTrigger value="outreach" className="text-xs">Outreach email</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  Key strengths
                </p>
                {evaluation.keyStrengths.length === 0 ? (
                  <p className="text-sm text-slate-400">No notable strengths extracted.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {evaluation.keyStrengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-700">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {evaluation.redFlags.length > 0 && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Red flags
                  </p>
                  <ul className="space-y-1.5">
                    {evaluation.redFlags.map((r, i) => (
                      <li key={i} className="flex gap-2 text-sm text-rose-700">
                        <span aria-hidden>•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.redFlags.length === 0 && (
                <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  No structural red flags detected.
                </div>
              )}
            </TabsContent>

            <TabsContent value="skills" className="mt-4 space-y-3">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Matched skills
                </p>
                {evaluation.skillsMatched.length === 0 ? (
                  <p className="text-sm text-slate-400">None detected.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.skillsMatched.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="border border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Missing / gaps
                </p>
                {evaluation.skillsMissing.length === 0 ? (
                  <p className="text-sm text-slate-400">No major gaps vs the JD.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.skillsMissing.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="border border-amber-200 bg-amber-50 text-amber-700"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="outreach" className="mt-4 space-y-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Subject</p>
                <p className="mt-0.5 text-sm font-medium text-slate-800">
                  {evaluation.outreachEmail.subject}
                </p>
              </div>
              <ScrollArea className="max-h-64 rounded-md border border-slate-200 bg-white p-3">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
                  {evaluation.outreachEmail.body}
                </pre>
              </ScrollArea>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Mail className="h-3 w-3" />
                  Personalized — references this candidate's resume
                </p>
                <Button size="sm" variant="outline" onClick={copyEmail} className="h-8">
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Copy email
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <Button
              size="sm"
              variant="ghost"
              className={cn('h-8 text-xs', shortlisted === false && 'text-rose-600')}
              onClick={() => setShortlisted(false)}
            >
              {shortlisted === false ? (
                <X className="mr-1.5 h-3.5 w-3.5" />
              ) : (
                <ThumbsDown className="mr-1.5 h-3.5 w-3.5" />
              )}
              Pass
            </Button>
            <Button
              size="sm"
              variant={shortlisted === true ? 'default' : 'outline'}
              className={cn(
                'h-8 text-xs',
                shortlisted === true
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : ''
              )}
              onClick={() => setShortlisted(true)}
            >
              {shortlisted === true ? (
                <Check className="mr-1.5 h-3.5 w-3.5" />
              ) : (
                <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
              )}
              {shortlisted === true ? 'Shortlisted' : 'Shortlist'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
