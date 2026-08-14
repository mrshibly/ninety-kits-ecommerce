/**
 * Saleor GraphQL Client Interface
 * Standard Apollo/Fetch layer for Saleor Headless API
 */

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

const SALEOR_API_URL =
  process.env.NEXT_PUBLIC_SALEOR_API_URL || "http://localhost:8000/graphql/";

const SALEOR_CHANNEL =
  process.env.NEXT_PUBLIC_SALEOR_CHANNEL || "default-channel";

export async function executeGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(SALEOR_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables: {
          channel: SALEOR_CHANNEL,
          ...variables,
        },
      }),
      next: { revalidate: 60 },
    });

    const json: GraphQLResponse<T> = await res.json();

    if (json.errors && json.errors.length > 0) {
      console.warn("Saleor GraphQL Warning:", json.errors);
    }

    return json.data as T;
  } catch (error) {
    console.error("Saleor GraphQL Network/Fetch Error:", error);
    throw error;
  }
}
