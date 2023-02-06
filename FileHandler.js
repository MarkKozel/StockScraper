const fs = require('fs');

class FileHandler {
  constructor(fileName) {
    this.fileName = fileName;

    this.readCSV(this.fileName);
    if (this.rawData) {
      this.parseCSV();
    }

  }

  readCSV() {
    this.rawData = fs.readFileSync(this.fileName, 'utf8');
    this.updated = false;
  }

  writeCSV() {
    if (this.updated) {
      try {
        fs.writeFileSync(this.fileName, this.rawHeader);
        for (const key in this.obj) {
          const result = `\n${this.obj[key].date}, ${this.obj[key].price}, ${this.obj[key].volume}`;
          fs.appendFileSync(this.fileName, result);
        }
      } catch (err) {
        console.error(err);
      }

    }
  }

  updateHeader(header) {
    this.rawHeader = header;
    this.updated = true;
  }

  insertData(date, price, volume) {
    if (!this.obj[date.trim()]) {
      let tempLine = { date: date.trim(), price: price.trim(), volume: volume.trim() }
      this.obj[date.trim()] = tempLine;
      this.updated = true;
    }
  }

  parseCSV() {
    this.obj = {};
    const data = this.rawData.split('\n');
    this.rawHeader = data.shift();
    data.forEach(line => {
      const lineArray = line.split(',');
      let tempLine = { date: lineArray[0].trim(), price: lineArray[1].trim(), volume: lineArray[2].trim() }
      this.obj[lineArray[0].trim()] = tempLine;
    })
  }
}

module.exports = { FileHandler }