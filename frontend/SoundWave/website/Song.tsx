import Header from "codespace/Period2_Project/frontend/SoundWave/components/Header";
import SongInfo from "codespace/Period2_Project/frontend/SoundWave/components/SongInfo";
import SongTabs from "codespace/Period2_Project/frontend/SoundWave/components/SongTabs";

export defult function Song() {
    retun(
        <div>
            <Header />

            <div style={{ padding; "20px"}}>
                <SongInfo />
                <SongTabs />
            </div>
        </div>

    );
}