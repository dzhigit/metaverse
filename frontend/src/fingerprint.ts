import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Получить deviceId как асинхронную функцию
export async function getFingerprint(): Promise<string> {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId; // Это и есть уникальный deviceId
}