
const TaxCalculator = {
  calculateTax: (sum, table) => {
    return sum * table[0].rate;
  }


}

export default TaxCalculator;
