/**
 * Builds vector embeddings for every record in src/lib/search-index.ts with the
 * same on-device model the browser uses (Xenova/all-MiniLM-L6-v2, 384 dims) and
 * upserts them into public.search_documents.
 *
 * Run:  bun scripts/index-search-content.ts
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.
 */
import { pipeline } from "@huggingface/transformers";
import { SEARCH_RECORDS, EMBEDDING_MODEL, embeddingText } from "../src/lib/search-index";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) throw new Error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");

const extractor = await pipeline("feature-extraction", EMBEDDING_MODEL);
const out = await extractor(SEARCH_RECORDS.map(embeddingText), {
  pooling: "mean",
  normalize: true,
});
const vectors: number[][] = out.tolist();

const rows = SEARCH_RECORDS.map((r, i) => ({
  doc_key: r.id,
  section: r.section,
  title: r.title,
  description: r.description,
  content: r.content,
  href: r.href,
  embedding: JSON.stringify(vectors[i]),
}));

const res = await fetch(`${url}/rest/v1/search_documents?on_conflict=doc_key`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  },
  body: JSON.stringify(rows),
});

if (!res.ok) throw new Error(`Upsert failed ${res.status}: ${await res.text()}`);
console.log(`Indexed ${rows.length} documents.`);
