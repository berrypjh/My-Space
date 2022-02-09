const WebSocket = require("ws");
const { WebSocketServer } = require("ws");

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

const initConnection = (ws) => {
  sockets.push(ws);
  initErrorHandler(ws);
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

module.exports = {
  initP2PServer,
  connectToPeers,
  getSockets,
};