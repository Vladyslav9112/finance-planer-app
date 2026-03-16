export function json(res: any, status: number, payload: unknown) {
  res.status(status).json(payload);
}

export function allowMethods(req: any, res: any, methods: string[]) {
  if (!methods.includes(req.method || "")) {
    json(res, 405, { error: "Method not allowed" });
    return false;
  }
  return true;
}

export function parseBody<T>(req: any): T {
  if (!req.body) return {} as T;
  if (typeof req.body === "string") return JSON.parse(req.body) as T;
  return req.body as T;
}

export function toNumber(value: unknown) {
  return Number(value || 0);
}

