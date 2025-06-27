// src/App.tsx
import { useEffect, useState } from "react";
import socket from "./socket";



import { Miner } from "./components/Miner";
import { TotalHashes } from "./components/ShowTotalHashes";

function App() {

const [message, setMessage] = useState("");

  const sendMessage = () => {
    socket.emit("chat message", { text: message });
    setMessage(""); // очистим поле
  };


  useEffect(() => {
    // Получаем сообщения от сервера
    socket.on("chat message", (data) => {
      console.log("С сервера:", data);
    });

    // Очистка подписки при размонтировании
    return () => {
      socket.off("chat message");
    };
  }, []);





  return (
    <div className="App">
      <Miner/>
      <TotalHashes/>

        <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Напиши сообщение"
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>

    
  );
}

export default App;
