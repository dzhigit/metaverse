import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

function FingerInfo() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    FingerprintJS.load().then((fp) => {
      fp.get().then((res) => {
        setData(res);
        console.log("Fingerprint data:", res);
      });
    });
  }, []);

  if (!data) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Fingerprint</h2>
      <p><strong>ID:</strong> {data.visitorId}</p>
      <h3>Детали:</h3>
      <ul>
        {Object.entries(data.components).map(([key, val]: any) => (
          <li key={key}>
            <strong>{key}:</strong>{" "}
            {JSON.stringify(val.value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FingerInfo;
