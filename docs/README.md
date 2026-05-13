# SpendSmart AI — AI Spend Audit for Startups

## What it is
SpendSmart AI is a specialized financial auditing tool designed for startups to optimize their AI software expenditure. It analyzes current subscriptions across major AI tools like Cursor, Claude, and OpenAI, identifying redundant seats, plan mismatch, and consolidation opportunities to save teams thousands of dollars annually.

## Screenshots
See Loom walkthrough: [URL]

## Quick Start
### Prerequisites
- Node.js 20+
- Supabase account (for audit and lead persistence)
- Anthropic API key (for AI summary generation)
- Resend API key (for email notifications)
- Upstash Redis account (for rate limiting)

### Install & Run Locally
```bash
# Clone the repository
git clone https://github.com/Maaz-html/AIReciept
cd spend-smart-ai

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Environment Variables
Create a `.env.local` file in the root directory and add the following:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_key

# Resend
RESEND_API_KEY=your_resend_key

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### Deploy to Vercel
1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add the environment variables listed above in the Vercel dashboard.
4. Deploy.

## Key Decisions
- **Next.js 14 App Router**: Selected for its robust server-side rendering capabilities and seamless API route integration, which are critical for SEO-friendly results pages and secure backend processing.
- **Hardcoded Audit Logic**: The core savings engine uses deterministic rules based on verified pricing data instead of LLM calls to ensure 100% accuracy and lower latency for the primary value proposition.
- **Late-Stage Email Capture**: Emails are requested only *after* the value is delivered (the audit results), significantly increasing the completion-to-lead conversion rate compared to a pre-form gate.
- **Dynamic OG Image Generation**: Implemented using `@vercel/og` to allow users to share their specific savings figure on social media, creating a viral "bragging" loop for the product.
