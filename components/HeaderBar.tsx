import {View, StyleSheet, Text, TouchableOpacity, ImageBackground} from "react-native";
import LevelFrame from "@/components/LevelFrame";

type propsTypes = {
    Score: number;
    Ball: number;
    Level: number;
    onButtonPress: (key: string) => void;
}


const HeaderBar = (props:propsTypes) => {
    //const level = 10

    // const onClickPause = () => {
    //     props.onClick();
    // }
    return (
        <View style={[styles.container]}>
            <View style={{width:120}}>
                <Text style={[styles.text,styles.textColor]}>Score: {props.Score}</Text>
                <Text style={[styles.text,styles.textColor]}>Ball: {props.Ball}</Text>
            </View>

            <View style={{marginRight:70}}>
                <LevelFrame level={props.Level + 1} />

            </View>

            <View>
                <TouchableOpacity onPress={() => props.onButtonPress('btnPause')}>
                    <ImageBackground style={[styles.btnPause]} source={require('../assets/images/button/pausebtn.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '000B22',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
    textColor:{
        color:'white',
    },
    text:{
        fontSize: 18,
    },
    textLevel:{
        fontSize: 20,
        fontWeight:'bold',
    },
    btnPause:{
        width:50,
        height:50,
    },
    levelFrame:{
        width:60,
        height:60,
        backgroundColor:'white',
        borderRadius:40,
    },
    levelFrame_1: {
        width:56,
        height:56,
        backgroundColor:'blue',
        borderRadius:40,
        position: 'absolute',
        top: '3%',
        left: '4%',
    }
})

export default HeaderBar;