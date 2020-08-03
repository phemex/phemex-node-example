const WebSocketClient = require('websocket').w3cwebsocket;
const {URLS} = require('./const/url');
const config = require('./config');
const {buildSignature} = require('./sign');

const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

(function main() {
  const ws = new WebSocketClient(URLS.WS_URL);
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
      console.log('[SEND MSG]', msgStr);
      return;
    }

    callback('websocket not open');
  }

  startHeartbeat(ws, send);

  ws.addEventListener('open', function() {
    send({method: 'orderbook.subscribe', params: ['BTCUSD']}, function(error, data) {
      if (error) {
        console.log('subscribe BTCUSD orderbook failed');
      }
      if (data) {
        console.log('subscribe BTCUSD orderbook succeed');
      }
    });
  });

  wsLogin(ws, send, function handleLogin(error, data) {
    if (error) {
      console.log('ws auth failed');
    }

    if (data) {
      console.log('ws auth succeed');

      send({method: 'aop.subscribe', params: []}, function(error, data) {
        if (error) {
          console.log('subscribe aop data failed');
        }
        if (data) {
          console.log('subscribe aop data succeed');
        }
      });
    }
  });

  ws.addEventListener('message', function(e) {
    console.log('[RECEIVE MSG]', e.data);
  });
})();

function startHeartbeat(ws, send) {
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

function wsLogin(ws, send, callback) {
  ws.addEventListener('open', function() {
    // auth
    const expiry = Math.floor(Date.now() / 1000) + 2 * 60;
    const content = config.api_key + expiry;
    const signature = buildSignature(content, config.secret);
    send({method: 'user.auth', params: ['API', config.api_key, signature, expiry]}, callback);
  });
}
