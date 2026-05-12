import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import ResultsClient from './ResultsClient'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

interface Props {
  params: Promise<{ id: string }>
}

async function getAudit(id: string) {
  const { data, error } = await supabaseAdmin
    .from('audits')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const audit = await getAudit(id)

  if (!audit) {
    return {
      title: 'Audit Not Found | SpendSmart AI',
    }
  }

  const results = audit.results
  const totalMonthlySavings = results.totalMonthlySavings
  const toolCount = results.toolResults.length
  
  const title = `I could save $${totalMonthlySavings.toLocaleString()}/month on AI tools`
  const description = "Free AI spend audit — see how much your team is overpaying on Cursor, Claude, ChatGPT and more."
  const headersList = await headers()
  const host = headersList.get('host')
  const proto = headersList.get('x-forwarded-proto') || 'http'
  const origin = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`
  
  const ogImageUrl = `${origin}/api/og?savings=${totalMonthlySavings}&tools=${toolCount}&tier=${results.savingsTier}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `SpendSmart AI Audit - Save $${totalMonthlySavings}/mo`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function ResultsPage({ params }: Props) {
  const { id } = await params
  const audit = await getAudit(id)

  if (!audit) {
    notFound()
  }

  return <ResultsClient id={id} initialAudit={audit} />
}
