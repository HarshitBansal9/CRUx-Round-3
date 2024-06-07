const router = require('express').Router();
const pool = require("../db.ts");

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
    const holdings = await pool.query("SELECT * FROM portfolios INNER JOIN holdings ON (portfolios.portfolio_id = holdings.portfolio_id) WHERE id = $1", [req.user.id]);
    res.send(holdings.rows);
})
router.get('/get_transactions', async (req, res) => {
    const transactions = await pool.query("SELECT * FROM portfolios INNER JOIN transactions ON (portfolios.portfolio_id = transactions.portfolio_id) WHERE id = $1", [req.user.id]);
    res.send(transactions.rows);
});

router.get('/buy', async (req, res) => {
    const portfolio_id = await pool.query("SELECT portfolio_id FROM portfolios WHERE id = $1", [req.user.id]);
    const { stock_ticker, number_of_shares, avg_purchase_price } = req.query;
    const holdings = await pool.query("SELECT * FROM holdings WHERE portfolio_id = $1 AND stock_ticker = $2", [portfolio_id.rows[0].portfolio_id, stock_ticker]);
    if (holdings.rows.length === 0) {
        await pool.query("INSERT INTO holdings (portfolio_id,stock_ticker,number_of_shares,avg_purchase_price) VALUES ($1,$2,$3,$4)", [portfolio_id.rows[0].portfolio_id, stock_ticker, number_of_shares, avg_purchase_price]);
    } else {
        await pool.query("UPDATE holdings SET number_of_shares = number_of_shares + $1, avg_purchase_price = $2 WHERE portfolio_id = $3 AND stock_ticker = $4", [number_of_shares, avg_purchase_price, portfolio_id.rows[0].portfolio_id, stock_ticker]);
    }
    const currentDate = new Date().toISOString().split('T')[0];
    await pool.query("INSERT INTO transactions (portfolio_id,stock_ticker,number_of_shares,transaction_type,transaction_price,transaction_date) VALUES ($1,$2,$3,$4,$5,$6)", [portfolio_id.rows[0].portfolio_id, stock_ticker, number_of_shares, "BUY", avg_purchase_price * number_of_shares, currentDate]);
    await pool.query("Update portfolios SET available_amount = available_amount - $1 WHERE id = $2", [avg_purchase_price * number_of_shares, req.user.id]);
});

router.get('/sell', async (req, res) => {
    const portfolio_id = await pool.query("SELECT portfolio_id FROM portfolios WHERE id = $1", [req.user.id]);
    const { stock_ticker, number_of_shares, avg_purchase_price } = req.query;
    await pool.query("UPDATE holdings SET number_of_shares = number_of_shares - $1, avg_purchase_price = $2 WHERE portfolio_id = $3 AND stock_ticker = $4", [number_of_shares, avg_purchase_price, portfolio_id.rows[0].portfolio_id, stock_ticker]);
    const currentDate = new Date().toISOString().split('T')[0];
    await pool.query("INSERT INTO transactions (portfolio_id,stock_ticker,number_of_shares,transaction_type,transaction_price,transaction_date) VALUES ($1,$2,$3,$4,$5,$6)", [portfolio_id.rows[0].portfolio_id, stock_ticker, number_of_shares, "SELL", avg_purchase_price * number_of_shares, currentDate]);
    await pool.query("UPDATE portfolios SET available_amount = available_amount + $1 WHERE id = $2", [avg_purchase_price * number_of_shares, req.user.id]);
})
module.exports = router;