const router = require('express').Router();
companies = ['AAPL', 'TSLA', 'AMZN', 'GOOG', 'MSFT', "IBM", "ACM", "NVDA", "META", "TATAPOWER.NS", "GPS", "SAM", "MDB"]

const yahooFinance = require('yahoo-finance2').default;
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
router.get("/stockdetails", async (req, res) => {
    const quote = await yahooFinance.quote(req.query.name)
    res.json(quote);
})
router.get("/gethistory", async (req, res) => {
    let currDate = new Date(new Date().getTime());
    const [year, month, week, day] = await Promise.all([
        yahooFinance.chart(req.query.name, { period1: new Date(currDate.getTime() - 365 * 24 * 60 * 60 * 1000), period2: currDate, interval: "1d" }),
        yahooFinance.chart(req.query.name, { period1: new Date(currDate.getTime() - 30 * 24 * 60 * 60 * 1000), period2: currDate, interval: "1d" }),
        yahooFinance.chart(req.query.name, { period1: new Date(currDate.getTime() - 7 * 24 * 60 * 60 * 1000), period2: currDate, interval: "5m" }),
        yahooFinance.chart(req.query.name, { period1: new Date(currDate.getTime() -  14 * 60 * 60 * 1000), period2: new Date(currDate.getTime() - 1 * 60 * 60 * 1000), interval: "1m" })
    ]);
    console.log("RAN");
    res.json({ year, month, week, day });
})

module.exports = router;