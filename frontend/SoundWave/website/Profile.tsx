import Header from "../components/Header";
import React from "react";


export default function Profile(){
    return(
        <div style = {styles.page}>
            <header/>

            {</* Profile Picture */>}
            <div style = {StyleSheet.profilePic} />

            {/* User Info */}
            <div style={StyleSheet.userInfo}>
                <p><strong>Username:</strong></p>
                <p># followers</p>
                <p># ratings</p>
        </div>

        {/*User Stats */}
        <div style = {styles.userStats}>
            <p><strong>Rating:</strong> #/10</p>
            <p># following</p>
            <p># comments</p>
        </div>

        {/* Bio */}
        <div style = {styles.bio}>
            <><strong>Bio:</strong></p>
            <p><strong>Bio:</strong></p>
            <div style = {styles.bioLine} />
            <div style = {styles.bioLine} />
            <div style = {styles.bioLine} />
            <div style = {styles.bioLine} />
        </div>

        {/* Top Songs */}
        <h3 style = {{ ...styles.sectionTitle, top:330 }}>Top Songs:</h3>
        <div style= {{ ...styles.row, top: 370}}>
            {Array(5).fill(0).map((_, i) => )
                <div key = {i} style = {StyleSheet.card} />
            }
        </div>
    )
}