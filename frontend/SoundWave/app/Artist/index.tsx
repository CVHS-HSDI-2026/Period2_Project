import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import HeaderWithSearch from "../../components/HeaderWithSearch";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFonts, Jost_400Regular, Jost_500Medium, Jost_700Bold } from '@expo-google-fonts/jost';
import SongCard from "../../components/SongCard";
import ArtistCard from "../../components/ArtistCard";

export default function Artist() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({Jost_400Regular, Jost_500Medium, Jost_700Bold});
  
  const params = useLocalSearchParams();
  console.log('Username:', params);
  const rawMbid = params.mbid as string | string[] | undefined;
  const [artist, setArtist] = useState<any>(null);
  
  useEffect(() => {
    const fetchArtist = async (artistMbid: string) => {
      const hosts = ['localhost', '10.0.2.2'];
      for (const host of hosts) {
        try {
          console.log(`Attempting artist fetch via ${host}`);
          const res = await fetch(`http://${host}:5000/api/music/artist/${artistMbid}`);
          if (!res.ok) {
            const text = await res.text();
            console.warn(`Fetch to ${host} failed: ${res.status} ${text}`);
            continue;
          }
          const data = await res.json();
          console.log(`Artist fetch succeeded via ${host}`);
          setArtist(data.local_artist);
          return;
        } catch (err) {
          console.warn(`Fetch to ${host} threw:`, err);
        }
      }
      console.error('All artist fetch attempts failed');
    };
    const fallbackMbid = 'b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d';

    const artistMbid = typeof rawMbid === 'string'
      ? rawMbid
      : Array.isArray(rawMbid)
        ? rawMbid[0]
        : fallbackMbid;

    if (artistMbid) {
      fetchArtist(artistMbid);
    }
  }, [rawMbid]);

  const colone = [
    { columnName: 'Artist:', value: artist?.name || 'Loading...' },
    { columnName: "# followers" },
    { columnName: '# ratings' },
    { columnName: '# comments' },
  ];

  return (
    <View style={styles.container}>
      <HeaderWithSearch title="SoundWAVE" />

      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* profile stats */}
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <View style={styles.avatarPlaceholder} />
          </View>

          <View style={styles.profileRight}>
            <View style={styles.columnsContainer}>
              <View style={styles.column}>
                {colone.map((item, idx) => (
                  <Text style={styles.columnText} key={`col1-${idx}`}>
                    {item.columnName}{item.value ? ` ${item.value}` : ''}
                  </Text>
                ))}
              </View>

              <View style={styles.column} />
            </View>

            <Text style={styles.titleBioText}>Bio:</Text>
            <Text style={styles.biotext}>
              this user does not have a bio yet so this is placeholder text.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec vel sapien eget nunc efficitur efficitur.
            </Text>
          </View>
        </View>

        {/* top songs */}
        <Text style={styles.sectionTitle}>Top Songs:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 10 }).map((_, i) => (
            <SongCard
              key={`song-${i}`}
              variant="popular"
              title="Title"
              artist="Artist"
              rating={8}
              commentsCount={12}
              onPress={() => router.push("./Song")}
            />
          ))}
        </ScrollView>

        {/* top albums */}
        <Text style={styles.sectionTitle}>Top Albums:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 10 }).map((_, i) => (
            <SongCard
              key={`song-${i}`}
              variant="popular"
              title="Title"
              artist="Artist"
              rating={8}
              commentsCount={12}
              onPress={() => router.push("./Song")}
            />
          ))}
        </ScrollView>

        {/* related artists */}
        <Text style={styles.sectionTitle}>Related Artists:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 10 }).map((_, i) => (
            <ArtistCard
              key={`artist-${i}`}
              variant="popular"
              title="Username"
              artist="Artist"
              rating={8}
              commentsCount={1278}
              onPress={() => router.push("./Song")}
            />
          ))}
        </ScrollView>

        {/* recommended users */}
        <Text style={styles.sectionTitle}>Recommended Users:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 10 }).map((_, i) => (
            <ArtistCard
              key={`user-${i}`}
              variant="popular"
              title="Username"
              artist="Artist"
              rating={8}
              commentsCount={12}
              onPress={() => router.push("./Song")}
            />
          ))}
        </ScrollView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181B33',
    alignItems: 'center',
  },
  scrollContent: {
    paddingVertical: 40,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: 1200,
    marginBottom: 40,
  },
  profileLeft: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ffffff20',
    marginLeft: 150,
  },
  profileRight: {
    width: '65%',
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    width: '48%',
  },
  columnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Jost_400Regular',
    paddingVertical: 6,
  },
  titleBioText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Jost_500Medium',
    marginBottom: 8,
  },
  biotext: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Jost_400Regular',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Jost_500Medium',
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginBottom: 16,
    marginTop: 30,
  },
  horizontalContent: {
    flexDirection: 'row',
    gap: 24,
    paddingLeft: 40,
    paddingRight: 20,
    width: '100%',
  },
});