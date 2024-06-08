DROP TABLE holdings;
DROP TABLE transactions;
DROP TABLE portfolios;

DROP TABLE users;

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    favourite VARCHAR(255) array[20]
);


CREATE TABLE portfolios (
    portfolio_id SERIAL NOT NULL PRIMARY KEY,
    available_amount DECIMAL(10,2),
    id VARCHAR(255),
    FOREIGN KEY(id) REFERENCES users(id)
);
CREATE TABLE holdings (
    holding_id SERIAL NOT NULL PRIMARY KEY,
    portfolio_id INT,
    FOREIGN KEY(portfolio_id) REFERENCES portfolios(portfolio_id),
    stock_ticker VARCHAR(50),
    number_of_shares DECIMAL(5,2),
    avg_purchase_price DECIMAL(5,2)
);
CREATE TABLE transactions (
    transaction_id SERIAL NOT NULL PRIMARY KEY,
    portfolio_id INT,
    FOREIGN KEY(portfolio_id) REFERENCES portfolios(portfolio_id),
    stock_ticker VARCHAR(50),
    transaction_type VARCHAR(50),
    number_of_shares DECIMAL(5,2),
    transaction_price DECIMAL(10,2),
    transaction_date DATE
);