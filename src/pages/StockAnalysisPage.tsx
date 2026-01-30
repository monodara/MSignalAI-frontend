// frontend/src/pages/StockAnalysisPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAgentAnalysis } from '../services/api'; // Only need fetchAgentAnalysis now
import { AgentAnalysis } from '../types'; // Only need AgentAnalysis now
import ErrorDisplay from '../components/ErrorDisplay';
import appStyles from '../App.module.css';
import styles from './StockAnalysisPage.module.css';

const StockAnalysisPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [analysis, setAnalysis] = useState<AgentAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define a default timeframe, or allow user to select
  const timeframe = "1day"; // Hardcoding for now, could be a state variable

  useEffect(() => {
    const getAgentAnalysis = async () => {
      if (!symbol) {
        setError("No stock symbol provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Call the backend to get the AI agent's analysis
        // The backend will now assemble the StockState
        const agentAnalysis = await fetchAgentAnalysis(symbol, timeframe);
        setAnalysis(agentAnalysis);

      } catch (err) {
        console.error('Error fetching agent analysis:', err);
        setError('Failed to get AI agent analysis. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getAgentAnalysis();
  }, [symbol, timeframe]); // Re-run effect if symbol or timeframe changes

  if (!symbol) {
    return <div className={appStyles.App}><h2>No stock symbol provided.</h2></div>;
  }

  if (loading) {
    return <div className={appStyles.App}><p>Loading AI analysis...</p></div>;
  }

  if (error) {
    return <div className={appStyles.App}><ErrorDisplay message={error} /></div>;
  }

  if (!analysis) {
    return <div className={appStyles.App}><p>No analysis available for {symbol}.</p></div>;
  }

  return (
    <div className={appStyles.App}>
      <div className={styles['analysis-container']}>
        <h2>AI Stock Analysis for {symbol}</h2>
        
        <div className={styles['analysis-section']}>
          <h3>Overall Bias: <span className={styles[analysis.overall_bias.toLowerCase().replace(/\s/g, '-') || 'unknown']}>{analysis.overall_bias}</span></h3>
        </div>

        <div className={styles['analysis-section']}>
          <h3>Technical Summary</h3>
          <p>{analysis.technical_summary}</p>
        </div>

        <div className={styles['analysis-section']}>
          <h3>Fundamental Summary</h3>
          <p>{analysis.fundamental_summary}</p>
        </div>

        <div className={styles['analysis-section']}>
          <h3>Risk Factors</h3>
          <ul>
            {analysis.risk_factors.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysisPage;
