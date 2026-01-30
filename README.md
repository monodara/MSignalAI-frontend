# MSignalAI Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white)
![Lightweight Charts](https://img.shields.io/badge/Lightweight_Charts-FF4E4E?style=flat)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS_Modules-000000?style=flat&logo=css-modules&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)

This directory contains the frontend for the MSignalAI application, a responsive and interactive user interface built with React and TypeScript. It consumes the API provided by the backend to display stock charts, financial data, news, and AI-driven analysis.

## Overview

The frontend is responsible for:

*   **User Interface:** Providing a clean, intuitive, and responsive interface for users to interact with stock market data.
*   **Data Visualization:** Rendering interactive financial charts using the Lightweight Charts library, including technical indicators like MACD, RSI, and Bollinger Bands.
*   **Routing:** Managing client-side navigation between different pages (e.g., Home, Stock Details, News, AI Chat) using React Router.
*   **State Management:** Utilizing React Context and custom hooks to manage application state, such as market data and user-specific lists.
*   **API Interaction:** Communicating with the backend API to fetch and display data.

## Technologies

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** For static typing, improving code quality and developer experience.
*   **React Router:** For declarative routing within the application.
*   **Lightweight Charts:** For high-performance, interactive financial charting.
*   **Axios:** For making HTTP requests to the backend API.
*   **CSS Modules:** For locally scoped CSS to avoid style conflicts.
*   **React Markdown:** For rendering Markdown content, used in the AI chat and analysis pages.

## Getting Started

### Prerequisites

*   Node.js and npm (or yarn).

### Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in this directory to specify the backend API URL.

    ```
    REACT_APP_API_BASE_URL="http://localhost:8000"
    ```

### Running the Application

Start the React development server:

```bash
npm start
```

The application will open automatically in your browser at `http://localhost:3000`.

## Project Structure

```
src/
├── components/      # Reusable React components (e.g., Header, SearchBar, StockChart)
├── context/         # React Context for global state management (e.g., MarketETFsContext)
├── hooks/           # Custom React hooks for encapsulating complex logic (e.g., useStockSearch, useMACDChart)
├── pages/           # Top-level components that correspond to application routes (e.g., HomePage, StockAnalysisPage)
├── services/        # Logic for interacting with the backend API (e.g., api.ts)
├── types/           # TypeScript type definitions used across the application
├── utils/           # Utility functions (e.g., localStorage helpers)
├── App.tsx          # Main application component with routing setup
└── index.tsx        # Entry point for the React application
```
