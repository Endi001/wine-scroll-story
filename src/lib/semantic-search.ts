"use client";

import { supabase } from "@/lib/supabase";
import { EMBEDDING_MODEL } from "@/lib/search-index";

export type SemanticResult = {
  doc_key: string;
  section: string;
  title: string;
  description: string;
  content: string;
  href: string;
  similarity: number;
};

type Extractor = (
  text: string | string[],
  options: { pooling: "mean"; normalize: boolean },
) => Promise<{ tolist: () => number[][] }>;

let extractorPromise: Promise<Extractor> | null = null;

/**
 * Loads the embedding model in the browser (cached by the browser after the
 * first visit). Kept lazy so the FAQ page paints instantly.
 */
export function loadEmbedder(): Promise<Extractor> {
  if (!extractorPromise) {
    extractorPromise = import("@huggingface/transformers").then(
      async ({ pipeline, env }) => {
        env.allowLocalModels = false;
        const pipe = await pipeline("feature-extraction", EMBEDDING_MODEL, {
          dtype: "q8",
        });
        return pipe as unknown as Extractor;
      },
    );
  }
  return extractorPromise;
}

export async function embedQuery(query: string): Promise<number[]> {
  const extractor = await loadEmbedder();
  const out = await extractor(query, { pooling: "mean", normalize: true });
  return out.tolist()[0];
}

/** Embeds the query locally, then ranks stored content by cosine distance. */
export async function semanticSearch(
  query: string,
  matchCount = 6,
): Promise<SemanticResult[]> {
  const embedding = await embedQuery(query.trim());

  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: JSON.stringify(embedding),
    match_count: matchCount,
  } as never);

  if (error) throw error;
  return (data as unknown as SemanticResult[]) ?? [];
}
