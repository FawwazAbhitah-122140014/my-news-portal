interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface ProcessedArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: string;
}

// NewsAPI
export async function getNews(category: string): Promise<ProcessedArticle[]> {
  try {
    const apiUrl = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(category)}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;

    const res = await fetch(apiUrl, { next: { revalidate: 600 } });

    if (!res.ok) {
      throw new Error(`News API request failed with status ${res.status}`);
    }

    const data = await res.json();

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from News API');
    }

    return data.articles.map((article: Article) => ({
      title: article.title || 'No title available',
      description: article.description || 'No description available',
      url: article.url,
      urlToImage: article.urlToImage || '/default-news.jpg',
      publishedAt: article.publishedAt
        ? new Date(article.publishedAt).toLocaleString()
        : 'Date not available',
      source: article.source?.name || 'Unknown source',
    }));
  } catch (error) {
    console.error('Error fetching NewsAPI:', error);
    return [];
  }
}

// MediaStack API (mengganti CurrentsAPI)
export async function getMediaStackNews(category: string): Promise<ProcessedArticle[]> {
  try {
    const apiUrl = `http://api.mediastack.com/v1/news?access_key=${process.env.MEDIASTACK_API_KEY}&categories=${encodeURIComponent(category)}&languages=en&limit=5`;

    const res = await fetch(apiUrl, { next: { revalidate: 600 } });

    if (!res.ok) {
      throw new Error(`MediaStack API request failed with status ${res.status}`);
    }

    const data = await res.json();

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from MediaStack API');
    }

    return data.data.map((article: any) => ({
      title: article.title || 'No title available',
      description: article.description || 'No description available',
      url: article.url,
      urlToImage: article.image || '/default-news.jpg',
      publishedAt: article.published_at
        ? new Date(article.published_at).toLocaleString()
        : 'Date not available',
      source: article.source || 'Unknown source',
    }));
  } catch (error) {
    console.error('Error fetching MediaStack:', error);
    return [];
  }
}

// NYTimes API
export async function getNYTimesNews(section: string): Promise<ProcessedArticle[]> {
  try {
    const apiUrl = `https://api.nytimes.com/svc/topstories/v2/${encodeURIComponent(section)}.json?api-key=${process.env.NYTIMES_API_KEY}`;

    const res = await fetch(apiUrl, { next: { revalidate: 600 } });

    if (!res.ok) {
      throw new Error(`NYTimes API request failed with status ${res.status}`);
    }

    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format from NYTimes API');
    }

    return data.results.slice(0, 5).map((article: any) => ({
      title: article.title || 'No title available',
      description: article.abstract || 'No description available',
      url: article.url,
      urlToImage: article.multimedia?.[0]?.url || '/default-news.jpg',
      publishedAt: article.published_date
        ? new Date(article.published_date).toLocaleString()
        : 'Date not available',
      source: 'The New York Times',
    }));
  } catch (error) {
    console.error('Error fetching NYTimes:', error);
    return [];
  }
}
