-- Enable pgcrypto extension for PostgreSQL
-- Run this manually if drizzle push fails with gen_random_bytes error
CREATE EXTENSION IF NOT EXISTS pgcrypto;
