export default function PrivacyPolicyPage() {
  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem', maxWidth: '72rem' }}>
      <h1 style={{ marginBottom: '3.2rem' }}>Privacy Policy</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.85 }}>
        <p>
          This website collects only the information you voluntarily provide through the contact form (name, email, and message). This information is used solely to respond to your enquiry and is not shared with third parties.
        </p>
        <p>
          We do not use cookies for tracking or advertising. Basic analytics may be collected by the hosting provider (Vercel) for performance monitoring.
        </p>
        <p>
          If you have questions about how your data is handled, please contact us via the contact form.
        </p>
      </div>
    </div>
  )
}
