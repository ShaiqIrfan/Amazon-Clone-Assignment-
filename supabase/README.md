# Supabase setup for NexCart

1. Create a new Supabase project.
2. Open SQL Editor and run the contents of `schema.sql`.
3. Add the required environment variables to `.env.local` using the values from your Supabase project settings.
4. Run the seed script to migrate the existing product catalog into the database:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-products.ts
   ```

5. Confirm the `products` table contains the current catalog entries.
