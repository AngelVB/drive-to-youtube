import { useLang } from "../i18n";
import { Spinner } from "./Spinner";
import { VideoThumbnail } from "./VideoThumbnail";

export function UploadItem({ video, upload, meta }) {
  const { t } = useLang();

  const isDone   = upload?.status === "done";
  const isErr    = upload?.status === "error";
  const isDown   = upload?.status === "downloading";
  const isUp     = upload?.status === "uploading";
  const isActive = isDown || isUp;

  const statusText = isDone    ? t.statusDone
    : isErr    ? upload.msg
    : isDown   ? t.statusDownloading
    : isUp     ? t.statusUploading(upload.progress)
    :             t.statusQueued;

  const iconColor = isDone ? "#3a8a3a" : isErr ? "#8a3a3a" : isActive ? "#FF4444" : "#444";

  return (
    <div style={{
      background: isDone ? "#0a1a0a" : isErr ? "#1a0a0a" : "#141414",
      border: `1px solid ${isDone ? "#1e5a1e" : isErr ? "#5a1e1e" : "#2a2a2a"}`,
      borderRadius: 10, padding: "12px 14px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isActive ? 10 : 0 }}>
        <VideoThumbnail src={video.thumbnailLink} size="thumb" />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 3 }}>
            {meta?.title || video.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              border: `1.5px solid ${iconColor}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 9,
            }}>
              {isDone   ? <span style={{ color: "#5aaa5a" }}>✓</span>
               : isErr  ? <span style={{ color: "#aa5a5a" }}>✗</span>
               : isActive ? <Spinner />
               : <span style={{ color: "#444" }}>○</span>}
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: isDone ? "#5aaa5a" : isErr ? "#aa5a5a" : "#777" }}>
              {statusText}
            </span>
          </div>
        </div>

        {isDone && (
          <a href={upload.url} target="_blank" rel="noreferrer" style={{
            background: "#FF3333", color: "#fff", textDecoration: "none",
            borderRadius: 6, padding: "5px 12px",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, flexShrink: 0,
          }}>
            {t.watchOnYT}
          </a>
        )}
      </div>

      {isActive && (
        <div style={{ height: 3, background: "#222", borderRadius: 2, marginTop: 2 }}>
          <div style={{
            height: "100%",
            width: `${Math.max(upload?.progress || 0, 2)}%`,
            background: "#FF3333", borderRadius: 2, transition: "width .4s ease",
          }} />
        </div>
      )}
    </div>
  );
}
