export const sendSupportRequest = async (payload) => {
  const baseUrl = (import.meta.env.VITE_SUPPORT_API_BASE || '').replace(/\/$/, '');

  // In production on Firebase Hosting, use Cloud Function rewrite path.
  // In local dev without explicit API base, use local Node backend route.
  const endpoint = baseUrl
    ? `${baseUrl}/api/support/contact`
    : import.meta.env.DEV
      ? '/api/support/contact'
      : '/cf/sendContactEmail';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to send your request. Please try again.');
  }

  return data;
};
