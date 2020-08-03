const {URLS} = require('../const/url');
const http = require('../http');

module.exports.loadMarkets = function() {
  return http.get(URLS.MARKETS);
};

module.exports.loadOrderbook = function(symbol) {
  return http.get(URLS.ORDERBOOK, {query: {symbol, id: 1}});
};

module.exports.loadTrades = function(symbol) {
  return http.get(URLS.TRADES, {query: {symbol}});
};
