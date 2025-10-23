import { WebSocketServer } from "ws";
import { RoomManager } from "./RoomManager";

const wss = new WebSocketServer({port: 8081});

const roomManager = new RoomManager();

wss.on("connection", (ws)=>{
    ws.on("error", console.error);

    const interval = setInterval(() => {
        ws.ping();
    }, 30000); // Every 30 seconds

    roomManager.addUser(ws);

})
