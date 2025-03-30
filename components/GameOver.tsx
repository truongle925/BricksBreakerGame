import {Image, Text, View, StyleSheet, TouchableOpacity, ImageBackground} from "react-native";
import React from "react";

export const GameOver = ({onButtonPress}) => {
    const numBtn = [
        {
            key: "btnRestart",
            title: "Restart",
            imgBackground: require("../assets/images/button/restartbtn.png"),
            width: 60,
            height: 60,
        },
        {
            key: "btnMainMenu",
            title: "Main Menu",
            imgBackground: require("../assets/images/button/menubtn.png"),
            width: 60,
            height: 60,
        },
    ]
    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/text_style/textGameOver.png')} resizeMode={'cover'} style={{width:300,height:140,marginTop:'40%',marginLeft:'3%'}}  />
            <View style={{flexDirection:'row',marginTop:'8%',gap:50}}>
                {
                    numBtn.map((btn, index) => (
                        <TouchableOpacity key={btn.key} onPress={() => {onButtonPress(btn.key)}}>
                            <ImageBackground source={btn.imgBackground} style={{width:btn.width,height:btn.height}}/>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000B22",
        position:'absolute',
        height:'100%',
        width:'100%',
        zIndex:1,
        alignItems:'center',
        paddingTop:'30%',
    }
})