// One-off seed: pushes public/data/*.json into the Appwrite TablesDB tables.
// Safe to re-run: rows are upserted by a deterministic ID.
import fs from "node:fs";
import path from "node:path";

const ENDPOINT = "https://syd.cloud.appwrite.io/v1";
const PROJECT = "68f8d96a0021b0ae0895";
const DATABASE = "homepage";
const KEY = process.env.APPWRITE_EPHEMERAL_KEY;

if (!KEY) {
  console.error("APPWRITE_EPHEMERAL_KEY is required");
  process.exit(1);
}

const headers = {
  "X-Appwrite-Project": PROJECT,
  "X-Appwrite-Key": KEY,
  "Content-Type": "application/json",
};

const root = path.resolve(import.meta.dirname, "..");
const seed = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "seed.json"), "utf8")
);

async function upsert(table, rowId, data) {
  const url = `${ENDPOINT}/tablesdb/${DATABASE}/tables/${table}/rows/${rowId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${table}/${rowId}: ${res.status} ${text}`);
  }
}

for (const [table, rows] of Object.entries(seed)) {
  for (const [index, row] of rows.entries()) {
    await upsert(table, `${table}-${index + 1}`, row);
  }
  console.log(`${table}: ${rows.length} rows`);
}
