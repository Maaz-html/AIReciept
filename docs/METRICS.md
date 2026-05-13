# Metrics Framework — SpendSmart AI

## North Star Metric: Audits Completed per Week
**Why?** Unlike a social app, users won't use an auditor daily. "Audits Completed" represents the primary value delivered to a unique user and is the best indicator of Credex's brand reach and utility.

## Key Performance Indicators (KPIs)

### 1. Retention & Engagement
- **Audit Completion Rate**: `(Audit Result Views / Form Starts)`
- **Target**: >85% (Indicates form friction is low).

### 2. Conversion & Growth
- **Lead Capture Rate**: `(Emails Submitted / Audit Result Views)`
- **Target**: >30%.
- **Consultation Booking Rate**: `(Consultations Requested / High-Savings Audits)`
- **Target**: >15%.

### 3. Financial Impact (Value Metric)
- **Total Potential Savings Identified**: Cumulative `totalAnnualSavings` across all completed audits.
- **Average Savings per User**: Total Savings / Unique Audits.

## Instrumentation Plan (Events to Track)
We will use Segment or PostHog to track the following:
- `form_started`: Fired when the first tool is added or team size is changed.
- `audit_calculated`: Fired when the backend returns the audit result.
- `lead_captured`: Fired when the user submits the email form on the results page.
- `og_image_shared`: Fired when the user clicks the "Share to Twitter" button.

## The Pivot Trigger
If the **Lead Capture Rate falls below 15%** after the first 200 audits:
- **Action**: Redesign the results page to offer the "Full Report" via PDF in exchange for an email, or move the email capture to a "modal exit intent" rather than a bottom-of-page form.
