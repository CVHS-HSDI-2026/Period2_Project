import SongCard from "../../components/SongCard";

export default function RecommendedBox() {
  return (
    <div style={{ padding: "10px" }}>
      <p>Recommended songs list here</p>
      {Array.from({ length: 5 }).map((_, i) => (
        <SongCard
        key={`popular-${i}`}
        variant="popular"
        title="Title"
        artist="Artist"
        rating={7}
        commentsCount={1284}
        onPress={() => router.push("Song")}
        />
      ))}
    </div>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#E6E8F2",
    fontSize: 18,
    marginBottom: 10,
  },
});
