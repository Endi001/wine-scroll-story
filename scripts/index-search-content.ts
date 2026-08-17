/**
 * Builds vector embeddings for every record in src/lib/search-index.ts using the
 * same on-device model the browser uses (Xenova/all-MiniLM-L6-v2, 384 dims) and
 * prints SQL upserts for public.search_documents.
 *
 * Run:  bun scripts/index-search-content.ts > /tmp/search-index.sql
 */
import { pipeline } from "@huggingface/transformers";
import { SEARCH_RECORDS } from "../src/lib/search-index";

const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

const texts = SEARCH_RECORDS.map(
  (r) => `${r.section}. ${r.title}. ${r.description} ${r.content}`,
);
const out = await extractor(texts, { pooling: "mean", normalize: true });
const vectors: number[][] = out.tolist();

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;

const rows = SEARCH_RECORDS.map((r, i) =>
  `(${q(r.id)}, ${q(r.section)}, ${q(r.title)}, ${q(r.description)}, ${q(r.content)}, ${q(r.href)}, ${q(
    `[${vectors[i].map((n) => n.toFixed(6)).join(",")}]`,
  )})`,
);

console.log(
  `INSERT INTO public.search_documents (doc_key, section, title, description, content, href, embedding) VALUES\n${rows.join(
    ",\n",
  )}\nON CONFLICT (doc_key) DO UPDATE SET section = EXCLUDED.section, title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content, href = EXCLUDED.href, embedding = EXCLUDED.embedding;`,
);
