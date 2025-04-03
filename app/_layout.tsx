import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {View, Text, Animated, Image, StyleSheet, Dimensions} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import LoadingWave from "@/components/loading";
import {SoundProvider} from "@/hooks/SoundContext";


const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {

    // Hàm load splash screen
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      await new Promise(resolve => setTimeout(resolve, 3000));
      setAppReady(true);
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return (
        <View style={styles.splashContainer}>
          <Image source={require("../assets/images/text_style/splashtext.png")}
                 style={[{width:width - 30, height:height-(width*1.8)}]}/>
          <Image source={require("../assets/images/logo/logo.png")}
                 style={styles.logo} />
          <LoadingWave/>
        </View>
    );
  }

  return  <SoundProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SoundProvider>
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#000B22",
  },
  logo: {
    width: 195,
    height: 195,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 40,
  }

});
