const router = require('express').Router();
companies = ['AAPL','TSLA','AMZN','GOOG', 'MSFT', "IBM", "ACM",]

const yahooFinance = require('yahoo-finance2').default;
for (let i = 0; i < companies.length; i++) {
    (async function () {
        const quote = await yahooFinance.quote(companies[i]);
        //console.log(companies[i], quote.regularMarketPrice, quote.currency, quote.regularMarketChangePercent);
        console.log(quote);
    })();
}

router.get("/getstocks", async (req, res) => {
    let stock = [];
    for (let i = 0; i < companies.length; i++) {
        const quote = await yahooFinance.quote(companies[i])
        stock.push({
            name: companies[i],
            company: quote.longName,
            price: quote.regularMarketPrice,
            currency: quote.currency,
            change: quote.regularMarketChangePercent
        });
    }
    res.json(stock);
})

module.exports = router;