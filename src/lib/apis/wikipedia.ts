export interface WikipediaPage {
  pageid: number;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

export interface WikipediaSearchResult {
  query: {
    search: Array<{
      ns: number;
      title: string;
      pageid: number;
      size: number;
      wordcount: number;
      snippet: string;
      timestamp: string;
    }>;
  };
}

export async function fetchWikipediaData(title: string): Promise<WikipediaPage | null> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Wikipedia API error:', error);
    return null;
  }
}

export async function searchWikipedia(query: string): Promise<WikipediaSearchResult | null> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Wikipedia search error:', error);
    return null;
  }
}
