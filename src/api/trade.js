const {URLS} = require('../const/url');
const http = require('../http');
const uuid = require('../uuid');

module.exports.loadActiveOrders = function(symbol) {
  return http.get(URLS.ORDER_ACTIVE_LIST, {query: {symbol}});
};

module.exports.placeOrder = function({symbol, side, priceEp, orderQty, ordType, postOnly = false, reduceOnly = false, timeInForce = 'GoodTillCancel'}) {
  const params = {
    clOrdID: uuid.build(),
    symbol,
    side,
    priceEp,
    orderQty,
    ordType,
    postOnly,
    reduceOnly,
    timeInForce,
  };
  return http.post(URLS.ORDER_PLACE, {params});
};

module.exports.cancelOrder = function(symbol, orderID) {
  return http.delete(URLS.ORDER_CANCEL, {query: {symbol, orderID}});
};
