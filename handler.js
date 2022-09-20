'use strict';

const axios = require('axios');
const url = require('url');
const cheerio = require('cheerio');

module.exports.checkOffers = async (event, context) => {
  const params = new url.URLSearchParams({
    orderby: "score",
    order: "DESC",
    offset: "0",
    "range-price": "0;20",
    "range-call": "630;630",
    "range-data": "212;350",
    "commitment[]": "0"
  });

  const bestOffer = await checkAvailableOffers(params);
  if (bestOffer != null) {
    console.log("Best offer found", bestOffer);
    await sendPushNotification(bestOffer.offerCount, bestOffer.offerName, bestOffer.offerPrice, bestOffer.offerLink, bestOffer.offerProvider);
  } else {
    console.log("No suitable offer was found.");
  }
};

async function sendPushNotification(offerCount, offerName, offerPrice, offerLink, offerProvider) {
  const notificationData = {
    app_key: process.env.PUSHED_APP_KEY,
    app_secret: process.env.PUSHED_APP_SECRET,
    target_type: "app",
    content: `Il y a ${offerCount} qui correspondent à vos critères! \n${offerName}: ${offerPrice}/mois (${offerProvider})`,
    content_type: "url",
    content_extra: offerLink
  };

  try {
    await axios.post('https://api.pushed.co/1/push', notificationData);
  } catch (error) {
    console.error("Failed to send push notification");
    console.error(error);
  }
}

async function checkAvailableOffers(offerParams) {
  try {
    const response = await axios.post('https://www.monpetitforfait.com/wp-json/mpf/v1/products/load', offerParams.toString());

    if (response.data) {
      const $ = cheerio.load(response.data.html);

      // S'il y a au moins une offre disponible
      if (/\d/.test(response.data.count)) {
        return {
          offerCount: response.data.count,
          offerLink: $('a')[0].attribs.href,
          offerName: $($('p.name')[0]).text(),
          offerPrice: $($('p.price > span')[0]).text(),
          offerProvider: $($('div.logo > img.img-fluid')[0]).attr('alt')
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch phone plan offers");
    console.error(error);
  }
  return null;
}