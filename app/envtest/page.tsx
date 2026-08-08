export default function P() {
  return <pre>{JSON.stringify({ u: import.meta.env.VITE_SUPABASE_URL ?? null })}</pre>;
}
