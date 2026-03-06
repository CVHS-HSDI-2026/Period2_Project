import { useState } from "react";
import CommentBox from "./CommentBox";
import RecommendedBox from "./RecomendedBox";
import TracksBox from "./TracksBox";

export default function AlbumTabs() {
  const [tab, setTab] = useState("comments");

  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setTab("comments")}>
          Comments
        </button>

        <button onClick={() => setTab("recommended")}>
          Recommended
        </button>
        <button onClick={() => setTab("tracks")}>
          Tracks
        </button>
      </div>

      <div style={{ border: "1px solid black", height: "200px", marginTop: "10px" }}>
        {tab === "comments" ? <CommentBox /> : tab === "recommended" ? <RecommendedBox /> : <TracksBox />}
      </div>
    </div>
  );
}