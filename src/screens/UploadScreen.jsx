import { useLang } from "../i18n";
import { S } from "../styles";
import { UploadItem } from "../components/UploadItem";

export function UploadScreen({ videos, selected, uploads, meta, uploading, onBack }) {
  const { t } = useLang();
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <h1 style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-.8px" }}>{t.uploadTitle}</h1>
        {!uploading && (
          <button onClick={onBack} style={{ ...S.btnSm, padding: "5px 11px", fontSize: 10 }}>{t.back}</button>
        )}
      </div>
      <p style={{ color: "#666", fontFamily: "monospace", fontSize: 11, marginBottom: 22 }}>
        {uploading ? t.uploading : t.uploadsDone}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {videos.filter(v => selected[v.id]).map(v => (
          <UploadItem key={v.id} video={v} upload={uploads[v.id]} meta={meta[v.id]} />
        ))}
      </div>
    </div>
  );
}
