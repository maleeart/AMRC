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
  await sql`ALTER TABLE votes ADD COLUMN IF NOT EXISTS size VARCHAR(10)`;
}

export async function insertVote(name: string, memberId: string, color: string, size: string) {
  return sql`
    INSERT INTO votes (name, member_id, color, size)
    VALUES (${name}, ${memberId}, ${color}, ${size})
    ON CONFLICT (member_id) DO UPDATE SET name = ${name}, color = ${color}, size = ${size}, created_at = NOW()
  `;
}

export async function getResults() {
  const votes = await sql`SELECT name, member_id, color, size, created_at FROM votes ORDER BY created_at DESC`;
  const summary = await sql`SELECT color, COUNT(*) as count FROM votes GROUP BY color`;
  return { votes, summary };
}

export async function initRallyDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS rally (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      member_id VARCHAR(100) NOT NULL UNIQUE,
      phone VARCHAR(30) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function insertRally(name: string, memberId: string, phone: string) {
  return sql`
    INSERT INTO rally (name, member_id, phone)
    VALUES (${name}, ${memberId}, ${phone})
    ON CONFLICT (member_id) DO UPDATE SET name = ${name}, phone = ${phone}, created_at = NOW()
  `;
}

export async function getRally() {
  return sql`SELECT name, member_id, phone, created_at FROM rally ORDER BY created_at DESC`;
}

export async function deleteVote(memberId: string) {
  return sql`DELETE FROM votes WHERE member_id = ${memberId}`;
}

export async function deleteRally(memberId: string) {
  return sql`DELETE FROM rally WHERE member_id = ${memberId}`;
}

export async function getRallyCount() {
  const result = await sql`SELECT COUNT(*) as count FROM rally`;
  return parseInt((result[0] as { count: string }).count);
}

export async function isRallyMember(memberId: string) {
  const result = await sql`SELECT 1 FROM rally WHERE member_id = ${memberId} LIMIT 1`;
  return result.length > 0;
}
