import { useEffect, useState } from "react";

export const TotalHashes = () => {
  const [totalHashes, setTotalHashes] = useState<number | undefined>(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalHashes(window.totalhashes);
    }, 1000); // Обновлять каждую секунду

    return () => clearInterval(interval);
  }, []);


const getStatus = () => {
  if (totalHashes === undefined) return 'Loading...';
  if (totalHashes === 0) return 'Waiting...';
  return 'Running';
};


  return (
    <div>
      Total hashes: {totalHashes !== undefined ? totalHashes : "Loading..."} <br />
    Status: <strong>{getStatus()}</strong>
    </div>
  );
};

