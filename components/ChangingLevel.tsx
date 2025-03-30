import {Image, Text, View,StyleSheet} from "react-native";
import React from "react";

export const ChangingLevel = ({text}) => {
    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/text_style/textChangeLevel.png')} style={{width:200,height:60,marginTop:'30%'}}  />
            <View style={{
                alignItems: 'center',}}>
                {/* Viền ngoài */}
                <Text style={[styles.text,styles.borderText]}>{text+1}</Text>

                {/* Chữ chính */}
                <Text style={styles.text}>{text+1}</Text>
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
    },
    text:{
        fontSize: 100,
        fontWeight: 'bold',
        color: '#F5F1E1', // Màu nền chữ
        position: 'absolute'
    },
    borderText:{
        color: '#9C601A', // Màu viền ngoài
        left: -34, top: 2
    }
})