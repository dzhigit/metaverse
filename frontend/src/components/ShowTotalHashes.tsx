import { useEffect, useState } from "react";

export const TotalHashes = () => {
  const [totalHashes, setTotalHashes] = useState<number | undefined>(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalHashes(window.totalhashes);
    }, 1000); // Обновлять каждую секунду

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      Total hashes: {totalHashes !== undefined ? totalHashes : "Loading..."}
    </div>
  );
};