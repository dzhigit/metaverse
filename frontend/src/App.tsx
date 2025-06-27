// src/App.tsx
import { useEffect, useState } from "react";
import socket from "./socket";



import { Miner } from "./components/Miner";
import { TotalHashes } from "./components/ShowTotalHashes";

function App() {
const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() !== "") {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  useEffect(() => {
    socket.on("chat message", (message: string) => {
      setMessages((prev) => [...prev, message]);
    });

    // Очистка подписки
    return () => {
      socket.off("chat message");
    };
  }, []);




  return (
    <div className="App">
      <Miner/>
      <TotalHashes/>

         <div>
      <h1>Чат</h1>
      <div style={{ border: "1px solid gray", padding: "10px", height: "200px", overflowY: "scroll" }}>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введите сообщение"
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
    </div>

    
  );
}

export default App;
