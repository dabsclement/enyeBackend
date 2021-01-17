require("dotenv").config()
const express = require("express");
const axios = require("axios");

const router = express.Router();
const apiUri = process.env.currencyApi;

router.get("/rates", (req, res) => {
    var { base, currency } = req.query;

    if (!base || !currency) {
        return res.status(400).json({
            error: "Invalid request! Please input base and currency value",
        });
    }

    let currencies = currency.split(",");

    let date;
    let rateResult = {};
    const errors = [];

    axios
        .get(apiUri, { params: { base } })
        .then((response) => {
            var { status, data } = response;

            if (status !== 200) {
                return res.status(status).json(data);
            }

            currencies.forEach((exchangeCurrency) => {
                if (!data.rates[exchangeCurrency]) {
                    errors.push(exchangeCurrency);
                } else {
                    rateResult[exchangeCurrency] = data.rates[exchangeCurrency];
                }
            });
            date = data.date;

            if (errors.length) {
                return res.status(400).json({
                    error: `Currency ${errors.join(",")} is not supported.`,
                });
            } else {
                res.status(200).json({
                    results: {
                        base,
                        date,
                        rates: rateResult,
                    },
                });
            }
        })
        .catch((err) => {
            return res.status(err.response.status).json(err.response.data);
        });
});

module.exports = router;