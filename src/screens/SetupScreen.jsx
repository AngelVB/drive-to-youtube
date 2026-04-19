import { useState } from "react";
import { useLang } from "../i18n";
import { S } from "../styles";
import { AccountCard } from "../components/AccountCard";
import { ErrorBanner } from "../components/ErrorBanner";

export function SetupScreen({
  clientId, setClientId,
  driveToken, ytToken, selectedChannel,
  onConnectDrive, onConnectYT,
  onDisconnectDrive, onDisconnectYT,
  authError, onGoToBrowse,
}) {
  const { t } = useLang();
  const [showHelp, setShowHelp] = useState(false);
  const disabled = !clientId.trim();

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 26, letterSpacing: "-1px", marginBottom: 6 }}>{t.setupTitle}</h1>
      <p style={{ color: "#666", fontFamily: "monospace", fontSize: 11, marginBottom: 22, lineHeight: 1.7 }}>{t.setupSubtitle}</p>

      <button onClick={() => setShowHelp(v => !v)} style={{ ...S.btnSm, marginBottom: 16, padding: "6px 11px", fontSize: 10 }}>
        {showHelp ? "▲" : "▼"} {t.instructions}
      </button>

      {showHelp && (
        <div style={{ background: "#080808", border: "1px solid #121212", borderRadius: 9, padding: "14px 16px", marginBottom: 18, fontFamily: "monospace", fontSize: 10, lineHeight: 2, color: "#4a4a4a" }}>
          {t.instructionSteps.map(([n, text]) => (
            <div key={n} style={{ display: "flex", gap: 7 }}>
              <span style={{ color: "#FF4444" }}>{n}.</span>
              <span>{text}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: "9px 11px", background: "#0d0d0d", borderRadius: 7, lineHeight: 1.8 }}>
            <div style={{ color: "#FF9999" }}>npm run dev</div>
            <div style={{ color: "#555" }}>→ http://localhost:5173</div>
          </div>
        </div>
      )}

      <label style={{ ...S.label, marginBottom: 5 }}>{t.clientIdLabel}</label>
      <input
        value={clientId}
        onChange={e => setClientId(e.target.value)}
        placeholder={t.clientIdPlaceholder}
        style={{ ...S.input, marginBottom: 18 }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
        <AccountCard
          icon="☁"
          label={t.driveLabel}
          desc={driveToken ? t.driveDescConn : t.driveDescIdle}
          isOk={!!driveToken}
          onConnect={onConnectDrive}
          onDisconnect={onDisconnectDrive}
          disabledConnect={disabled}
        />
        <AccountCard
          icon="▶"
          label={t.ytLabel}
          desc={selectedChannel ? selectedChannel.snippet.title : ytToken ? t.ytDescNoChannel : t.ytDescIdle}
          isOk={!!selectedChannel}
          onConnect={onConnectYT}
          onDisconnect={onDisconnectYT}
          disabledConnect={disabled}
        />
      </div>

      <ErrorBanner msg={authError} />

      {driveToken && selectedChannel && (
        <button onClick={onGoToBrowse} style={{ ...S.btnPrimary, borderRadius: 8, padding: "10px 22px", fontSize: 13 }}>
          {t.goToBrowse}
        </button>
      )}
    </div>
  );
}
