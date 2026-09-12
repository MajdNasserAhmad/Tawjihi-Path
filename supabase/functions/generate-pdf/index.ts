import { serve } from "https://deno.land/std/http/server.ts"

serve(async (req) => {
  return new Response(
    JSON.stringify({ status: "not_implemented" }),
    { headers: { "Content-Type": "application/json" } },
  )
})
