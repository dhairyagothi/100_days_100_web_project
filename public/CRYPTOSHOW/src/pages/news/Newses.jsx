import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './News.css';

const API_KEY = 'code below';
// 6a569262d6fdab4a7f7e818dfd923dcabccb82eea4b99df29da7d3e88f5a6370 read this number


const Newses = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get(`https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=${API_KEY}`)
            .then(response => {
                setArticles(response.data.Data);
            })
            .catch(error => {
                console.error('Error fetching the news articles:', error);
            });
    }, []);

    return (
        <div className="news-container">
            {articles.map(article => (
                <div key={article.id} className="news-article">
                    <img src={article.imageurl} alt={article.title} className="news-image" />
                    <div className="news-details">
                        <div className="news-header">
                            <h2 className="news-title">{article.title}</h2>
                            <span className={`news-sentiment ${article.sentiment}`}>{article.sentiment}</span>
                        </div>
                        <p className="news-body">{article.body}</p>
                        <div className="news-footer">
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                                Read More
                            </a>
                            <p className="news-source">Source: {article.source}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Newses;
