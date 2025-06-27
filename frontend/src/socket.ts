// src/socket.ts
import { io } from "socket.io-client";

// Укажи адрес своего бэкенда
const socket = io("http://localhost:3000");

export default socket;