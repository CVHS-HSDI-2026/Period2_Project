export default function SongInfo() {
  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      
      {/* Album Cover */}
      <div
        style={{
          width: "120px",
          height: "120px",
          backgroundColor: "#ddd"
        }}
      />

      {/* Song Details */}
      <div style={{ display: "grid", gridTemplateColumns: "150px 150px" }}>
        <p>Title:</p>
        <p>Rating: #/10</p>

        <p>Artist:</p>
        <p>Min streamed:</p>

        <p>Album:</p>
        <p>Genre:</p>

        <p>Date:</p>
      </div>
    </div>
  );
}
