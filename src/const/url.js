const config = require('../config');

module.exports.URLS = {
  WS_URL: `wss://${config.ws_host}`,
  API_URL: `https://${config.api_host}`,
  MARKETS: `/v1/exchange/public/products`,
  ORDERBOOK: `/md/orderbook`,
  TRADES: `/md/trade`,

  ORDER_ACTIVE_LIST: `/orders/activeList`,
  ORDER_PLACE: `/orders`,
  ORDER_CANCEL: `/orders/cancel`,
};
