const WebSocket = require("ws");
const { WebSocketServer } = require("ws");
const { getLastBlock } = require("./block");

const initP2PServer = (ws_port) => {
  const server = new WebSocketServer({ port: ws_port });
  server.on("connection", (ws) => {
    initConnection(ws);
  });
  server.on("error", () => {
    console.log("error");
  });
  console.log("Listening webSocket port : " + ws_port);
};

let sockets = [];

const queryLatestMsg = () => {
  return {
    type: MessageType.QUERY_LATEST,
    data: null,
  };
};

const responseLatestMsg = () => {
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN,
    data: JSON.stringify([getLastBlock()]),
  };
};

const initConnection = (ws) => {
  sockets.push(ws);
  initMessageHandler(ws);
  initErrorHandler(ws);
  write(ws, queryLatestMsg());
};

const getSockets = () => {
  return sockets;
};

const connectToPeers = (newPeers) => {
  newPeers.forEach((peer) => {
    const ws = new WebSocket(peer);
    ws.on("open", () => {
      initConnection(ws);
    });
    ws.on("error", (error) => {
      console.log("connetion Failed! " + error);
      return false;
    });
  });
};

const initErrorHandler = (ws) => {
  ws.on("close", () => {
    closeConnection(ws);
  });
  ws.on("error", () => {
    closeConnection(ws);
  });
};

const closeConnection = (ws) => {
  console.log(`Connection close ${ws.url}`);
  sockets.splice(sockets.indexOf(ws), 1);
};

const write = (ws, message) => {
  ws.send(JSON.stringify(message));
};

const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2,
};

const initMessageHandler = (ws) => {
  ws.on("message", (data) => {
    const message = JSON.parse(data);

    if (message === null) {
      return;
    };

    switch (message.type) {
      case MessageType.QUERY_LATEST:
        write(ws, responseLatestMsg());
        break;
      case MessageType.QUERY_ALL:
        console.log("QUERY_ALL");
        console.log(message);
        // 추가 예정
        break;
      case MessageType.RESPONSE_BLOCKCHAIN:
        console.log("RESPONSE_BLOCKCHAIN");
        console.log(message);
        // 추가 예정
        break;
    };
  });
};

module.exports = {
  initP2PServer,
  connectToPeers,
  getSockets,
};