const TaxCalculator = {
  calculateTax: (sum, table) => {
    const calcBracket = (b) => {
      const upper = Math.min(sum, b.end || sum);
      const amount = Math.max(0, upper - b.start);
      return amount * b.rate;
    };

    return table.map(calcBracket).reduce((acc, x) => acc + x, 0);
  },

  makeTable: (rows) => {
    const table = [];
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const end = i + 1 < rows.length ? rows[i + 1][0] : undefined;
      table.push({
        start: row[0],
        end: end,
        rate: row[1],
      });
    }

    return table;
  },
};

export default TaxCalculator;
