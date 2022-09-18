'use strict';

const axios = require('axios');
const url = require('url');

module.exports.checkOffers = async (event, context) => {
  const params = new url.URLSearchParams({
    orderby: "score",
    order: "DESC",
    offset: 0,
    "range-price": "0;12",
    "range-call": "630;630",
    "range-data": "9;350"
  });

  try {
    const response = await axios.post('https://www.monpetitforfait.com/wp-json/mpf/v1/products/load', params.toString());
    console.log(response);
  } catch (error) {
    console.error(error);
  }

  const time = new Date();
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);
};
