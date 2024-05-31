const router = require('express').Router();
companies = ['AAPL', 'IBM', 'MSFT', "GOOG", "ACM",]

// require syntax (if your code base does not support imports)
// const yahooFinance = require('yahoo-finance2').default; // NOTE the .
// for (let i = 0; i < companies.length; i++) {
//     (async function () {
//         const quote = await yahooFinance.quote(companies[i]);
//         console.log(companies[i], quote.regularMarketPrice, quote.currency, quote.regularMarketChangePercent);
//         //console.log(quote);
//     })();
// }
const yahooFinance = require('yahoo-finance2').default;
router.get("/getstocks", async (req, res) => {
    let stock = [];
    for (let i = 0; i < companies.length; i++) {
        const quote = await yahooFinance.quote(companies[i]);
        stock.push({
            name: companies[i],
            price: quote.regularMarketPrice,
            currency: quote.currency,
            change: quote.regularMarketChangePercent
        });
    }
    res.json(stock);
})

module.exports = router;