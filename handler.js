'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

module.exports.checkOffers = async (event, context) => {
  const offerParams = "orderby=score&order=DESC&offset=0&range-price=0%3B10&range-call=630%3B630&range-data=20%3B350&carrier%5B%5D=3368&carrier%5B%5D=3372&carrier%5B%5D=3375&carrier%5B%5D=3379";

  const bestOffer = await checkAvailableOffers(offerParams);
  if (bestOffer != null) {
    console.log("Best offer found", bestOffer);
    await sendTelegramMessage(bestOffer.offerCount, bestOffer.offerName, bestOffer.offerPrice, bestOffer.offerLink, bestOffer.offerProvider);
  } else {
    console.log("No suitable offer was found.");
  }
};

async function sendTelegramMessage(offerCount, offerName, offerPrice, offerLink, offerProvider) {
  const messageData = `
  Il y a <b>${offerCount}</b> qui correspondent à vos critères!
  Voici la meilleure offre:
  <a href="${offerLink}">${offerName} - ${offerProvider}</a>
  - ${offerPrice} / mois
  `;

  try {
    await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${encodeURI(messageData)}&parse_mode=HTML`);
  } catch (error) {
    console.error("Failed to send message");
    console.error(error);
  }
}

async function checkAvailableOffers(offerParams) {
  try {
    const response = await axios.post('https://www.monpetitforfait.com/wp-json/mpf/v1/products/load', offerParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

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