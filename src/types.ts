// frontend/src/types.ts

export interface StockDataPoint {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface StockData {
  meta: {
    symbol: string;
    interval: string;
    currency: string;
    exchange: string;
    exchange_timezone: string;
    type: string;
  };
  values: StockDataPoint[];
  status: string;
}

export interface SearchResult {
  symbol: string;
  instrument_name: string;
  exchange: string;
  instrument_type: string;
}

export interface MarketETF {
  symbol: string;
  name: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  datetime: string;
  error?: string;
}

export interface MACDHistogramItem {
  time: string;
  value: number | null;
  color: string;
}

export interface MACDMarker {
  time: string;
  position: 'aboveBar' | 'belowBar' | 'inBar';
  color: string;
  shape: 'arrowUp' | 'arrowDown' | 'circle' | 'square';
  text?: string;
}

export interface MACDData {
  macd_line: (number | null)[];
  signal_line: (number | null)[];
  histogram_data: MACDHistogramItem[];
  timestamps: string[];
  crossover_markers: MACDMarker[];
  divergence_markers: MACDMarker[];
  status: string; // Added status field
  message?: string; // Added optional message field
  error?: string;
}

export interface RSIData {
  rsi: (number | null)[];
  timestamps: string[];
  divergences: Divergences;
  status: string; // Added status field
  message?: string; // Added optional message field
  error?: string;
}

export interface DivergencePoint {
  time: string;
  value: number;
}

export interface Divergence {
  price_start: DivergencePoint;
  price_end: DivergencePoint;
  rsi_start: DivergencePoint;
  rsi_end: DivergencePoint;
}

export interface Divergences {
  bullish: Divergence[];
  bearish: Divergence[];
}

export interface BollingerBandMarker {
  time: string;
  position: 'aboveBar' | 'belowBar' | 'inBar';
  color: string;
  shape: 'arrowUp' | 'arrowDown' | 'circle' | 'diamond' | 'square' | 'triangleUp' | 'triangleDown';
  text?: string;
}

export interface BandwidthData {
  bandwidth: (number | null)[];
  timestamps: string[];
}

export interface BollingerBandData {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
  timestamps: string[];
  squeeze_markers?: BollingerBandMarker[];
  walking_the_bands_markers?: BollingerBandMarker[];
  false_breakout_markers?: BollingerBandMarker[];
  middle_band_support_resistance_markers?: BollingerBandMarker[];
  extreme_deviation_markers?: BollingerBandMarker[];
  bandwidth_data?: BandwidthData;
  status?: string;
  message?: string;
}

export interface RawSource {
  source: string;
  url: string;
  published_at: string;
}

export interface Impact {
  level: "low" | "medium" | "high" | "unknown";
  reason: string;
}

export interface PriceRelevance {
  gap_risk: boolean;
  volatility_risk: "low" | "medium" | "high" | "unknown";
  trend_risk: "continuation" | "reversal" | "unclear" | "unknown";
}

export interface Event {
  id: string;
  timestamp: string;
  type: "earnings" | "company_event" | "macro" | "sector" | "sentiment" | "unknown";
  headline: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative" | "unknown";
  confidence: number;
  impact: Impact;
  time_horizon: "immediate" | "short" | "mid" | "long" | "unknown";
  directional_bias: "bullish" | "bearish" | "mixed" | "unknown";
  price_relevance: PriceRelevance;
  tags: string[];
  raw_sources: RawSource[];
}

// Fundamental Data Interfaces
export interface FinancialStatement {
  symbol: string;
  date: string;
  reportedCurrency?: string;
  cik?: string;
  fillingDate?: string;
  acceptedDate?: string;
  calendarYear?: string;
  period?: string;
  link?: string;
  finalLink?: string;
}

export interface IncomeStatement extends FinancialStatement {
  revenue?: number;
  costOfRevenue?: number;
  grossProfit?: number;
  grossProfitRatio?: number;
  researchAndDevelopmentExpenses?: number;
  generalAndAdministrativeExpenses?: number;
  sellingAndMarketingExpenses?: number;
  otherExpenses?: number;
  operatingExpenses?: number;
  operatingIncome?: number;
  operatingIncomeRatio?: number;
  interestIncome?: number;
  interestExpense?: number;
  totalOtherIncomeExpensesNet?: number;
  incomeBeforeTax?: number;
  incomeBeforeTaxRatio?: number;
  incomeTaxExpense?: number;
  netIncome?: number;
  netIncomeRatio?: number;
  eps?: number;
  epsdiluted?: number;
  weightedAverageShsOut?: number;
  weightedAverageShsOutDil?: number;
}

export interface BalanceSheet extends FinancialStatement {
  cashAndCashEquivalents?: number;
  shortTermInvestments?: number;
  cashAndShortTermInvestments?: number;
  netReceivables?: number;
  inventory?: number;
  otherCurrentAssets?: number;
  totalCurrentAssets?: number;
  propertyPlantEquipmentNet?: number;
  goodwill?: number;
  intangibleAssets?: number;
  goodwillAndIntangibleAssets?: number;
  longTermInvestments?: number;
  taxAssets?: number;
  otherNonCurrentAssets?: number;
  totalNonCurrentAssets?: number;
  totalAssets?: number;
  accountPayables?: number;
  shortTermDebt?: number;
  taxPayables?: number;
  deferredRevenue?: number;
  otherCurrentLiabilities?: number;
  totalCurrentLiabilities?: number;
  longTermDebt?: number;
  deferredRevenueNonCurrent?: number;
  deferredTaxLiabilitiesNonCurrent?: number;
  otherNonCurrentLiabilities?: number;
  totalNonCurrentLiabilities?: number;
  totalLiabilities?: number;
  commonStock?: number;
  retainedEarnings?: number;
  accumulatedOtherComprehensiveIncomeLoss?: number;
  otherTotalEquity?: number;
  totalEquity?: number;
  totalLiabilitiesAndEquity?: number;
  totalInvestments?: number;
  totalDebt?: number;
  netDebt?: number;
}

export interface CashFlowStatement extends FinancialStatement {
  netIncome?: number;
  depreciationAndAmortization?: number;
  deferredIncomeTax?: number;
  stockBasedCompensation?: number;
  changeInWorkingCapital?: number;
  accountsReceivables?: number;
  inventory?: number;
  accountsPayables?: number;
  otherWorkingCapital?: number;
  otherNonCashItems?: number;
  netCashProvidedByOperatingActivities?: number;
  investmentsInPropertyPlantAndEquipment?: number;
  purchasesOfInvestments?: number;
  salesMaturitiesOfInvestments?: number;
  otherInvestingActivites?: number;
  netCashUsedForInvestingActivites?: number;
  debtRepayment?: number;
  commonStockIssued?: number;
  commonStockRepurchased?: number;
  dividendsPaid?: number;
  otherFinancingActivites?: number;
  netCashUsedForFinancingActivities?: number;
  effectOfForexChangesOnCash?: number;
  netChangeInCash?: number;
  cashAtEndOfPeriod?: number;
  cashAtBeginningOfPeriod?: number;
  operatingCashFlow?: number;
  capitalExpenditure?: number;
  freeCashFlow?: number;
}

export interface GrowthMetrics {
  qoq_growth?: number | null;
  yoy_growth?: number | null;
}

export interface Margins {
  grossProfitMargin?: number | null;
  operatingProfitMargin?: number | null;
  netProfitMargin?: number | null;
}

export interface FCFContinuity {
  isConsistentPositive: boolean;
  trend: "increasing" | "decreasing" | "stable" | "volatile" | "unknown";
  latestFcf?: number | null;
}

export interface DebtToEquity {
  debtToEquity?: number | null;
}

export interface MetricItem {
  name: string;
  value: string;
  trend?: 'up' | 'down' | 'flat' | 'unknown';
  status?: 'good' | 'neutral' | 'bad' | 'unknown';
  color?: string; // Hex color code for the status
}

export interface CalculatedMetrics {
  revenueGrowthQoQ?: MetricItem;
  revenueGrowthYoY?: MetricItem;
  epsGrowthQoQ?: MetricItem;
  epsGrowthYoY?: MetricItem;
  grossProfitMargin?: MetricItem;
  operatingProfitMargin?: MetricItem;
  netProfitMargin?: MetricItem;
  roe?: MetricItem;
  operatingCashFlow?: MetricItem;
  freeCashFlow?: MetricItem;
  fcfConsistentPositive?: MetricItem;
  fcfTrend?: MetricItem;
  latestFcf?: MetricItem;
  debtToEquity?: MetricItem;
  currentRatio?: MetricItem;
  peRatio?: MetricItem;
  forwardPeRatio?: MetricItem;
  psRatio?: MetricItem;
}

export interface ValuationMetrics {
  peRatio?: number | null;
  forwardPeRatio?: number | null;
  psRatio?: number | null;
}

export interface FundamentalStateItem {
  status: "Healthy" | "Weak" | "LossMaking" | "Strong" | "Moderate" | "Stalling" | "Negative" | "Positive" | "Volatile" | "Stressed" | "Cheap" | "Fair" | "Expensive" | "Unknown";
  color: string;
}

export interface FundamentalState {
  profitability: FundamentalStateItem;
  growth: FundamentalStateItem;
  cashflow: FundamentalStateItem;
  balanceSheet: FundamentalStateItem;
  valuationContext: FundamentalStateItem;
}

export interface FundamentalData {
  symbol: string;
  period: string;
  limit: number;
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlowStatements: CashFlowStatement[];
  calculatedMetrics: CalculatedMetrics;
  fundamentalState: FundamentalState;
  historicalRevenue?: { date: string; value: number }[];
  historicalEPS?: { date: string; value: number }[];
  historicalFreeCashFlow?: { date: string; value: number }[];
  last_updated: string;
}

// Technical State (example structure, needs to be refined based on actual data)
export interface TechnicalState {
  trend: string;
  momentum: string;
  market: string;
  macd: {
    above_zero: boolean;
    histogram: string;
    divergence: string;
  };
  rsi: {
    value: number;
    above_50: boolean;
    overbought: boolean;
  };
  bollinger: {
    position: string;
    squeeze: boolean;
  };
}

// News State (example structure, needs to be refined based on actual data)
export interface NewsState {
  sentiment: string;
  recent_events: string[];
}

// Combined Stock State for AI Agent
export interface StockState {
  symbol: string;
  timeframe: string;
  technical_state: TechnicalState;
  fundamental_state: FundamentalState; // Reusing existing FundamentalState
  news_state: NewsState;
}

// AI Agent Analysis Output
export interface AgentAnalysis {
  overall_bias: "Bullish" | "Bearish" | "Neutral" | "Bullish (Cautious)" | "Bearish (Cautious)";
  technical_summary: string;
  fundamental_summary: string;
  risk_factors: string[];
}

