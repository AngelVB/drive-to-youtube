const DIMS = {
  full:  { width: 112, height: 63 },
  thumb: { width: 72,  height: 40 },
};

export function VideoThumbnail({ src, size = "full" }) {
  const dims = DIMS[size];
  return (
    <div style={{
      ...dims, borderRadius: 6, flexShrink: 0, overflow: "hidden",
      background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {src && (
        <img
          src={src}
          referrerPolicy="no-referrer"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.style.display = "none"; e.target.nextSibling?.style && (e.target.nextSibling.style.display = "flex"); }}
        />
      )}
      <span style={{
        fontSize: size === "full" ? 22 : 16,
        display: src ? "none" : "flex",
        alignItems: "center", justifyContent: "center",
        width: "100%", height: "100%",
      }}>🎬</span>
    </div>
  );
}
