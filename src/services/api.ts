// frontend/src/services/api.ts
import axios from 'axios';
import { StockData, SearchResult, MarketETF, MACDData, RSIData, BollingerBandData, StockDataPoint, Event, FundamentalData, AgentAnalysis } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Generic API call wrapper
const apiCall = async <T>(url: string, params?: any): Promise<T> => {
  try {
    const response = await axios.get<T>(`${API_BASE_URL}${url}`, { params });
    return response.data;
  } catch (err) {
    console.error(`Error fetching from ${url}:`, err);
    throw new Error(`Failed to fetch data from ${url}.`);
  }
};

// Helper for transforming stock data response
const transformStockDataResponse = (backendData: any): StockData => {
  const transformedValues: StockDataPoint[] = backendData.data.timestamps.map((timestamp: string, index: number) => ({
    datetime: timestamp,
    open: backendData.data.open[index].toString(),
    high: backendData.data.high[index].toString(),
    low: backendData.data.low[index].toString(),
    close: backendData.data.close[index].toString(),
    volume: backendData.data.volume[index].toString(),
  }));

  return {
    meta: {
      symbol: backendData.meta.symbol,
      interval: backendData.meta.interval,
      currency: backendData.meta.currency,
      exchange: backendData.meta.exchange,
      exchange_timezone: backendData.meta.exchange_timezone || 'UTC',
      type: backendData.meta.type || 'Common Stock',
    },
    values: transformedValues,
    status: backendData.status || 'ok',
  };
};

export const fetchMarketETFs = async (): Promise<MarketETF[]> => {
  const responseData = await apiCall<any>('/market_etfs');
  const etfs: MarketETF[] = Object.values(responseData).map((item: any) => ({
    symbol: item.symbol,
    name: item.name,
    open: parseFloat(item.open).toFixed(2),
    high: parseFloat(item.high).toFixed(2),
    low: parseFloat(item.low).toFixed(2),
    close: parseFloat(item.close).toFixed(2),
    volume: item.volume,
    datetime: item.datetime,
    error: item.error,
  }));
  return etfs;
};

export const fetchStockData = async (symbol: string, interval: string): Promise<StockData> => {
  const backendData = await apiCall<any>(`/stock/${symbol}/price`, { interval });
  return transformStockDataResponse(backendData);
};

export const searchStocks = async (keyword: string): Promise<SearchResult[]> => {
  const responseData = await apiCall<any>('/search_stock', { keyword });
  const uniqueResults: SearchResult[] = [];
  const seenSymbols = new Set<string>();

  (responseData.data || []).forEach((result: SearchResult) => {
    if (!seenSymbols.has(result.symbol)) {
      seenSymbols.add(result.symbol);
      uniqueResults.push(result);
    }
  });
  return uniqueResults;
};

export const fetchMACDData = async (symbol: string, interval: string): Promise<MACDData> => {
  return await apiCall<MACDData>(`/stock/${symbol}/macd`, { interval });
};

export const fetchRSIData = async (symbol: string, interval: string, period: number = 14): Promise<RSIData> => {
  // The backend now returns a flat structure that matches the RSIData type.
  return await apiCall<RSIData>(`/stock/${symbol}/rsi`, { interval, period });
};

export const fetchBollingerBandData = async (symbol: string, interval: string, period: number = 20, num_std: number = 2): Promise<BollingerBandData> => {
  const backendResponse = await apiCall<any>(`/stock/${symbol}/bollinger`, { interval, period, num_std });
  return {
    upper: backendResponse.bollinger.upper,
    middle: backendResponse.bollinger.middle,
    lower: backendResponse.bollinger.lower,
    timestamps: backendResponse.bollinger.timestamps,
    squeeze_markers: backendResponse.squeeze_markers,
    walking_the_bands_markers: backendResponse.walking_the_bands_markers,
    false_breakout_markers: backendResponse.false_breakout_markers,
    middle_band_support_resistance_markers: backendResponse.middle_band_support_resistance_markers,
    extreme_deviation_markers: backendResponse.extreme_deviation_markers,
    bandwidth_data: backendResponse.bandwidth_data,
    status: backendResponse.status,
    message: backendResponse.message,
  };
};

export const fetchStockNews = async (symbol: string, time_range_days: number = 7): Promise<Event[]> => {
  return await apiCall<Event[]>(`/stock/${symbol}/news`, { time_range_days });
};

export const fetchFundamentalData = async (symbol: string, period: string = "quarter", limit: number = 4): Promise<FundamentalData> => {
  const params = {
    period,
    limit,
    _: new Date().getTime(), // Cache-busting parameter
  };
  return await apiCall<FundamentalData>(`/stock/${symbol}/fundamental`, params);
};

export const fetchAgentAnalysis = async (symbol: string, timeframe: string = "1day"): Promise<AgentAnalysis> => {
  try {
    const response = await axios.get<AgentAnalysis>(`${API_BASE_URL}/agent/analyze`, {
      params: { symbol, timeframe }
    });
    return response.data;
  } catch (err) {
    console.error(`Error fetching agent analysis for ${symbol}:`, err);
    throw new Error(`Failed to get agent analysis for ${symbol}.`);
  }
};

export const sendChatMessage = async (userMessage: string, session_id: string): Promise<string> => {
  try {
    const response = await axios.post<{ response: string }>(`${API_BASE_URL}/chat/send_message`, null, { // null for body as params are in query
      params: {
        user_message: userMessage,
        session_id: session_id
      }
    });
    return response.data.response;
  } catch (err) {
    console.error(`Error sending chat message:`, err);
    throw new Error(`Failed to send chat message.`);
  }
};