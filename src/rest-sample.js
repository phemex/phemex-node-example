(async function main() {
  await loadMarkets();
  // await loadOrderbook('BTCUSD');
  // await loadTrades('BTCUSD');
  // await loadActiveOrders('BTCUSD');
  // await placeOrder();
  // await cancelOrder();
})();

async function loadMarkets() {
  const {loadMarkets} = require('./api/market');
  const {data, error} = await loadMarkets();
  if (data) {
    console.log(data);
  }
  if (error) {
    console.log(error);
  }
}

async function loadOrderbook(symbol) {
  const {loadOrderbook} = require('./api/market');
  const {data, error} = await loadOrderbook(symbol);
  if (data) {
    console.log(data);
  }
  if (error) {
    console.error(error);
  }
}

async function loadTrades(symbol) {
  const {loadTrades} = require('./api/market');
  const {data, error} = await loadTrades(symbol);
  if (data) {
    console.log(data);
  }
  if (error) {
    console.log(error);
  }
}

async function loadActiveOrders(symbol) {
  const {loadActiveOrders} = require('./api/trade');
  const {data, error} = await loadActiveOrders(symbol);
  if (data) {
    console.log(data);
  }
  if (error) {
    console.log(error);
  }
}

async function placeOrder() {
  const {placeOrder} = require('./api/trade');
  const {data, error} = await placeOrder({
    symbol: 'BTCUSD',
    side: 'Buy',
    priceEp: 100000000,
    orderQty: 11,
    ordType: 'Limit',
  });
  if (data) {
    console.log(data);
  }
  if (error) {
    console.log(error);
  }
}

async function cancelOrder() {
  const {cancelOrder} = require('./api/trade');
  const {data, error} = await cancelOrder('BTCUSD', '5a10df22-2152-459f-8d57-5392e97c047f');
  if (data) {
    console.log(data);
  }
  if (error) {
    console.log(error);
  }
}
