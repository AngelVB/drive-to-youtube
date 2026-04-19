import { useLang } from "../i18n";
import { S } from "../styles";
import { ChannelAvatar } from "../components/ChannelAvatar";
import { ErrorBanner } from "../components/ErrorBanner";

export function ChannelScreen({ channels, selectedChannel, onSelect, onBack, authError }) {
  const { t } = useLang();
  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-.8px", marginBottom: 5 }}>{t.channelTitle}</h1>
      <p style={{ color: "#3a3a3a", fontFamily: "monospace", fontSize: 11, marginBottom: 20 }}>{t.channelSubtitle}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
        {channels.map(ch => {
          const isActive = selectedChannel?.id === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => onSelect(ch)}
              style={{
                display: "flex", alignItems: "center", gap: 11,
                background: isActive ? "#0a1a0a" : "#070707",
                border: `1px solid ${isActive ? "#1a4a1a" : "#111"}`,
                borderRadius: 9, padding: "11px 13px",
                cursor: "pointer", textAlign: "left", width: "100%",
              }}
            >
              <ChannelAvatar channel={ch} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#e8e8e8", fontWeight: 700, fontSize: 13 }}>{ch.snippet.title}</div>
                <div style={{ color: "#2a2a2a", fontFamily: "monospace", fontSize: 9, marginTop: 1 }}>{ch.id}</div>
              </div>
              {isActive && <span style={{ color: "#3a8a3a", fontSize: 12 }}>✓</span>}
            </button>
          );
        })}
      </div>

      <ErrorBanner msg={authError} />
      <button onClick={onBack} style={{ ...S.btnSm, padding: "6px 11px", fontSize: 10 }}>{t.back}</button>
    </div>
  );
}
