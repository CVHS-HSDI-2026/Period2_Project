import { StyleSheet, Text, View, Pressable,ScrollView } from 'react-native';
import React, { FC } from 'react';
import Header from '../components/Header';
import { useRouter } from "expo-router";
//import {editSymbol} from '../assets/edit.png';
import { useFonts, Jost_400Regular, Jost_500Medium, Jost_700Bold } from '@expo-google-fonts/jost';
import SongCard from "../components/SongCard";


export default function Profile() {
    const router = useRouter(); // for navigation, not currently used
    // profile stats
    const colone = [
        {columnName: 'Username:', value: 'get from database'}, 
        {columnName: "# followers"},
        {columnName: '# ratings'},
    ];
    const coltwo = [
        {columnName: 'Display Name:', value: 'get from database'}, 
        {columnName: '# following'},
        {columnName: '# comments'},
    ];

    const [fontsLoaded] = useFonts({ Jost_400Regular, Jost_500Medium, Jost_700Bold });

return (  
    <View style={styles.container}>
    <Header title="SoundWAVE"/> {/*replace with header*/}
    <Text style={styles.edit}>Edit</Text>
    {/* profile stats*/}
    <View style={{width: '70%', marginTop: 40, alignSelf: 'flex-end'}}>
        <View style={styles.columnsContainer}> {/* container that has two columns side-by-side */}
            <View style={[styles.column, {marginRight: 6}]}> 
                {colone.map((item, idx) => (
                    <Text style={styles.columnText} key={`col1-${idx}`}>{item.columnName}{item.value ? ` ${item.value}` : ''}</Text>
                ))}
            </View>
            <View style={styles.column}>
                {coltwo.map((item, idx) => (
                    <Text style={styles.columnText} key={`col2-${idx}`}>{item.columnName}{item.value ? ` ${item.value}` : ''}</Text>
                ))}
            </View>
        </View>   
    </View>
    {/* end of profile stats */} 

    <Text style={styles.bioText}>Bio:</Text>
    {/* <Text style={styles.biotext}>this user does not have a bio yet so this is placeholder text. Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. Mr. Dursley made drills. He was a big, beefy man with hardly any neck, although he did have a very large moustache.</Text> */}
    <Text style={styles.buttonText}>Popular:</Text>

    <ScrollView showsVerticalScrollIndicator>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={styles.horizontalContent}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <SongCard
              key={`popular-${i}`}
              variant="popular"
              title="Title"
              artist="Artist"
              rating={7}
              commentsCount={1284}
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
  // not currently used
  button: {
    backgroundColor: '#BDBDBD',
  },
  // not currently used
  rowContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  // text style for buttons and labels
  bioText: {
    fontSize: 20,
    paddingVertical: 20,
    paddingLeft: 385,
    color: '#FFFFFF',
    fontFamily: 'Jost_400Regular',
    alignSelf: 'flex-start',
  },
    buttonText: {
    fontSize: 20,
    paddingVertical: 20,
    paddingLeft: 20,
    color: '#FFFFFF',
    fontFamily: 'Jost_400Regular',
    alignSelf: 'flex-start',
  },
  // column container arranged side by side
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  // how to shrink width between the columns
  column: {
    width: '48%',
  },
  // text style for items inside columns
  columnText: {
    fontSize: 18,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontFamily: 'Jost_400Regular',
  },
  // text style for edit button
  edit:{
    fontSize: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontFamily: 'Jost_400Regular',
    alignSelf: 'flex-end',
    marginRight: 50,
    marginTop: 20,
  },
  biotext:{
    fontSize: 16,
    paddingVertical: 5,
    color: '#FFFFFF',
    fontFamily: 'Jost_400Regular',
    paddingRight:50,
    alignSelf: 'flex-start',
    paddingLeft: 385,
  
  },
  // title style not currently used
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontFamily: 'Jost_700Bold',
  },
  horizontalContent: {
    flexDirection: "row",
    gap: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },  
});