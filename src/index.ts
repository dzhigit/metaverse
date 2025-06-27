import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // разрешаем фронтенду подключаться
  },
});

const PORT = 3000;

const buildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(buildPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


//app.use(express.static(path.join(__dirname, '../public')));
/*
// Маршрут для проверки
app.get('/', (_req, res) => {
  res.send('🚀 Сервер работает с Socket.IO!');
});
*/
// Обработка подключения
io.on('connection', (socket) => {
  console.log(`📡 Клиент подключён: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Клиент отключён: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Socket.IO сервер: http://localhost:${PORT}`);
});
