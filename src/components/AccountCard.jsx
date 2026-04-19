import { useLang } from "../i18n";
import { S } from "../styles";

export function AccountCard({ icon, label, desc, isOk, onConnect, onDisconnect, disabledConnect }) {
  const { t } = useLang();
  return (
    <div style={{
      background: "#141414",
      border: `1px solid ${isOk ? "#1a4a1a" : "#2a2a2a"}`,
      borderRadius: 10, padding: "12px 14px",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: isOk ? "#0f2a0f" : "#1a1a1a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, flexShrink: 0,
      }}>
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 12 }}>{label}</div>
        <div style={{
          fontFamily: "monospace", fontSize: 10,
          color: isOk ? "#5aaa5a" : "#777",
          marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {isOk ? "✓ " : ""}{desc}
        </div>
      </div>

      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
        {isOk && (
          <button onClick={onDisconnect} style={{ ...S.btnSm, color: "#cc5555", borderColor: "#5a2020" }}>
            {t.disconnect}
          </button>
        )}
        <button
          onClick={onConnect}
          disabled={disabledConnect}
          style={{
            background: disabledConnect ? "#0f0f0f" : "#FF0000",
            color: disabledConnect ? "#2a2a2a" : "#fff",
            border: "none", borderRadius: 6, padding: "5px 12px",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11,
            cursor: disabledConnect ? "not-allowed" : "pointer",
          }}
        >
          {isOk ? t.change : t.connect}
        </button>
      </div>
    </div>
  );
}
