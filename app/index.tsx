import {Text, View, StyleSheet, Image, Animated, TouchableOpacity, ImageBackground} from "react-native";
import {useEffect, useRef, useState} from "react";
import {FontAwesome} from "@expo/vector-icons";
import {useRouter} from "expo-router";

const Index = ()=> {
    const translateY = useRef(new Animated.Value(0)).current;
    const [mute, setMute] = useState(false);
    const router = useRouter();
    // Hàm custom animation
    const animated = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -10,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }

    const handleSound = () => {
        setMute(!mute);
    }

    const directScreen = (mode: number) => {
        mode == 1 ? router.push("/(mode_1)") : router.push("/(mode_2)");
    }

    useEffect(() => {
        animated();
    },[])

  return (
    <View
      style={[styles.container]}
    >
        <View style={[styles.viewSound]}>
            <TouchableOpacity onPress={handleSound}>
                {
                    mute ?
                        <FontAwesome name="volume-up" size={25}  color="white"/> :
                        <FontAwesome name="volume-off" size={25}  color="white"/>
                }
            </TouchableOpacity>
        </View>
        <View style={styles.viewText}>
            <Animated.Image source={require('@/assets/images/text_style/texthome.png')} style={{transform: [{ translateY }]}}/>
        </View>
        <View style={styles.containerMode}>
            <View style={[styles.viewMode,{marginRight:60}]}>
                <Image source={require('@/assets/images/logo/mode_1.png')} />
                <TouchableOpacity onPress={() => directScreen(1)}>
                    <ImageBackground source={require('@/assets/images/button/startbtn.png')} style={{ width: 70, height: 70 }}/>
                </TouchableOpacity>
            </View>
            <View style={styles.viewMode}>
                <Image source={require('@/assets/images/logo/mode_2.png')} />
                <TouchableOpacity onPress={() => directScreen(2)}>
                    <ImageBackground source={require('@/assets/images/button/startbtn.png')} style={{ width: 70, height: 70 }}/>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000B22",
    },
    viewText:{
        marginTop: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    containerMode:{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: "10%"

    },
    viewMode:{
        flexDirection: "column",
        alignItems: "center",
        rowGap: 20
    },
    buttonMode:{
        width: 200,
        height: 60,
        borderRadius: 10,
        backgroundColor: "red",
    },
    viewSound:{
        justifyContent: "flex-end",
        display: "flex",
        flexDirection: "row",
        paddingRight: 20,
        paddingTop: 20
    }
})
export default Index;
