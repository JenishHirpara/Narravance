# StockTracker App

A real-time stock tracking application built with React and Material-UI that allows users to monitor stock prices, view detailed company information, and track market news.

## Features

- **Stock Search**: Search and add stocks to your portfolio
- **Real-time Data**: Track current prices and price changes using Polygon.io API
- **Company Details**: View detailed company information including:
  - Market cap, employee count, and listing details
  - Company description and headquarters information
  - Interactive candlestick chart for price visualization
  - Latest company news and updates

## Prerequisites

- Node.js 
- npm 
- Polygon.io API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Narravance-Screening
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Polygon.io API key:
```
VITE_POLYGON_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 to view the app in your browser

## Technologies Used

- React
- Material-UI
- Vite
- Polygon.io API
- ApexCharts
- React Router
- Axios

## Project Structure

- `/src/components` - React components
  - `NavBar.jsx` - Search and navigation functionality
  - `PortfolioTable.jsx` - Displays tracked stocks
  - `StockDetail.jsx` - Company details and chart view
  - `NewsModal.jsx` - Company news display
- `/src/theme.js` - Application theming
- `/src/assets` - Static assets and icons

## Data Persistence

The application uses localStorage to persist your portfolio data between sessions.
