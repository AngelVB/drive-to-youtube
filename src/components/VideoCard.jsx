import { useState } from "react";
import { useLang } from "../i18n";
import { S } from "../styles";
import { formatBytes } from "../utils";
import { PRIVACY_OPTIONS } from "../constants";
import { VideoThumbnail } from "./VideoThumbnail";

export function VideoCard({ video, isSelected, wasUploaded, meta, history, onToggle, onMetaChange }) {
  const { t, lang } = useLang();
  const [isEditing, setIsEditing] = useState(false);
  const date = new Date(video.createdTime).toLocaleDateString(lang === "es" ? "es-ES" : "en-US");

  const borderColor = isSelected ? "#5a2020" : wasUploaded ? "#1e4a1e" : "#2a2a2a";
  const bgColor     = isSelected ? "#1c0a0a" : wasUploaded ? "#0a140a" : "#141414";

  return (
    <div style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 10, overflow: "hidden" }}>
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" }}
        onClick={onToggle}
      >
        <Checkbox isSelected={isSelected} wasUploaded={wasUploaded} />
        <VideoThumbnail src={video.thumbnailLink} size="full" />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 3 }}>
            {video.name}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: "#777", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span>{formatBytes(video.size)}</span>
            <span>{date}</span>
            {wasUploaded && (
              <a
                href={`https://youtu.be/${history[video.id].ytId}`}
                target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ color: "#4aaa4a", textDecoration: "none", fontWeight: 700 }}
              >
                {t.alreadyUploaded}
              </a>
            )}
          </div>
        </div>

        {isSelected && (
          <button
            onClick={e => { e.stopPropagation(); setIsEditing(v => !v); }}
            style={{ ...S.btnSm, flexShrink: 0, fontSize: 10, padding: "4px 10px" }}
          >
            {isEditing ? t.done : t.edit}
          </button>
        )}
      </div>

      {isSelected && isEditing && (
        <MetaEditor meta={meta} onMetaChange={onMetaChange} t={t} />
      )}
    </div>
  );
}

function Checkbox({ isSelected, wasUploaded }) {
  const borderColor = isSelected ? "#FF3333" : wasUploaded ? "#3a8a3a" : "#444";
  return (
    <div style={{
      width: 16, height: 16, border: `2px solid ${borderColor}`, borderRadius: 4,
      background: isSelected ? "#FF3333" : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      {isSelected && (
        <svg width="8" height="6" viewBox="0 0 8 6">
          <polyline points="1,3 3,5 7,1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function MetaEditor({ meta, onMetaChange, t }) {
  return (
    <div
      style={{ borderTop: "1px solid #222", padding: "10px 12px 10px 38px", background: "#111" }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ marginBottom: 8 }}>
        <label style={S.label}>{t.titleLabel}</label>
        <input
          value={meta?.title || ""}
          onChange={e => onMetaChange({ title: e.target.value })}
          style={{ ...S.input, padding: "7px 10px" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={S.label}>{t.descLabel}</label>
        <textarea
          value={meta?.description || ""}
          onChange={e => onMetaChange({ description: e.target.value })}
          rows={2}
          style={{ ...S.input, padding: "7px 10px", resize: "vertical" }}
        />
      </div>
      <div style={{ display: "flex", gap: 5 }}>
        {PRIVACY_OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => onMetaChange({ privacy: opt })}
            style={{
              padding: "4px 12px", borderRadius: 5,
              border: `1px solid ${meta?.privacy === opt ? "#FF3333" : "#333"}`,
              background: meta?.privacy === opt ? "#2a0808" : "transparent",
              color: meta?.privacy === opt ? "#FF6666" : "#888",
              fontFamily: "monospace", fontSize: 10, cursor: "pointer", textTransform: "capitalize",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
