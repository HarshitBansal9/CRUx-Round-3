const router = require('express').Router();
companies = ['AAPL', 'TSLA', 'AMZN', 'GOOG', 'MSFT', "IBM", "ACM", "NVDA", "META", "TATAPOWER.NS", "GPS", "SAM", "MDB"]
const pool = require("../db.ts");
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
router.get("/search_exact", async (req, res) => {
    try {
        const quote = await yahooFinance.quote(req.query.stock_ticker);
        if (quote === undefined) {
            res.status(500).json({ error: "An error occurred while fetching the stock quote." })
        } else {
            res.json(quote);
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the stock quote." });
    }
})
router.get("/stockdetails", async (req, res) => {
    const quote = await yahooFinance.quote(decodeURIComponent(req.query.name))
    res.json(quote);
})
router.get("/gethistory", async (req, res) => {
    let currDate = new Date(new Date().getTime());
    const [year, month, week, day] = await Promise.all([
        //api calls to get all the historical data
        yahooFinance.chart(req.query.name, { period1: new Date(currDate.getTime() - 365 * 24 * 60 * 60 * 1000), period2: currDate, interval: "1d" }),
        yahooFinance.chart(req.query.name, { period1: new Date(currDate.getTime() - 30 * 24 * 60 * 60 * 1000), period2: currDate, interval: "1d" }),
        yahooFinance.chart(req.query.name, { period1: new Date(currDate.getTime() - 7 * 24 * 60 * 60 * 1000), period2: currDate, interval: "5m" }),
        yahooFinance.chart(req.query.name, { period1: new Date(currDate.getTime() - 14 * 60 * 60 * 1000), period2: new Date(currDate.getTime() - 1 * 60 * 60 * 1000), interval: "1m" })
    ]);
    res.json({ year, month, week, day });
})

router.get("/addfavourite", async (req, res) => {
    await pool.query("UPDATE users SET favourite = array_append(favourite,$1) WHERE id = $2", [req.query.name, req.user.id]);
    res.json({ success: true });
})
router.get("/getfavourite", async (req, res) => {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    res.json(user.rows[0].favourite);
})
router.get("/removefavourite", async (req, res) => {
    await pool.query("UPDATE users SET favourite = array_remove(favourite,$1) WHERE id = $2", [req.query.name, req.user.id]);
    res.json({ success: true });
})

router.get("/search", async (req, res) => {
    const search = await yahooFinance.search(req.query.name, { region: "US", newsCount: 0 });
    res.json(search);
})
module.exports = router;