# StockScraper

Grabs price and volume for each stock at noon on Wednesdays using the TIME_SERIES_INTRADAY API option using alphavantage.co free service

Outputs csv files in the following format:
```cvs
date, price, volume, INTC as of 2023-01-13 20:00:00, Data from Noon Wednesdays US/Eastern
1-11-2023, 29.2900, 3326247
1-4-2023, 27.7750, 4031388
12-28-2022, 25.5901, 2881791
12-21-2022, 26.8400, 3269791
12-14-2022, 28.8650, 2255008
12-7-2022, 28.3400, 3190003
11-30-2022, 28.4650, 3190562
11-23-2022, 29.6240, 2775404
```

## Configuration

Create a file names ```config.js```
Add the following elements:
```js
module.exports = {
  apikey: "your-api-key-here",
  tickers: [
    "TICR1",
    "TICR2"
    ...
  ]
}
```

> The free ```alphavantage.co``` api key only allows 5 reads per minute...or something like that
