export function Spinner() {
  return (
    <div style={{
      width: 7, height: 7,
      border: "1.5px solid #FF4444",
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin .7s linear infinite",
    }} />
  );
}
