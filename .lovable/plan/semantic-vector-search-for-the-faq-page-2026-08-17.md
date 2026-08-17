# Semantic (vector) search for the FAQ page

Replace the keyword-only Fuse.js search with meaning-based search: every piece of site
content becomes a vector embedding stored in the database, and a query is matched by
cosine distance so "tourists" finds the estate-visit answer even with no shared words.

## How it will work

```text
  user types  ->  edge function  ->  embed query (Lovable AI)
                                  -> match_documents() cosine search in pgvector
                                  -> ranked results back to the FAQ page
```

- Typing still feels instant: the query is debounced (~250 ms) and while the vector
  result is in flight the existing Fuse.js keyword results stay on screen, then get
  replaced by the semantic ranking. If the backend ever fails, Fuse stays as fallback,
  so search never breaks.
- Each result shows the section, title, snippet and a relevance score, ordered by
  semantic similarity rather than keyword overlap.
- Keyword highlighting is kept where the query words literally appear; results that match
  only by meaning show a plain snippet (no false highlights).

## Backend pieces

1. Migration: enable `pgvector`, create `public.search_documents`
   (id, doc_key unique, section, title, description, content, href, embedding vector(1536),
   created_at), plus GRANT `SELECT` to `anon`/`authenticated`, RLS on with a public
   read-only SELECT policy, an HNSW cosine index, and a `match_documents(query_embedding,
   match_count)` SQL function.
2. Two edge functions (the site is a static export, so there is no app server; the browser
   calls these directly):
   - `index-content` — embeds every record from the existing `src/lib/search-index.ts`
     content set and upserts rows. Run once after deploy, and again whenever copy changes.
   - `semantic-search` — embeds the incoming query and returns the top matches via
     `match_documents`.
   Both use Lovable AI (`openai/text-embedding-3-small`, 1536 dims) with the existing
   `LOVABLE_API_KEY` — no new key needed from you.

## Frontend pieces

- `src/lib/semantic-search.ts` — thin client calling the `semantic-search` function.
- `src/components/site/SiteSearch.tsx` — debounced query, semantic results with score-based
  ranking, Fuse fallback, unchanged burgundy/gold styling and fade-up animation.

## Notes

- Content stays authored in `src/lib/search-index.ts`; the indexer reads from there, so
  there is one source of truth.
- Nothing is needed from you — I'll run the indexing step and verify the search end to end
  with a few semantic probes ("tourists", "cheap", "who grows it").
