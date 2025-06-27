
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import NewPage from './pages/NewPage';

// src/App.tsx
import { useEffect, useState } from "react";
import socket from "./socket";

 

import { Miner } from "./components/Miner";
import { TotalHashes } from "./components/ShowTotalHashes";
import { getFingerprint } from "./fingerprint";

function App() {
const [messages, setMessages] = useState<string[]>([]);
const [fingerprint, setFingerprint] = useState<string | null>(null);
const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() !== "") {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  useEffect(() => {

     getFingerprint().then((fp) => {
      setFingerprint(fp);

      // Отправим инфу на сервер
      socket.emit("clientInfo", {
        deviceId: fp,
        cores: navigator.hardwareConcurrency,
        lang: navigator.language,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    });
    
    socket.on("chat message", (message: string) => {
      setMessages((prev) => [...prev, message]);
    });

    // Очистка подписки
    return () => {
      socket.off("chat message");
    };
  }, []);




  return (
<>
      <Router>
      <Routes>

        <Route path="/new" element={<NewPage />} />
        
      </Routes>
    </Router>


    <div className="App">
      <Miner/>
      <TotalHashes/>
      <h1>Ваш Fingerprint: {fingerprint}</h1>
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

</>    
  );
}

export default App;
