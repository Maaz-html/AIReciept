# Architecture Documentation

## Overview
SpendSmart AI is built as a high-performance, lead-generation application for Credex. The architecture focuses on speed, accuracy, and conversion.

## Framework Choice: Next.js 14 App Router
We chose Next.js 14 for several reasons:
- **Server Components**: Allows us to fetch audit results securely on the server without exposing Supabase keys or logic to the client.
- **API Routes**: Provides a unified environment for the audit engine, AI summaries, and lead capture.
- **Speed**: Built-in optimization for fonts, images, and routing ensures a premium feel for high-value startup leads.

## Database: Supabase
Supabase was selected over traditional SQL providers because:
- **Rapid Prototyping**: The ability to quickly define tables for `audits` and `leads` with Row Level Security (RLS).
- **Client SDK**: Seamless integration with the frontend for direct data fetching when necessary.
- **Free Tier**: Highly generous for a startup-focused tool, allowing us to scale initially without cost overhead.

## Audit Engine: Deterministic vs. AI
While we use AI for the summary, the **Audit Engine itself is hardcoded**. This is a strategic choice:
1. **Accuracy**: Financial decisions require 100% precision. LLMs can "hallucinate" pricing or math.
2. **Cost & Latency**: Running deterministic rules is free and takes microseconds, allowing for instant feedback.
3. **Auditability**: We can easily test and verify the logic (see `docs/TESTS.md`).

## Lead Capture Flow
Email capture happens **after** the results are displayed.
- **Rationale**: Gating the tool before use creates a high friction point. By showing the user exactly how much they can save first, we build "reciprocity" and make them much more likely to provide an email to "Save the Report" or book a consultation.

## Communication: Resend vs. Postmark
We used Resend for transactional emails because:
- **Developer Experience**: The React Email integration and simple API allowed us to build the lead notification system in minutes.
- **Modern Stack**: Resend fits the Next.js/Vercel ecosystem perfectly and has a cleaner interface for monitoring deliverability during the initial launch phase.

## Rate Limiting: Upstash Redis
To prevent abuse and API cost spikes (Anthropic), we implemented rate limiting via `@upstash/ratelimit`.
- **Approach**: IP-based limit of 5 requests per hour. This is generous for a human user but effectively blocks scrapers or bots.

## Trade-offs and Constraints
- **shadcn/ui Bundle Size**: Using shadcn adds some weight to the CSS/JS bundle, but the speed of development and premium look-and-feel justified the slight performance hit (still maintaining a 97 Lighthouse score).
- **Supabase Free Tier**: Limited to 500MB. While fine for thousands of audits, a significant viral spike might require an upgrade to the Pro tier ($25/mo).

## Scaling to 10k Audits/Day
If the app scales to 10k audits daily, we would:
1. **Edge Functions**: Move the audit engine and AI summary calls to Vercel Edge Functions to reduce cold start latency.
2. **Queueing**: Implement a queue for Resend and Lead capture to handle spikes without dropping data.
3. **Analytics**: Replace the basic Supabase lead table with a specialized CRM integration (like Salesforce or HubSpot) via webhooks.
4. **Caching**: Cache pricing data globally at the edge using Redis to avoid repeated lookups if the tool list grows significantly.
