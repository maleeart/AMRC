import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      member_id VARCHAR(100) NOT NULL UNIQUE,
      color VARCHAR(10) NOT NULL CHECK (color IN ('white', 'black')),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function insertVote(name: string, memberId: string, color: string) {
  return sql`
    INSERT INTO votes (name, member_id, color)
    VALUES (${name}, ${memberId}, ${color})
    ON CONFLICT (member_id) DO UPDATE SET name = ${name}, color = ${color}, created_at = NOW()
  `;
}

export async function getResults() {
  const votes = await sql`SELECT name, member_id, color, created_at FROM votes ORDER BY created_at DESC`;
  const summary = await sql`SELECT color, COUNT(*) as count FROM votes GROUP BY color`;
  return { votes, summary };
}
