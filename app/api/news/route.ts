import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source');
  const articles: any[] = [];

  if (source === 'newsapi') {
    try {
      const newsapiRes = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${process.env.NEWS_API_KEY}`
      );
      const newsapi = await newsapiRes.json();

      if (newsapi?.articles) {
        articles.push(
          ...newsapi.articles.map((item: any) => ({
            title: item.title,
            description: item.description,
            url: item.url,
            urlToImage: item.urlToImage || '/default.jpg',
            publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString() : '',
            source: item.source?.name || 'NewsAPI',
          }))
        );
      }
    } catch (error) {
      console.error('NewsAPI Error:', error);
    }
  }

  if (source === 'mediastack') {
    try {
      const mediaRes = await fetch(
        `http://api.mediastack.com/v1/news?access_key=${process.env.MEDIASTACK_API_KEY}&languages=en&limit=20`
      );
      const mediastack = await mediaRes.json();

      if (mediastack?.data) {
        articles.push(
          ...mediastack.data.map((item: any) => ({
            title: item.title,
            description: item.description,
            url: item.url,
            urlToImage: item.image || '/default.jpg',
            publishedAt: item.published_at ? new Date(item.published_at).toISOString() : '',
            source: item.source || 'Mediastack',
          }))
        );
      }
    } catch (error) {
      console.error('Mediastack Error:', error);
    }
  }

  if (source === 'nytimes') {
    try {
      const nyRes = await fetch(
        `https://api.nytimes.com/svc/topstories/v2/business.json?api-key=${process.env.NYTIMES_API_KEY}`
      );
      const nytimes = await nyRes.json();

      if (nytimes?.results) {
        articles.push(
          ...nytimes.results.map((item: any) => ({
            title: item.title,
            description: item.abstract,
            url: item.url,
            urlToImage: item.multimedia?.[0]?.url || '/default.jpg',
            publishedAt: item.published_date ? new Date(item.published_date).toISOString() : '',
            source: item.source || 'NYTimes',
          }))
        );
      }
    } catch (error) {
      console.error('NYTimes Error:', error);
    }
  }

  return NextResponse.json(articles);
}
