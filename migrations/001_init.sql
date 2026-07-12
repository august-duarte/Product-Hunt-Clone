-- Initial schema for Product Hunt Clone
-- Apply against an empty PostgreSQL database (Neon SQL editor or psql).

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  avatar_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  tagline VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  logo_url TEXT,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_user_id_idx ON products (user_id);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products (created_at DESC);

CREATE TABLE IF NOT EXISTS upvotes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS upvotes_product_id_idx ON upvotes (product_id);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comments_product_id_idx ON comments (product_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments (created_at ASC);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_tags (
  product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE INDEX IF NOT EXISTS product_tags_tag_id_idx ON product_tags (tag_id);

CREATE TABLE IF NOT EXISTS blacklisted_jwts (
  id SERIAL PRIMARY KEY,
  jwt TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
