const WebSocketClient = require('websocket').w3cwebsocket;
const {URLS} = require('./const/url');
const config = require('./config');
const {buildSignature} = require('./sign');

const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

const ws = new WebSocketClient(URLS.WS_URL);
const UnsubscribeTime = 5000;

let counter = 1;
function nextId() {
  return counter++;
}

function send(msg, callback = null) {
  if (ws.readyState === OPEN) {
    msg.id = msg.id || nextId();
    if (callback) {
      function handleMessage(e) {
        const data = JSON.parse(e.data);
        if (data.id === msg.id) {
          ws.removeEventListener('message', handleMessage);
          callback(null, data);
        }
      }

      ws.addEventListener('message', handleMessage);
    }
    const msgStr = JSON.stringify(msg);
    ws.send(msgStr);
    console.log('\x1b[36m%s\x1b[0m', '[SEND MSG]', msgStr);
    return;
  }

  callback('websocket not open');
}

ws.addEventListener('message', function(e) {
  console.log('\x1b[33m%s\x1b[0m', '[RECEIVE MSG]', e.data);
});

function startHeartbeat() {
  let timer = 0;
  ws.addEventListener('open', function() {
    timer = setInterval(() => {
      send({method: 'server.ping', params: []});
    }, 3000);
  });

  ws.addEventListener('close', function() {
    clearInterval(timer);
    timer = 0;
  });
}

function subscribeOrderbook(callback) {
  ws.addEventListener('open', function() {
    send({method: 'orderbook.subscribe', params: ['BTCUSD']}, function(error, data) {
      if (error) {
        console.log('subscribe BTCUSD orderbook failed');
      }
      if (data) {
        console.log('subscribe BTCUSD orderbook succeed');
      }

      callback && callback();
    });
  });
}

function unsubscribeOrderbook() {
  send({method: 'orderbook.unsubscribe', params: ['BTCUSD']});
}

function wsLogin(callback) {
  ws.addEventListener('open', function() {
    // auth
    const expiry = Math.floor(Date.now() / 1000) + 2 * 60;
    const content = config.api_key + expiry;
    const signature = buildSignature(content, config.secret);
    send({method: 'user.auth', params: ['API', config.api_key, signature, expiry]}, callback);
  });
}

function subscribeAop(callback) {
  send({method: 'aop.subscribe', params: []}, function(error, data) {
    if (error) {
      console.log('subscribe aop data failed');
    }
    if (data) {
      console.log('subscribe aop data succeed');
    }
    callback && callback();
  });
}

function unsubscribeAop() {
  send({method: 'aop.unsubscribe', params: []});
}

function subscribeWo(callback) {
  send({method: 'wo.subscribe', params: []}, function(error, data) {
    if (error) {
      console.log('subscribe wo data failed');
    }
    if (data) {
      console.log('subscribe wo data succeed');
    }
    callback && callback();
  });
}

function unsubscribeWo() {
  send({method: 'wo.unsubscribe', params: []});
}

/**
 * testDemos:
 * 1. heartbeat
 * 2. public subscribe/unsubscribe (orderbook)
 * 3. auth
 * 4. private subscribe/unsubscribe (account-order-position)
 * 5. private subscribe/unsubscribe (wallet-order)
 */
function testDemos() {
  // 1. heartbeat
  startHeartbeat();

  // 2. public subscribe/unsubscribe (orderbook)
  subscribeOrderbook(() => setTimeout(() => unsubscribeOrderbook, UnsubscribeTime));

  // 3. auth
  wsLogin(function handleLogin(error, data) {
    if (error) {
      console.log('ws auth failed');
    }

    if (data) {
      console.log('ws auth succeed');

      // 4. private subscribe/unsubscribe (account-order-position)
      subscribeAop(() => setTimeout(unsubscribeAop, UnsubscribeTime));

      // 5. private subscribe/unsubscribe (wallet-order)
      subscribeWo(() => setTimeout(() => unsubscribeWo, UnsubscribeTime))
    }
  });
}

testDemos();
