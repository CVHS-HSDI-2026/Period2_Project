import { StyleSheet, Text, View, Pressable, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import HeaderWithSearch from "../../components/HeaderWithSearch";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFonts, Jost_400Regular, Jost_500Medium, Jost_700Bold } from '@expo-google-fonts/jost'; 
import SongCard from "../../components/SongCard";
import ArtistCard from "../../components/ArtistCard";
import FollowPopUp from "../../components/FollowingPopUp";

export default function Profile() {

  const router = useRouter();
  const { isOwner } = useLocalSearchParams();
  const isProfileOwner = isOwner === "true";

  const [fontsLoaded] = useFonts({ Jost_400Regular, Jost_500Medium, Jost_700Bold });

  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [displayName, setDisplayName] = useState('get from database');
  const [bio, setBio] = useState('this user does not have a bio yet so this is placeholder text.');

  const [showFollowPopUp, setShowFollowPopUp] = useState(false);
  const [activeTab, setActiveTab] = useState("following");

  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);
  const toggleFollow = () => setIsFollowing(!isFollowing);

  const openFollowers = () => {
    setActiveTab("followers");
    setShowFollowPopUp(true);
  };

  const openFollowing = () => {
    setActiveTab("following");
    setShowFollowPopUp(true);
  };

  const colone = isProfileOwner
    ? [
        { columnName: 'Username:', value: 'get from database' },
        { columnName: '# followers', clickable: true, action: openFollowers },
        { columnName: '# ratings' },
      ]
    : [
        { columnName: 'Display Name:', value: displayName },
        { columnName: '# followers', clickable: true, action: openFollowers },
        { columnName: '# ratings' },
      ];

  const coltwo = isProfileOwner
    ? [
        { columnName: 'Display Name:', value: displayName },
        { columnName: '# following', clickable: true, action: openFollowing },
        { columnName: '# comments' },
      ]
    : [
        { columnName: ' ', value: ' ' },
        { columnName: '# following', clickable: true, action: openFollowing },
        { columnName: '# comments' },
      ];

  return (
    <View style={styles.container}>

      <HeaderWithSearch title="SoundWAVE" />

      <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.profileSection}>

          <View style={styles.profileLeft}>
            <View style={styles.avatarPlaceholder} />
          </View>

          <View style={styles.profileRight}>

            {/* Edit / Follow button */}

            {isProfileOwner ? (
              isEditing ? (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                  <Pressable onPress={handleSave}>
                    <Text style={styles.edit}>Save</Text>
                  </Pressable>
                  <Pressable onPress={handleCancel}>
                    <Text style={styles.edit}>Cancel</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable onPress={() => setIsEditing(true)}>
                  <Text style={styles.edit}>Edit</Text>
                </Pressable>
              )
            ) : (
              <Pressable onPress={toggleFollow}>
                <View style={styles.buttonBack}>
                  <Text style={styles.buttonText}>
                    {isFollowing ? "Requested" : "Follow"}
                  </Text>
                </View>
              </Pressable>
            )}

            {/* Columns */}

            <View style={styles.columnsContainer}>

              <View style={styles.column}>
                {colone.map((item, idx) => {

                  if (item.clickable) {
                    return (
                      <Pressable key={`col1-${idx}`} onPress={item.action}>
                        <Text style={styles.columnText}>{item.columnName}</Text>
                      </Pressable>
                    );
                  }

                  return (
                    <Text style={styles.columnText} key={`col1-${idx}`}>
                      {item.columnName}{item.value ? ` ${item.value}` : ''}
                    </Text>
                  );
                })}
              </View>

              <View style={styles.column}>
                {coltwo.map((item, idx) => {

                  if (item.clickable) {
                    return (
                      <Pressable key={`col2-${idx}`} onPress={item.action}>
                        <Text style={styles.columnText}>{item.columnName}</Text>
                      </Pressable>
                    );
                  }

                  if (item.columnName === 'Display Name:' && isEditing && isProfileOwner) {
                    return (
                      <View key={`col2-${idx}`} style={styles.inlineEditRow}>
                        <Text style={styles.columnText}>{item.columnName} </Text>
                        <TextInput
                          style={[styles.inputInline, { flex: 1 }]}
                          value={displayName}
                          onChangeText={setDisplayName}
                          placeholder="Enter display name"
                          placeholderTextColor="#aaa"
                        />
                      </View>
                    );
                  }

                  return (
                    <Text style={styles.columnText} key={`col2-${idx}`}>
                      {item.columnName}{item.value ? ` ${item.value}` : ''}
                    </Text>
                  );
                })}
              </View>

            </View>

            {/* Bio */}

            <Text style={styles.titleBioText}>Bio:</Text>

            {isEditing && isProfileOwner ? (
              <TextInput
                style={[styles.biotext, styles.input, { height: 100 }]}
                multiline
                value={bio}
                onChangeText={setBio}
              />
            ) : (
              <Text style={styles.biotext}>{bio}</Text>
            )}

          </View>
        </View>

        {/* Top Songs */}

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

        {/* Top Albums */}

        <Text style={styles.sectionTitle}>Top Albums:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 10 }).map((_, i) => (
            <SongCard
              key={`album-${i}`}
              variant="popular"
              title="Title"
              artist="Artist"
              rating={8}
              commentsCount={12}
              onPress={() => router.push("./Song")}
            />
          ))}
        </ScrollView>

        {/* Top Artists */}

        <Text style={styles.sectionTitle}>Top Artists:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 10 }).map((_, i) => (
            <ArtistCard
              key={`artist-${i}`}
              variant="popular"
              title="Username"
              artist="Artist"
              rating={8}
              commentsCount={1278}
              onPress={() => router.push({ pathname: "/Artist", params: { mbid: "e370a2f1-678f-4ed4-b31c-3b09224422e6"}})}
            />
          ))}
        </ScrollView>

        {/* Recommended Users */}

        <Text style={styles.sectionTitle}>Recommended Users:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {Array.from({ length: 10 }).map((_, i) => (
            <ArtistCard
              key={`rec-${i}`}
              variant="popular"
              title="Username"
              artist="Artist"
              rating={8}
              commentsCount={12}
              onPress={() =>
                router.push({
                  pathname: "./Profile",
                  params: { isOwner: "false" }
                })
              }
            />
          ))}
        </ScrollView>

      </ScrollView>

      {/* Follow modal */}

      <FollowPopUp
        visible={showFollowPopUp}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={() => setShowFollowPopUp(false)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14172B',
    alignItems: 'center',
  },

  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: 1200,
    marginBottom: 40,
  },

  profileLeft: {
    width: '35%',
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

  input: {
    borderWidth: 1,
    borderColor: '#FFFFFF50',
    borderRadius: 8,
    padding: 8,
    color: '#FFFFFF',
    fontFamily: 'Jost_400Regular',
    fontSize: 16,
    marginTop: 4,
  },

  scrollContent: {
    paddingVertical: 40,
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

  inlineEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },

  inputInline: {
    borderBottomWidth: 1,
    borderColor: '#FFFFFF50',
    color: '#FFFFFF',
    fontFamily: 'Jost_400Regular',
    fontSize: 18,
    paddingVertical: 2,
    marginLeft: 4,
  },

  buttonBack: {
    width: 80,
    height: 25,
    borderRadius: 6,
    backgroundColor: '#9AA2D6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },

  buttonText: {
    fontSize: 14,
    color: '#14172B',
    fontFamily: 'Jost_400Regular',
    alignSelf: 'center',
    userSelect: 'none',
  },

});