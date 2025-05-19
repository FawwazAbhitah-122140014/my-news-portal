'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiExternalLink, FiLogOut, FiLoader, FiUser, FiClock, FiBookmark, FiSearch, FiGrid, FiRefreshCw, FiInfo } from 'react-icons/fi';

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: string;
  apiSource: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchNews = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const [newsApiRes, mediastackRes, nytimesRes] = await Promise.all([
      fetch('/api/news?source=newsapi'),
      fetch('/api/news?source=mediastack'),
      fetch('/api/news?source=nytimes')
    ]);

    if (!newsApiRes.ok || !mediastackRes.ok || !nytimesRes.ok) {
      throw new Error('Failed to fetch news from one or more sources');
    }

    const newsApiData = await newsApiRes.json();
    const mediastackData = await mediastackRes.json();
    const nytimesData = await nytimesRes.json();

    // Combine all articles with their source
    const combinedArticles = [
      ...newsApiData.map((article: Article) => ({ ...article, apiSource: 'NewsAPI' })),
      ...mediastackData.map((article: Article) => ({ ...article, apiSource: 'MediaStack API' })),
      ...nytimesData.map((article: Article) => ({ ...article, apiSource: 'NYTimes' }))
    ];

    // Deduplicate articles based on title and description
    const uniqueArticles = combinedArticles.reduce((acc: Article[], current: Article) => {
      const isDuplicate = acc.some(article => 
        article.title === current.title && 
        article.description === current.description
      );
      if (!isDuplicate) {
        return [...acc, current];
      }
      return acc;
    }, []);

    setArticles(uniqueArticles);
    setFilteredArticles(uniqueArticles);
  } catch (err: any) {
    console.error('Error fetching news:', err);
    setError('Failed to load news. Please try again later.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNews();
    }
  }, [status]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const result = articles.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.description.toLowerCase().includes(query)
      );
      setFilteredArticles(result);
    } else {
      setFilteredArticles(articles);
    }
  }, [searchQuery, articles]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getApiSourceColor = (source: string) => {
    switch(source) {
      case 'NewsAPI': return 'bg-blue-500/10 text-blue-400';
      case 'Media Stack API': return 'bg-green-500/10 text-green-400';
      case 'NYTimes': return 'bg-purple-500/10 text-purple-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="p-8 bg-gray-800 rounded-2xl w-full max-w-md text-center border border-gray-700">
          <div className="animate-pulse flex justify-center">
            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
              <FiGrid size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-6 mb-2">Building Your News Hub</h2>
          <p className="text-gray-400">Gathering the latest stories for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <FiUser size={20} />
              </div>
              <h1 className="text-2xl font-bold">
                Welcome back, <span className="text-blue-400">{session?.user?.name}</span>
              </h1>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg transition-all border border-gray-700"
              aria-label="Logout"
            >
              <FiLogOut size={16} /> Sign Out
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-400">Error loading content</h3>
                <div className="mt-2 text-sm text-red-300">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => fetchNews()}
                    className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <FiRefreshCw className="mr-2" /> Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Profile Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center shadow-lg">
                <FiUser size={28} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-gray-900">
                <div className="w-4 h-4 rounded-full bg-green-400"></div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, <span className="text-blue-400">{session?.user?.name || 'User'}</span>
              </h1>
              <p className="text-gray-400 flex items-center">
                <span>Your premium news digest</span>
                <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">PRO</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            {/* Stats Cards */}
            <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mr-3">
                <FiBookmark size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Total Articles</p>
                <p className="text-lg font-bold">{articles.length}</p>
              </div>
            </div>
            
            <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-400 mr-3">
                <FiClock size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Last Updated</p>
                <p className="text-lg font-bold">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-3 rounded-lg transition-all border border-gray-700"
              aria-label="Sign Out"
            >
              <FiLogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-700 rounded-lg bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Articles - 4 Column Grid with API Source */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Latest News
                {searchQuery && (
                  <span className="text-blue-400"> matching "{searchQuery}"</span>
                )}
              </h2>
              <span className="text-sm text-gray-400 mt-1 md:mt-0">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} from 3 sources
              </span>
            </div>
            
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">No articles found</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Check back later for new articles'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {filteredArticles.map((article, index) => (
                  <article
                    key={`${article.url}-${index}`}
                    className="rounded-xl overflow-hidden border border-gray-700 bg-gray-800 hover:border-blue-500/50 transition-all duration-300 group"
                  >
                    <div className="relative h-48 bg-gray-700 overflow-hidden">
                      <img
                        src={article.urlToImage || '/default.jpg'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApiSourceColor(article.apiSource)}`}>
                          {article.apiSource}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-sm text-gray-400">
                          <FiClock className="mr-1.5" size={14} />
                          {formatDate(article.publishedAt)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <FiInfo className="mr-1" size={12} />
                          {article.source}
                        </div>
                      </div>
                      <h2 className="font-semibold text-lg line-clamp-2 mb-3 group-hover:text-blue-400 transition-colors">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-400 transition-colors"
                        >
                          {article.title}
                        </a>
                      </h2>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-4">{article.description}</p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Read more <FiExternalLink className="ml-1.5" size={14} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 py-6">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-1">© {new Date().getFullYear()} News Hub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}