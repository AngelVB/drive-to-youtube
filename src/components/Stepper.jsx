export function Stepper({ step, steps, canNav, onNav }) {
  const activeIdx = steps.findIndex(([s]) => s === step);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {steps.map(([s, label], i) => {
        const active    = step === s;
        const done      = activeIdx > i;
        const clickable = canNav(s) && !active;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <button
              onClick={() => clickable && onNav(s)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "none", border: "none",
                cursor: clickable ? "pointer" : "default",
                padding: "2px 4px", borderRadius: 4,
                opacity: done || active ? 1 : 0.4,
              }}
            >
              <div style={{
                width: 15, height: 15, borderRadius: "50%",
                border: `1.5px solid ${active ? "#FF0000" : done ? "#666" : "#333"}`,
                background: active ? "#FF0000" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 7, fontFamily: "monospace",
                color: active ? "#fff" : "#888", flexShrink: 0,
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 9, fontFamily: "monospace",
                color: active ? "#ccc" : done ? "#777" : "#444",
                textTransform: "uppercase", letterSpacing: ".5px",
              }}>
                {label}
              </span>
            </button>
            {i < steps.length - 1 && <div style={{ width: 10, height: 1, background: "#222" }} />}
          </div>
        );
      })}
    </div>
  );
}
