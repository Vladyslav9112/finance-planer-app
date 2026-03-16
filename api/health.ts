import { json } from "./_lib/http.js";

export default async function handler(_: any, res: any) {
  return json(res, 200, { ok: true, timestamp: new Date().toISOString() });
}


