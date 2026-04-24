// src/utils/ensureBrevoList.js
//
// Ensures a Brevo list exists for a given inschrijfformulier.
// - If form.acf.form_brevo_list_id is set, return it.
// - Otherwise: create a new list in the Gagel folder, write the ID
//   back to WordPress via the ACF REST endpoint, and return the ID.
//
// Safe to call multiple times. In-memory cache avoids repeating the
// WP write on every page rebuild within the same Next.js process.

const BREVO_API = 'https://api.brevo.com/v3';

// Module-level cache of form IDs we've already ensured this runtime.
const ensuredCache = new Set();

export default async function ensureBrevoList(form) {
  if (!form || !form.id) {
    throw new Error('ensureBrevoList: form with id is required');
  }

  // Fast path: the form already has a list ID in WP.
  const existingId = toNumberOrNull(form?.acf?.form_brevo_list_id);
  if (existingId) {
    ensuredCache.add(form.id);
    return existingId;
  }

  // Short-circuit: we already ensured this form earlier in this process.
  if (ensuredCache.has(form.id)) {
    // Re-read from WP in case someone cleared the field, but only once.
    const refreshed = await fetchFormFromWP(form.id);
    const refreshedId = toNumberOrNull(refreshed?.acf?.form_brevo_list_id);
    if (refreshedId) return refreshedId;
  }

  // Create the list in Brevo.
  const listId = await createBrevoList(form.title?.rendered || `Formulier ${form.id}`);

  // Write the ID back to WP so future page loads skip this work.
  await writeListIdToWP(form.id, listId);

  ensuredCache.add(form.id);
  return listId;
}

// ----- helpers -----

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function createBrevoList(name) {
  const folderId = Number(process.env.BREVO_FOLDER_ID);
  if (!folderId) {
    throw new Error('BREVO_FOLDER_ID env var is not set');
  }

  const res = await fetch(`${BREVO_API}/contacts/lists`, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({ name, folderId }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo list creation failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.id;
}

async function fetchFormFromWP(formId) {
  const base = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL;
  const res = await fetch(`${base}/wp-json/wp/v2/inschrijfformulier/${formId}`);
  if (!res.ok) return null;
  return res.json();
}

async function writeListIdToWP(formId, listId) {
  const base = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL;
  const auth = Buffer.from(
    `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
  ).toString('base64');

  const res = await fetch(
    `${base}/wp-json/acf/v3/inschrijfformulier/${formId}`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({ fields: { form_brevo_list_id: listId } }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WP write failed (${res.status}): ${body}`);
  }
}