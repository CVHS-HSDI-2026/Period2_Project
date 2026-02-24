import SongCard from "../components/SongCard";
import { useRouter } from 'expo-router';

export default function RecommendedBox() {
  const router = useRouter();
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
        onPress={() => router.push("/Song")}
        />
      ))}
    </div>
  );
}

