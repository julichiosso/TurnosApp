interface Props {
  active: boolean;
  onChange: () => void;
}

export default function Toggle({ active, onChange }: Props) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: active ? "#e63946" : "#2a2a2a",
        position: "relative", cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute", top: 3,
          left: active ? 22 : 3,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff",
          transition: "left 0.18s",
        }}
      />
    </div>
  );
}
