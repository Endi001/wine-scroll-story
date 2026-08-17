create or replace function public.match_documents(
  query_embedding vector(1536),
  match_count int default 8
)
returns table (
  doc_key text,
  section text,
  title text,
  description text,
  content text,
  href text,
  similarity float
)
language sql
stable
security invoker
set search_path = public
as $$
  select d.doc_key, d.section, d.title, d.description, d.content, d.href,
         1 - (d.embedding <=> query_embedding) as similarity
  from public.search_documents d
  order by d.embedding <=> query_embedding
  limit match_count;
$$;