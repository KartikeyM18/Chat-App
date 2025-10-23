import { WebSocket } from "ws";

interface Room {
    [room: string]: string[];
}

interface User {
    [room: string]: WebSocket[];
}

export class RoomManager {
    // private roomData: Room;
    private users: User;

    constructor() {
        // this.roomData = {};
        this.users = {};
    }

    addUser(socket: WebSocket) {
        socket.on("message", (data) => {
            const msg = JSON.parse(data.toString());

            if (msg.type === "create") {
                // this.roomData[msg.room] = [];
                this.users[msg.room] = [socket];
                
                const obj = { type: "created" };
                socket.send(JSON.stringify(obj));
            }

            if (msg.type === "join") {
                const allUsers = this.users[msg.room] || [];
                this.users[msg.room] = [...allUsers, socket];
                

                const obj = { type: "joined" };
                socket.send(JSON.stringify(obj));
            }

            if (msg.type === "send") {
                // const prevMessages = this.roomData[msg.room];
                // this.roomData[msg.room] = [...prevMessages, msg.message];
                this.users[msg.room].forEach((user) => {
                    
                    if (user != socket) {
                        const obj = { type: "message", message: msg.message };
                        user.send(JSON.stringify(obj));
                    }
                })
            }
        })
    }
}