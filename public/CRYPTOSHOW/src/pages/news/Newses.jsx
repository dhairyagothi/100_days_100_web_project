import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './News.css';

const API_KEY = import.meta.env.VITE_CRYPTOCOMPARE_KEY;

const Newses = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=${API_KEY}`)
      .then(res => {
        const data = res.data?.Data;
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          console.error('Unexpected news API response:', res.data);
          setError(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="news-page">
        <div className="news-loading">
          <div className="spin"></div>
          <p>LOADING NEWS</p>
        </div>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className="news-page">
        <h1 className="news-page-title">Crypto News</h1>
        <p className="news-page-sub">Could not load news. Please check your API key or try again later.</p>
      </div>
    );
  }

  return (
    <div className="news-page">
      <h1 className="news-page-title">Crypto News</h1>
      <p className="news-page-sub">Latest headlines from the crypto world.</p>
      <div className="news-container">
        {articles.map(article => (
          <div key={article.id} className="news-article">
            <img
              src={article.imageurl}
              alt={article.title}
              className="news-image"
              onError={(e) => e.target.style.display = 'none'}
            />
            <div className="news-details">
              <div className="news-header">
                <h2 className="news-title">{article.title}</h2>
                {article.sentiment && (
                  <span className={`news-sentiment ${article.sentiment}`}>
                    {article.sentiment}
                  </span>
                )}
              </div>
              <p className="news-body">{article.body}</p>
              <div className="news-footer">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  Read more →
                </a>
                <p className="news-source">{article.source}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Newses;