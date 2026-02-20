import { useState } from "react";
import CommentBox from "./CommentBox";
import RecommendedBox from "./RecomendedBox";

export default function SongTabs() {
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
      </div>

      <div style={{ border: "1px solid black", height: "200px", marginTop: "10px" }}>
        {tab === "comments" ? <CommentBox /> : <RecommendedBox />}
      </div>
    </div>
  );
}
