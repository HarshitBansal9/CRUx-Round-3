const router = require('express').Router();
const pool = require("../db.ts");
const nodemailer = require('nodemailer');
const yahooFinance = require('yahoo-finance2').default;
const dotenv = require('dotenv');
dotenv.config();
const PASSWORD = process.env.EMAILPASS;
const passport = require('passport');
router.get('/available_amount', async (req, res) => {
    const amount = await pool.query("SELECT available_amount FROM portfolios WHERE id = $1", [req.user.id]);
    res.send(amount.rows[0]);
});
router.get('/add_amount', async (req, res) => {
    const { amount } = req.query;
    await pool.query("UPDATE portfolios SET available_amount = available_amount + $1 WHERE id = $2", [amount, req.user.id]);
    res.send("Amount added successfully");
})
router.get('/get_holdings', async (req, res) => {
    const h = await pool.query("SELECT h.stock_ticker,h.industry,(sum(t.transaction_price::DECIMAL)/sum(t.number_of_shares::DECIMAL))*(h.number_of_shares::DECIMAL) cost_price,h.number_of_shares from holdings h inner join transactions t on (h.stock_ticker=t.stock_ticker) inner join portfolios p on (p.portfolio_id=h.portfolio_id) WHERE p.id = $1 AND h.number_of_shares>0 AND t.transaction_type = 'BUY' GROUP BY h.stock_ticker,h.number_of_shares,h.industry;",[req.user.id])
    const holdings = h.rows;
    const symbols = holdings.map(holding => holding.stock_ticker);
    const quotes = await yahooFinance.quote(symbols);
    holdings.forEach((holding,i) => {
        holding.currentPrice = quotes[i].regularMarketPrice;
        holding.value = holding.currentPrice * holding.number_of_shares;
        holding.unrealizedGain = holding.currentPrice * holding.number_of_shares - holding.cost_price; 
    });
    res.send(holdings);
})
router.get('/get_transactions', async (req, res) => {
    const transactions = await pool.query("SELECT * FROM portfolios INNER JOIN transactions ON (portfolios.portfolio_id = transactions.portfolio_id) WHERE id = $1", [req.user.id]);
    res.send(transactions.rows);
});
async function sendMail(to, html) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port:465,
        secure: true,
        auth:{
            user:'stockdummyapp@gmail.com',
            pass:PASSWORD
        }
    });
    const info = await transporter.sendMail({
        from: 'Harshit Bansal <stockdummyapp@gmail.com>',
        to: to,
        subject:'Update in your portfolio',
        html: html
    });
    console.log("Message sent: %s", info.messageId);
}
router.get('/buy', async (req, res) => {
    const { stock_ticker, number_of_shares, avg_purchase_price } = req.query;
    const html = `
    <h1>Transaction Successful</h1>
    <p>You have succesfully bought ${number_of_shares} shares of ${stock_ticker} at an average price of ${avg_purchase_price}</p>
    `;
    console.log(req.user.emails[0].value);
    sendMail(req.user.emails[0].value, html);
    const data = await yahooFinance.quoteSummary(stock_ticker, { modules: [ "summaryProfile" ] });
    const portfolio_id = await pool.query("SELECT portfolio_id FROM portfolios WHERE id = $1", [req.user.id]);
    const holdings = await pool.query("SELECT * FROM holdings WHERE portfolio_id = $1 AND stock_ticker = $2", [portfolio_id.rows[0].portfolio_id, stock_ticker]);
    if (holdings.rows.length === 0) {
        await pool.query("INSERT INTO holdings (portfolio_id,stock_ticker,number_of_shares,avg_purchase_price,industry) VALUES ($1,$2,$3,$4,$5)", [portfolio_id.rows[0].portfolio_id, stock_ticker, number_of_shares, avg_purchase_price,data.summaryProfile.industry]);
    } else {
        await pool.query("UPDATE holdings SET number_of_shares = number_of_shares + $1, avg_purchase_price = $2 WHERE portfolio_id = $3 AND stock_ticker = $4", [number_of_shares, avg_purchase_price, portfolio_id.rows[0].portfolio_id, stock_ticker]);
    }
    const currentDate = new Date().toISOString().split('T')[0];
    await pool.query("INSERT INTO transactions (portfolio_id,stock_ticker,number_of_shares,transaction_type,transaction_price,transaction_date) VALUES ($1,$2,$3,$4,$5,$6)", [portfolio_id.rows[0].portfolio_id, stock_ticker, number_of_shares, "BUY", avg_purchase_price * number_of_shares, currentDate]);
    await pool.query("Update portfolios SET available_amount = available_amount - $1 WHERE id = $2", [avg_purchase_price * number_of_shares, req.user.id]);
});
router.get('/sell', async (req, res) => {
    const { stock_ticker, number_of_shares, avg_purchase_price } = req.query;
    const html = `
    <h1>Transaction Successful</h1>
    <p>You have succesfully sold ${number_of_shares} shares of ${stock_ticker} at an average price of ${avg_purchase_price}</p>
    `;
    sendMail(req.user.emails[0].value, html);
    const portfolio_id = await pool.query("SELECT portfolio_id FROM portfolios WHERE id = $1", [req.user.id]);
    await pool.query("UPDATE holdings SET number_of_shares = number_of_shares - $1, avg_purchase_price = $2 WHERE portfolio_id = $3 AND stock_ticker = $4", [number_of_shares, avg_purchase_price, portfolio_id.rows[0].portfolio_id, stock_ticker]);
    const currentDate = new Date().toISOString().split('T')[0];
    await pool.query("INSERT INTO transactions (portfolio_id,stock_ticker,number_of_shares,transaction_type,transaction_price,transaction_date) VALUES ($1,$2,$3,$4,$5,$6)", [portfolio_id.rows[0].portfolio_id, stock_ticker, number_of_shares, "SELL", avg_purchase_price * number_of_shares, currentDate]);
    await pool.query("UPDATE portfolios SET available_amount = available_amount + $1 WHERE id = $2", [avg_purchase_price * number_of_shares, req.user.id]);
})
module.exports = router;