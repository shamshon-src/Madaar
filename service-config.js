// Public settings only. Secrets belong in server/.env, never in this file.
// Explicitly enabled practice content for English; Arabic keeps the supplied service.
window.MadaarServiceConfig = { mode: "remote", provider: "supplied-curated-package", apiBaseUrl: "http://127.0.0.1:8001/api/ai", timeoutMs: 10000, englishPractice: true };
