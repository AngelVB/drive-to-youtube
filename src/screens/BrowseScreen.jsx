import { useLang } from "../i18n";
import { S } from "../styles";
import { VideoCard } from "../components/VideoCard";
import { ChannelAvatar } from "../components/ChannelAvatar";

export function BrowseScreen({
  videos, selected, history, meta, loading, selectedChannel,
  onToggle, onSelectAll, onSelectNone, onSelectNotUploaded,
  onEditMeta, onStartUploads, onChangeChannel,
}) {
  const { t } = useLang();
  const selCount    = Object.values(selected).filter(Boolean).length;
  const allSelected = videos.length > 0 && videos.every(v => selected[v.id]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-.8px", marginBottom: 3 }}>{t.browseTitle}</h1>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: "#333" }}>
            {loading ? t.loading : t.videosFound(videos.length, selCount)}
          </div>
          {selectedChannel && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
              <ChannelAvatar channel={selectedChannel} size={15} />
              <span style={{ fontFamily: "monospace", fontSize: 9, color: "#2e2e2e" }}>{selectedChannel.snippet.title}</span>
              <button onClick={onChangeChannel} style={{ ...S.btnSm, padding: "1px 5px", fontSize: 8 }}>{t.changeChannel}</button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
          {!loading && videos.length > 0 && (
            <>
              <button onClick={onSelectNotUploaded} style={S.btnSm}>{t.notUploaded}</button>
              <button onClick={allSelected ? onSelectNone : onSelectAll} style={S.btnSm}>
                {allSelected ? t.selectNone : t.selectAll}
              </button>
            </>
          )}
          {selCount > 0 && (
            <button onClick={onStartUploads} style={{ ...S.btnPrimary, padding: "7px 14px", fontSize: 11, borderRadius: 6 }}>
              {t.upload(selCount)}
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 48, color: "#222", fontFamily: "monospace", fontSize: 11, animation: "pulse 1.4s infinite" }}>
          {t.loading}
        </div>
      )}
      {!loading && videos.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: "#1e1e1e", fontFamily: "monospace", fontSize: 11 }}>
          {t.noVideos}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {videos.map(v => (
          <VideoCard
            key={v.id}
            video={v}
            isSelected={!!selected[v.id]}
            wasUploaded={!!history[v.id]}
            meta={meta[v.id]}
            history={history}
            onToggle={() => onToggle(v.id)}
            onMetaChange={patch => onEditMeta(v.id, patch)}
          />
        ))}
      </div>

      {!loading && selCount > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "12px 22px", background: "rgba(10,10,10,.97)",
          borderTop: "1px solid #2a2a2a",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#888" }}>{t.uploadBar(selCount)}</span>
          <button onClick={onStartUploads} style={S.btnPrimary}>{t.uploadToYT}</button>
        </div>
      )}
    </div>
  );
}
