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
  const [passwordError, setPasswordError] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [privacy, setPrivacy] = useState("Public"); 
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
//  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved]=useState(false);
  const [isSecure, setIsSecure] = useState<boolean>(true);

  if(!fontsLoaded) return null;

  //save these changes somewhere in the backend???
  const handleSaveChanges = () => {
  if (newPassword !== confirmPassword) {
    setPasswordError("Passwords do not match");
    return;
  }
  setPasswordError("");
  setIsSaved(true);
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

        {/* password reset */}
        <Text style={styles.headings}>Settings</Text>
        <Text style={styles.titles}>Password</Text>
        <Text style={styles.subTitles}>New Password</Text>
        <TextInput
          style={styles.newInput}
          placeholder="Enter new password"
          placeholderTextColor="#aaa"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Text style={styles.subTitles}>Confirm Password</Text>
        <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.newInput}
          secureTextEntry={isSecure}
          placeholder="Re-enter new password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Pressable onPress={() => setIsSecure(!isSecure)} style={styles.eyeInside}>
            <Image
                source={ isSecure ? require("../../assets/open-eye.png") : require("../../assets/closed-eye.png") }
                style={styles.eyes}
                resizeMode="contain"
            />
        </Pressable>
        </View>
        {passwordError !== "" && (
            <Text style={styles.errorText}>{passwordError}</Text>
        )}

        {/* display name */}
        <Text style={styles.titles}>Display Name</Text>
        <Text style={styles.subTitles}>New Display Name</Text>
        <TextInput
          style={styles.newInput}
          placeholder="Enter new display name"
          placeholderTextColor="#aaa"
          value={displayName}
          onChangeText={setDisplayName}
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

        {/* privacy */}
        <Text style={styles.titles}>Privacy</Text>
        <Pressable style={styles.dropdownHeader} onPress={() => setShowPrivacyDropdown(!showPrivacyDropdown)} >
          <Text style={styles.dropdownHeaderText}>{privacy}</Text>
          <Text style={styles.dropdownArrow}>
            {showPrivacyDropdown ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>}
          </Text>
        </Pressable>
        {showPrivacyDropdown && (
          <View style={styles.dropdownContainer}>
            <Pressable style={styles.optionRow} onPress={() => { setPrivacy("Public"); setShowPrivacyDropdown(false); }} >
              <View style={styles.mcCircle}>
                {privacy === "Public" && <View style={styles.selected} />}
              </View>
              <Text style={styles.optionText}>Public</Text>
            </Pressable>
            
            <Pressable style={styles.optionRow} onPress={() => { setPrivacy("Private"); setShowPrivacyDropdown(false); }} >
              <View style={styles.mcCircle}>
                {privacy === "Private" && <View style={styles.selected} />}
              </View>
              <Text style={styles.optionText}>Private</Text>
            </Pressable>
          </View>
        )}
        <Pressable style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Save</Text>
        </Pressable>
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
  }, 

  headings: {
    fontSize: 30,
    color: "#FFFFFF",
    fontFamily: "Jost_500Medium",
    marginTop:7,
    marginBottom:1,
  //  marginLeft: 5,
    
  },

  titles: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "Jost_500Medium",
    marginTop: 3,
    marginBottom: 6,
  //  marginLeft: 5,
    
  },
  subTitles: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Jost_400Regular",
    marginBottom: 6,
    marginLeft: 5,
  },
  newInput: {
    borderWidth: 1,
    borderColor: "#FFFFFF50",
    borderRadius: 8,
    padding: 12,
//    paddingRight: 35,
    color: "#FFFFFF",
    fontFamily: "Jost_400Regular",
    fontSize: 16,
    marginBottom: 15,
  },
  passwordWrapper: {
  position: "relative",
  justifyContent: "center",
  marginBottom: 2,
  },
  eyeInside: {
  position: "absolute",
  right: 15,
  height: "100%",
  justifyContent: "center",
  marginBottom:16,
  
  },
  eyes: {
    height: 20,
    width: 20,
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
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF50",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  dropdownHeaderText: {
    color: "#FFFFFF",
    fontFamily: "Jost_400Regular",
    fontSize: 16,
  },

  dropdownArrow: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 6,
  },

  dropdownContainer: {
    backgroundColor: "#1f2245",
    borderRadius: 8,
    paddingVertical: 8,
    marginBottom: 16,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  optionText: {
    color: "#FFFFFF",
    fontFamily: "Jost_400Regular",
    fontSize: 15,
  },

  mcCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    objectFit: 'contain',
  },
  selected: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "#cfcfe3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    height:35,
    width: "10%",
    borderRadius: 7,
    marginTop: 10,
    borderWidth: 0,
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontFamily: "Jost_500Medium",
    fontSize: 16,
    
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
    fontFamily: "Jost_400Regular",
  }
});
