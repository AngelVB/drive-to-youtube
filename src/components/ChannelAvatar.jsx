export function ChannelAvatar({ channel, size = 15 }) {
  const thumb = channel?.snippet?.thumbnails?.default?.url;
  if (thumb) {
    return (
      <img src={thumb} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "#FF0000",
      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: Math.round(size * 0.5),
    }}>
      YT
    </div>
  );
}
