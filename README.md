# Crypto Watchlist

A React + TypeScript app for tracking crypto pairs against live Binance market data —
build a watchlist, then read each pair's price and candlestick history over daily,
weekly or monthly intervals.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?logo=react&logoColor=61DAFB)
![ECharts](https://img.shields.io/badge/ECharts-AA344D?logo=apacheecharts&logoColor=white)

## What it does

- **Pair discovery** — loads the tradable symbol list from Binance `exchangeInfo` so the
  watchlist can only ever contain pairs that actually exist.
- **Live prices** — subscribes to Binance's combined WebSocket stream
  (`wss://stream.binance.com:9443/stream`) and updates each row as ticks arrive, rather
  than polling on a timer.
- **Historical charts** — pulls OHLC candles from the `klines` endpoint and renders them
  with ECharts, switchable between daily / weekly / monthly.
- **Watchlist management** — add and remove pairs, with the add path handling and
  surfacing its own failures instead of silently dropping them.

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 18 · TypeScript · Create React App |
| Charts | ECharts (`echarts-for-react`) · Recharts |
| Data | Binance public REST + WebSocket API |
| HTTP | axios |

## Running it

```bash
npm install
npm start        # http://localhost:3000
```

No API key or account is needed — every endpoint used here is a public Binance endpoint.

## Scope and limitations

Worth being explicit about, since this is a front-end exercise rather than a product:

- **There is no server.** `src/api/backend.ts` is a stub that simulates a persistence call
  with a timeout and a random failure, so error and loading states could be built and
  tested. Watchlists live in component state and are gone on refresh; making them stick
  means adding real persistence.
- **No rate-limit handling.** Binance's public endpoints have request weights that this
  app does not track. Fine at one user on one browser tab, not fine beyond that.
- **Prices are Binance's only.** No cross-exchange aggregation, and nothing here is
  investment advice or a trading tool.

## License

MIT.
