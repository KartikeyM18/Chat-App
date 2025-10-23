"use client"
import { createRandomString } from "@/controllers/controllers";
import React, { useEffect, useState } from "react";

export const ChatBox = () => {

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        console.log(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
        const newSocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);
        newSocket.onopen = () => {
            console.log('Connection established');
            setSocket(newSocket);
        }
        newSocket.onmessage = (message) => {
            console.log('Message received:', message.data);
            const obj = JSON.parse(message.data);

            if (obj.type === "message") {
                setMessages((m) => [...m, { sender: "other", msg: obj.message }]);
            }
        }
        return () => newSocket.close();
    }, [])

    // useEffect(()=>{},)
    
    const [roomId, setRoomId] = useState("");
    
    const handleCreate = () => {
        const roomId = createRandomString();
        setRoomId(roomId);
        console.log(roomId);
        
        const obj = { type: "create", room: roomId };
        socket?.send(JSON.stringify(obj));
    }
    
    const [roomToJoin, setRoomToJoin] = useState("");
    
    const joinInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomToJoin(e.target.value)
    }
    
    const handleJoin = () => {
        setRoomId(roomToJoin);
        
        const obj = { type: "join", room: roomToJoin };
        socket?.send(JSON.stringify(obj));
    }
    
    interface Msg {
        sender: string;
        msg: string;
    }
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Msg[]>([{ sender: "other", msg: "bruhh" }, { sender: "other", msg: "bruhh" }, { sender: "other", msg: "bruhh" }]);
    
    
    const handleSend = () => {
        if (message == "") return;
        setMessages((m)=>[...m, { sender: "me", msg: message }]);
        setMessage("");
        const obj = { type: "send", room: roomId, message: message };
        socket?.send(JSON.stringify(obj));
    }
    
    if (!socket) return <div>Loading...</div>

    if (!roomId) {
        return (
            <div className="flex flex-col gap-10 border p-20 border-gray-700 rounded-2xl" >
                <button className="border dark:bg-white dark:text-black py-3 px-5 rounded-lg hover:bg-gray-200 transition-all cursor-pointer" onClick={handleCreate}>
                    Create Room
                </button>

                <div className="flex gap-3">
                    <input type="text" placeholder="Enter Room Code" className="border border-gray-800 rounded-md py-2 px-3 " onChange={joinInputHandler} value={roomToJoin} />
                    <button className="border dark:bg-white dark:text-black py-3 px-5 rounded-lg hover:bg-gray-200 transition-all cursor-pointer" onClick={handleJoin}>
                        Join Room
                    </button>
                </div>
            </div>
        )
    }


    return <div className="flex flex-col gap-10 border p-20 border-gray-700 rounded-2xl">

        <div className="flex flex-col gap-5">
            <div className="text-xl">
                Room No: {roomId}
            </div>

            <div className="border border-gray-700 rounded-lg flex flex-col gap-0.5 ">
                {messages.map((m, index) => {
                    return m.sender === "me" ? (
                        <div key={index} className="bg-white text-black text-right rounded-sm self-end px-2">
                            {m.msg}
                        </div>
                    ) : (
                        <div key={index} className="text-left border border-gray-700 self-start rounded-sm px-2">
                            {m.msg}
                        </div>
                    )
                })}
            </div>
        </div>

        <div className="flex gap-3">
            <textarea rows={1} placeholder="Enter message" className="border border-gray-800 rounded-md py-2 px-3 field-sizing-content overflow-y-hidden resize-none min-w-50" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="border dark:bg-white dark:text-black py-2 px-5 rounded-lg hover:bg-gray-200 transition-all cursor-pointer " onClick={handleSend} >
                Send
            </button>
        </div>
    </div>
}
