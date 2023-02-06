'use strict'
var request = require('request');
const config = require('./config');
const fs = require('fs');
const FileHandler = require('./FileHandler').FileHandler;

const WeekdayOfInterest = 3; //Wed
const series = `TIME_SERIES_INTRADAY`;
const sampleInterval = '60min';
const outputSize = 'full';

config.tickers.forEach(key => {
  getData(key);
})

function getData(stockSymbol) {
  const fileName = `./${stockSymbol}.csv`;
  console.info(`Getting data for ${stockSymbol}:`);

  let file = new FileHandler(fileName);

  let url = `https://www.alphavantage.co/query?function=${series}&symbol=${stockSymbol}&interval=${sampleInterval}&outputsize=${outputSize}&datatype=json&apikey=${config.apikey}`;
  console.log(`Request: ${url}`);

  request.get({
    url: url,
    json: true,
    headers: { 'User-Agent': 'request' }
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is successfully parsed as a JSON object:
      const meta = data['Meta Data'];
      const asOfDate = meta[`3. Last Refreshed`];
      const tZone = meta[`6. Time Zone`];

      //Write Header to file
      file.updateHeader(`date, price, volume, ${stockSymbol} as of ${asOfDate}, Data from Noon Wednesdays ${tZone}`);
      // try {
      //   fs.writeFileSync(fileName, `date, price, volume, ${stockSymbol} as of ${asOfDate}, Data from Noon Wednesdays ${tZone}`);
      // } catch (err) {
      //   console.error(err);
      // }

      //Write date elements to file
      const hourly = data['Time Series (60min)'];
      for (const key in hourly) {
        const theDate = new Date(key);
        // const keyArray = key.split(' ');
        // console.info(keyArray[0], keyArray[1]);
        if ((theDate.getHours() == 12) && (theDate.getDay() === WeekdayOfInterest)) {
          const stockValues = hourly[key];
          console.info(theDate.toString(), stockValues[`4. close`], stockValues[`5. volume`]);
          // try {
          const dataStr = `${theDate.getMonth() + 1}-${theDate.getDate()}-${theDate.getFullYear()}`;
          file.insertData(dataStr, stockValues[`4. close`], stockValues[`5. volume`]);
          // fs.appendFileSync(fileName, `\n${dataStr}, ${stockValues[`4. close`]}, ${stockValues[`5. volume`]}`);
          // } catch (err) {
          //   console.error(err);
          // }
        }
      }
      file.writeCSV();
    }
  });

}