drop function if exists public.match_documents(vector, int);
drop table if exists public.search_documents;

create table public.search_documents (
  id uuid primary key default gen_random_uuid(),
  doc_key text not null unique,
  section text not null,
  title text not null,
  description text not null default '',
  content text not null,
  href text not null,
  embedding vector(384) not null,
  created_at timestamptz not null default now()
);

grant select on public.search_documents to anon;
grant select on public.search_documents to authenticated;
grant all on public.search_documents to service_role;

alter table public.search_documents enable row level security;

create policy "Search documents are publicly readable"
on public.search_documents
for select
to anon, authenticated
using (true);

create index search_documents_embedding_idx
  on public.search_documents using hnsw (embedding vector_cosine_ops);

create or replace function public.match_documents(
  query_embedding vector(384),
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