import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap, BarChart3, TrendingDown } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 selection:bg-green-500/30 selection:text-green-200">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-2 group-hover:scale-110 transition-transform shadow-lg shadow-green-900/20">
            <TrendingDown className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">SpendSmart<span className="text-green-500">AI</span></span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-slate-400 hover:text-green-400 transition-colors" href="/audit">
            Run Audit
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden w-full py-24 md:py-32 lg:py-48 bg-slate-950">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container relative px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1 text-xs font-medium text-green-400 mb-4 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                <span className="mr-1">✨</span> New: Multi-tool optimization engine
              </div>
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                  Stop overpaying for <span className="text-green-500">AI tools</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl lg:text-2xl leading-relaxed">
                  Get a free, instant audit of your team's AI spend and discover hidden savings in minutes.
                </p>
              </div>
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-500 text-white font-bold px-10 py-7 text-xl rounded-full transition-all hover:scale-105 shadow-xl shadow-green-900/30">
                  <Link href="/audit">Audit My AI Spend →</Link>
                </Button>
                <p className="mt-4 text-sm text-slate-500">No login required. Takes 2 minutes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Explainer Section */}
        <section className="w-full py-24 bg-slate-900/50 border-y border-slate-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
              <div className="flex flex-col items-center space-y-6 text-center p-6 rounded-3xl bg-slate-800/20 border border-slate-700/50 transition-all hover:border-green-500/20 hover:bg-slate-800/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
                  <Zap className="h-8 w-8 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Input your tools</h3>
                  <p className="text-slate-400">Quickly list the AI subscriptions your team currently pays for.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-6 text-center p-6 rounded-3xl bg-slate-800/20 border border-slate-700/50 transition-all hover:border-green-500/20 hover:bg-slate-800/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Get instant audit</h3>
                  <p className="text-slate-400">Our engine compares your spend against optimal plans and list prices.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-6 text-center p-6 rounded-3xl bg-slate-800/20 border border-slate-700/50 transition-all hover:border-green-500/20 hover:bg-slate-800/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
                  <TrendingDown className="h-8 w-8 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">See your savings</h3>
                  <p className="text-slate-400">Get a detailed breakdown of where you can cut costs without losing performance.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="w-full py-16 bg-slate-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-8">
              <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">Trusted by top teams (Mocked)</span>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale invert">
                <span className="text-2xl font-bold tracking-tighter">ACME CORP</span>
                <span className="text-2xl font-bold tracking-tighter">GLOBEX</span>
                <span className="text-2xl font-bold tracking-tighter">SOYLENT</span>
                <span className="text-2xl font-bold tracking-tighter">INITECH</span>
                <span className="text-2xl font-bold tracking-tighter">UMBRELLA</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-4 md:px-6 border-t border-slate-800/50 bg-slate-950">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8 mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link className="flex items-center justify-center group" href="/">
              <span className="font-bold text-xl tracking-tight">SpendSmart<span className="text-green-500">AI</span></span>
            </Link>
            <p className="text-sm text-slate-500">
              © 2026 SpendSmart AI. Optimized AI procurement for modern startups.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-slate-400">
              Built for <span className="text-slate-200 font-semibold">Credex</span> · <a href="https://credex.rocks" className="text-green-500 hover:text-green-400 transition-colors underline underline-offset-4 decoration-green-500/30">credex.rocks</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
