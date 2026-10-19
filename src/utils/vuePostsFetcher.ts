export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface FetchPostsResult {
  posts: Post[];
  error: string | null;
}

export async function fetchJsonPlaceholderPosts(
  fetchFn: typeof fetch = window.fetch,
  url = 'https://jsonplaceholder.typicode.com/posts'
): Promise<FetchPostsResult> {
  try {
    const response = await fetchFn(url);

    if (!response.ok) {
      return {
        posts: [],
        error: `Failed to fetch posts: HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return {
        posts: [],
        error: 'Invalid posts response',
      };
    }

    return {
      posts: data,
      error: null,
    };
  } catch (err) {
    return {
      posts: [],
      error: err instanceof Error ? err.message : 'Something went wrong',
    };
  }
}
