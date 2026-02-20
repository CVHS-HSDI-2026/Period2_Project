import { StyleSheet, Text, View, Pressable, ScrollView, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import HeaderWithSearch from "../../components/HeaderWithSearch";
import { useRouter } from "expo-router";
import { useFonts, Jost_400Regular, Jost_500Medium, Jost_700Bold } from '@expo-google-fonts/jost'; 

export default function Settings(){
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Jost_400Regular, Jost_500Medium, Jost_700Bold });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [privacy, setPrivacy] = useState<"Public" | "Private">("Public");
  const [isEditing, setIsEditing] = useState(false);
  const [isSecure, setIsSecure] = useState<boolean>(true);

  if(!fontsLoaded) return null;

  //save these changes somewhere in the backend???
  const handleSaveChanges = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsEditing(false);
    alert("Settings updated!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <View style={styles.container}>
        <HeaderWithSearch title="SoundWAVE" />
      <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent}>
        
        {/* back arrow */}
        <Pressable onPress={() => router.back()}>
          <Image
            source= {require('../../assets/chevron-right.png')}
            style={styles.backArrow}
            resizeMode="contain"
          />
        </Pressable>

        {/* edit save buttons */}
        <View style={styles.editButtonsRow}>
          {isEditing ? (
            <>
              <Pressable onPress={handleSaveChanges}>
                <Text style={styles.edit}>Save</Text>
              </Pressable>
              <Pressable onPress={handleCancel}>
                <Text style={styles.edit}>✕ Cancel</Text>
              </Pressable>
            </>
          ) : (
            <Pressable onPress={() => setIsEditing(true)}>
              <Text style={styles.edit}>Edit ✎</Text>
            </Pressable>
          )}
        </View>

        {/* password reset */}
        <Text style={styles.titles}>Password</Text>
        <Text style={styles.subTitles}>New Password</Text>
        <TextInput
          style={styles.newPasInput}
          secureTextEntry
          placeholder="Enter new password"
          placeholderTextColor="#aaa"
          value={newPassword}
          onChangeText={setNewPassword}
          editable={isEditing}
        />
        <Text style={styles.subTitles}>Confirm Password</Text>
        <TextInput
          style={styles.newPasInput}
          secureTextEntry={isSecure}
          placeholder="Re-enter new password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={isEditing}
        />
        <Pressable onPress={() => setIsSecure(!isSecure)}>
            <Image
                source={ isSecure ? require("../../assets/open-eye.png") : require("../../assets/closed-eye.png") }
                style={styles.eyes}
            />
        </Pressable>

        {/* display name */}
        <Text style={styles.titles}>Display Name</Text>
        <Text style={styles.subTitles}>New Display Name</Text>
        <TextInput
          style={styles.newPasInput}
          placeholder="Enter new display name"
          placeholderTextColor="#aaa"
          value={displayName}
          onChangeText={setDisplayName}
          editable={isEditing}
        />

        {/* account */}
        <Text style={styles.titles}>Account</Text>
        <View style={styles.accountBox}>
          <Pressable style={styles.deleteRow}>
            <View style={styles.deleteContent}>
              <Text style={styles.deleteText}>Delete Account</Text> 
              <Image
                source= {require('../../assets/Delete.png')}
                style={styles.delete}
                resizeMode="contain"
              />  
            </View>

          </Pressable>

          <Pressable style={styles.logoutRow}>
            <View style={styles.logoutContent}>
                <Text style={styles.logoutText}>Log Out</Text>
                <Image
                  source= {require('../../assets/logout.png')}
                  style={styles.logout}
                  resizeMode="contain"
                />
            </View>

          </Pressable>
        </View>  

        {/* Linked Music Apps */}


        {/* privacy */}
        <Text style={styles.titles}>Privacy</Text>
        <View style={styles.privacyRow}>
          <Pressable onPress={() => isEditing && setPrivacy("Public")}>
            <Text style={privacy === "Public" ? styles.selected : styles.option}>
              Public
            </Text>
          </Pressable>
          <Pressable onPress={() => isEditing && setPrivacy("Private")}>
            <Text style={privacy === "Private" ? styles.selected : styles.option}>
              Private
            </Text>
          </Pressable>
        </View>  

      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181B33",
    alignItems: "center",
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 10,
    width: "90%",
    maxWidth: 1200,
    marginLeft: 20,
  },
  backArrow: {
    width: 20,
    height: 20,
    marginBottom: 20,
  }, 

  editButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  edit: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Jost_400Regular",
    marginLeft: 12,
  },
  titles: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "Jost_500Medium",
    marginVertical: 10,
  //  marginLeft: 5,
    
  },
  subTitles: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Jost_400Regular",
    marginBottom: 6,
    marginLeft: 5,
  },
  newPasInput: {
    borderWidth: 1,
    borderColor: "#FFFFFF50",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontFamily: "Jost_400Regular",
    fontSize: 16,
    marginBottom: 16,
  },
  accountBox: {
    backgroundColor: "#cfcfe3",
    borderRadius: 8,
    padding: 14,
    marginVertical: 10,
  },
  deleteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  deleteContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    color: "red",
    fontFamily: "Jost_500Medium",
    fontSize: 16,
    marginRight: 10,
    
  },
  delete: {
    width: 20,
    height: 20,
  },
  logoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: "Jost_500Medium",
    fontSize: 16,
    marginRight: 10,
  },
  logout: {
    width: 20,
    height: 20,
  },
  privacyRow: {
    flexDirection: "row",
    marginTop: 12,
    marginLeft: 10,
  },
  option: {
    fontFamily: "Jost_400Regular",
    fontSize: 16,
    color: "#FFFFFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 20,
  },
  selected: {
    fontFamily: "Jost_700Bold",
    fontSize: 16,
    color: "#0099ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  eyes: {
    height: 10,
    width: 10,
  }
});