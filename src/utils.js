export function formatBytes(b) {
  const n = parseInt(b);
  if (!n)      return "—";
  if (n < 1e6) return (n / 1e3).toFixed(0) + " KB";
  if (n < 1e9) return (n / 1e6).toFixed(1) + " MB";
  return (n / 1e9).toFixed(2) + " GB";
}
