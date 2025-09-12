export default function PrivacyPage() {
  return (
    <div className="prose prose-invert max-w-3xl">
      <h1>Privacy</h1>
      <p>
        Moonlight Reader is privacy-first. We store voices, not texts.
      </p>

      <h2>What we store</h2>
      <ul>
        <li>Anonymous session cookie (signed, HttpOnly).</li>
        <li>Voice metadata (provider, provider_voice_id, optional display name).</li>
        <li>TTL-bound audio outputs for temporary download.</li>
      </ul>

      <h2>What we do not store</h2>
      <ul>
        <li>No input text in our database, storage, or logs.</li>
        <li>No source upload files after a provider voice is created.</li>
      </ul>

      <h2>Text handling</h2>
      <p>
        Your text is processed in-memory only to synthesize audio. Logs redact text and only keep counts and timings.
      </p>

      <h2>Uploads and outputs</h2>
      <p>
        Uploads are stored in an <code>uploads/</code> bucket with 1–24h TTL and deleted after voice creation. Outputs are delivered via pre-signed URLs with short expiries and auto-purged lifecycle rules.
      </p>

      <h2>Consent and revocation</h2>
      <p>
        Creating a voice requires explicit consent. You can revoke a voice at any time, which disables further TTS and revokes it with the provider.
      </p>
    </div>
  );
} 