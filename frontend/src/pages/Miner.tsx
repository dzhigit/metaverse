// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { Miner } from "../components/Miner";
import { TotalHashes } from "../components/ShowTotalHashes";
import socket from "../socket";
import { getFingerprint } from "../fingerprint";



export default function HomePage() {
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

    return () => {
      socket.off("chat message");
    };
  }, []);

  return (
    <div className="App">
      <Miner />
      <TotalHashes />
      
      <h1>Ваш Fingerprint: {fingerprint}</h1>
    </div>
  );
}
