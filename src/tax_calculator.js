const TaxCalculator = {
  calculateTax: (sum, table) => {
    // TODO: explain type of table
    let taxDue = 0;
    let unTaxed = sum;
    // TODO: explain invariants
    for (let i = table.length - 1; i >= 0; i -= 1) {
      const row = table[i];
      // Get the amount of untaxed income above this value
      const applicable = Math.max(0, unTaxed - row.value);

      taxDue += applicable * row.rate;
      unTaxed -= applicable;
    }

    return taxDue;
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
