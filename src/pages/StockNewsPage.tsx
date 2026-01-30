// frontend/src/pages/StockNewsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStockNews } from '../services/api';
import { Event } from '../types';
import ErrorDisplay from '../components/ErrorDisplay';
import styles from './StockNewsPage.module.css'; // Import as CSS module
import appStyles from '../App.module.css'; // Import App.module.css for global styles
import errorDisplayStyles from '../components/ErrorDisplay.module.css'; // Import error display styles

const StockNewsPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [news, setNews] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNews = async () => {
      if (!symbol) return;
      setLoading(true);
      setError(null);
      try {
        const fetchedNews = await fetchStockNews(symbol);
        setNews(fetchedNews);
      } catch (err) {
        console.error('Error fetching stock news:', err);
        setError('Failed to fetch stock news. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, [symbol]);

  if (!symbol) {
    return <div className={appStyles.App}><h2>No stock symbol provided.</h2></div>;
  }

  return (
    <div className={appStyles.App}>
      <h2>News for {symbol}</h2>
      {loading && <p className={errorDisplayStyles['loading-message']}>Loading news...</p>}
      {error && <ErrorDisplay message={error} />}

      <div className={styles['news-list-container']}>
        {news.length === 0 && !loading && !error ? (
          <p>No news found for {symbol} in the last 7 days.</p>
        ) : (
          <div className={styles['news-cards-container']}>
            {news.map(event => (
              <div key={event.id} className={styles['news-card']}>
                <h3>{event.headline}</h3>
                <p><strong>Type:</strong> {event.type}</p>
                <p><strong>Sentiment:</strong> <span className={styles[`sentiment-${event.sentiment}`]}>{event.sentiment}</span> (Confidence: {(event.confidence * 100).toFixed(1)}%)</p>
                <p>{event.summary}</p>
                {event.raw_sources && event.raw_sources.length > 0 && (
                  <p>
                    <strong>Source:</strong> <a href={event.raw_sources[0].url} target="_blank" rel="noopener noreferrer">{event.raw_sources[0].source}</a>
                    {event.raw_sources[0].published_at && ` (Published: ${new Date(event.raw_sources[0].published_at).toLocaleDateString()})`}
                  </p>
                )}
                {event.tags && event.tags.length > 0 && (
                  <p><strong>Tags:</strong> {event.tags.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockNewsPage;
