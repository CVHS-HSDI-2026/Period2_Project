import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import React, { FC } from 'react';
import HeaderWithSearch from "../../components/HeaderWithSearch";
import { useRouter } from "expo-router";
import { useFonts, Jost_400Regular, Jost_500Medium, Jost_700Bold } from '@expo-google-fonts/jost'; 
import SongCard from "../../components/SongCard";
import ArtistCard from "../../components/ArtistCard";

export default function Profile() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({ Jost_400Regular, Jost_500Medium, Jost_700Bold });

  const colone = [
    { columnName: 'Username:', value: 'get from database' },
    { columnName: "# followers" },
    { columnName: '# ratings' },
  ];
  const coltwo = [
    { columnName: 'Display Name:', value: 'get from database' },
    { columnName: '# following' },
    { columnName: '# comments' },
  ];

  return (
    <View style={styles.container}>
      <HeaderWithSearch title="SoundWAVE" />
      <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent}>

        {/* profile stats */}
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <View style={styles.avatarPlaceholder} />
          </View>

          <View style={styles.profileRight}>
            <Text style={styles.edit}>Edit ✎</Text>
            <View style={styles.columnsContainer}>
              <View style={styles.column}>
                {colone.map((item, idx) => (
                  <Text style={styles.columnText} key={`col1-${idx}`}>
                    {item.columnName}{item.value ? ` ${item.value}` : ''}
                  </Text>
                ))}
              </View>
              <View style={styles.column}>
                {coltwo.map((item, idx) => (
                  <Text style={styles.columnText} key={`col2-${idx}`}>
                    {item.columnName}{item.value ? ` ${item.value}` : ''}
                  </Text>
                ))}
              </View>
            </View>
            <Text style={styles.titleBioText}>Bio:</Text>
            <Text style={styles.biotext}>this user does not have a bio yet so this is placeholder text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur efficitur. Sed at ligula a enim efficitur commodo. Donec in felis ut nisl convallis tincidunt. Nulla facilisi. Donec ac odio a metus efficitur fermentum. In hac habitasse platea dictumst.</Text>
          </View>
        </View>

        {/* top songs */}
        <Text style={styles.sectionTitle}>Top Songs:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 5 }).map((_, i) => (
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
          {Array.from({ length: 5 }).map((_, i) => (
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
        {/* top artists */}
        <Text style={styles.sectionTitle}>Top Artists:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 5 }).map((_, i) => (
            <ArtistCard
              key={`song-${i}`}
              variant="popular"
              title="Username"
              artist="Artist"
              rating={8}
              commentsCount={1278}
              onPress={() => router.push("./Song")}
            />
          ))}
        </ScrollView>
        {/* recent activity */}
        <Text style={styles.sectionTitle}>Recent Activity:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 5 }).map((_, i) => (
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
        {/* recommended users */}
        <Text style={styles.sectionTitle}>Recommended Users:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 5 }).map((_, i) => (
            <ArtistCard
              key={`song-${i}`}
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
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 60,
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
  },
  profileRight: {
    width: '65%',
  },
  edit: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Jost_400Regular',
    alignSelf: 'flex-end',
    marginBottom: 10,
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
    marginLeft: -20,
    marginBottom: 20,
    marginTop: 30,
  },
  horizontalContent: {
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 20,
  },
});
