export default function P() {
  return <pre>{JSON.stringify({ u: process.env.VITE_SUPABASE_URL ?? null })}</pre>;
}
