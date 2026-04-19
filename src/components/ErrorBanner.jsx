export function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: "#110505", border: "1px solid #2a0a0a", borderRadius: 7,
      padding: "9px 12px", marginBottom: 12,
      fontFamily: "monospace", fontSize: 11, color: "#FF7777", lineHeight: 1.6,
    }}>
      ⚠ {msg}
    </div>
  );
}
