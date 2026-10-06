create extension if not exists vector;
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text not null,
  url text,
  language text not null default 'ar',
  review_status text not null default 'pending' check (review_status in ('pending','approved','rejected')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  domain text,
  topic text,
  language text not null default 'ar',
  page_number integer,
  reference_location text,
  content text not null,
  embedding vector(1536),
  review_status text not null default 'pending' check (review_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create index if not exists chunks_meta_idx on chunks(domain,topic,language,review_status);
create index if not exists chunks_embedding_hnsw on chunks using hnsw (embedding vector_cosine_ops);
-- Production retrieval MUST filter review_status='approved'.
