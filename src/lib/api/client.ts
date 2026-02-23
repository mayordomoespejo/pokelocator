import { POKEAPI_BASE_URL } from "@/lib/constants";

export class APIError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    // Next.js extended fetch cache — revalidate every 24h (data is near-static)
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new APIError(
      res.status,
      res.statusText,
      `Failed to fetch ${url}: ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}

export function buildUrl(path: string): string {
  return `${POKEAPI_BASE_URL}${path}`;
}
