const TaxCalculator = {
  calculateTax: (sum, table) => {
    let taxDue = 0;
    let unTaxed = sum;
    for (let i = table.length - 1; i >= 0; i -= 1) {
      const row = table[i];
      // Get the amount of untaxed income above this value
      const applicable = Math.max(0, unTaxed - row.value);

      taxDue += applicable * row.rate;
      unTaxed -= applicable;
    }

    return taxDue;
  },
};

export default TaxCalculator;
