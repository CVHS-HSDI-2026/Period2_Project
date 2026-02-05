import Header from "../components/Header";
import SongInfo from "../components/SongInfo";
import SongTabs from "../components/SongTabs";


export default function Song() {
    return (
        <div>
            <Header title="SoundWave" />

            <div style={{ padding: "20px" }}>
                <SongInfo />
                <SongTabs />
            </div>
        </div>
    );
}
