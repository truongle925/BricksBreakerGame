import {
    Text,
    View,
    StyleSheet,
    Image,
    Animated,
    TouchableOpacity,
    ImageBackground,
    TouchableWithoutFeedback
} from "react-native";
import {useEffect, useRef, useState} from "react";
import {FontAwesome} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {playSound} from "@/utils/PlaySound";
import {Sound_Button_Click} from "@/constants/Sound";
import {clearHighScores, getHighScores} from "@/utils/SaveHighScore";
import {SoundProvider, useSound} from "@/hooks/SoundContext";


const Index = ()=> {
    const translateY = useRef(new Animated.Value(0)).current;
    const [mute, setMute] = useState(false);
    const soundHook = useSound();
    const [showHighScore, setShowHighScore] = useState(false);
    const [breakerScore,setBreakerScore] = useState<[]>([]);
    const [linebreakerScore,setLineBreakerScore] = useState<[]>([]);
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
        soundHook.toggleMute();
    }

    const directScreen = (mode: number) => {
        setTimeout(() => {
            mode == 1 ? router.push("/(mode_1)") : router.push("/(mode_2)");
        },300)

    }

    const fetchScore = async (keyItem_1,keyItem_2) => {
       const scoreBreaker = await getHighScores(keyItem_1);
       const scoreLineBreaker = await getHighScores(keyItem_2);
       setBreakerScore(scoreBreaker);
       setLineBreakerScore(scoreLineBreaker);
        // clearHighScores(keyItem);
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
                              <FontAwesome name="volume-off" size={25}  color="white"/> :
                              <FontAwesome name="volume-up" size={25}  color="white"/>
                      }
                  </TouchableOpacity>
              </View>
              <View style={styles.viewText}>
                  <Animated.Image source={require('@/assets/images/text_style/texthome.png')} style={{transform: [{ translateY }]}}/>
              </View>
              <View style={styles.containerMode}>
                  <View style={[styles.viewMode,{marginRight:60}]}>
                      <Image source={require('@/assets/images/logo/mode_1.png')} />
                      <TouchableOpacity touchSoundDisabled={true} onPress={() => {
                          playSound(Sound_Button_Click,soundHook.mute)
                          directScreen(1);
                      }}>
                          <ImageBackground source={require('@/assets/images/button/startbtn.png')} style={{ width: 70, height: 70 }}/>
                      </TouchableOpacity>
                  </View>
                  <View style={styles.viewMode}>
                      <Image source={require('@/assets/images/logo/mode_2.png')} />
                      <TouchableOpacity touchSoundDisabled={true} onPress={() => {
                          playSound(Sound_Button_Click,soundHook.mute)
                          directScreen(2);

                      }}>
                          <ImageBackground source={require('@/assets/images/button/startbtn.png')} style={{ width: 70, height: 70 }}/>
                      </TouchableOpacity>
                  </View>
              </View>
              <View>
                  <TouchableOpacity style={{backgroundColor: '#FFB11F',width:150,height:50,borderRadius:20,marginHorizontal:'auto',marginTop:30}} onPress={() => {setShowHighScore(true);fetchScore('breaker','line_breaker')}} >
                      <Text style={{color:'white', fontSize:18, fontWeight:'bold',textAlign:'center',lineHeight:45}}>Hight Score</Text>
                  </TouchableOpacity>
              </View>
              {showHighScore && (
                  <View style={styles.viewModalContainer}>
                      <TouchableWithoutFeedback onPress={() => { setShowHighScore(false)}}>
                          <View style={styles.viewOverlay} />
                      </TouchableWithoutFeedback>
                      <View style={styles.viewModalScore}>
                          <View style={{marginHorizontal:'auto',marginTop:20}}>
                              <Text style={{color:'white',fontSize:24,fontWeight:'600'}}>High Score</Text>
                          </View>
                          <View style={{flexDirection:'row',justifyContent:'space-between',height:'100%',marginTop:15}}>
                              <View style={{marginHorizontal:'auto'}}>
                                  <View style={{backgroundColor:'#FFB11F',width:110,height:30,borderRadius:6}}>
                                      <Text style={{color:'white',fontWeight:'600',textAlign:'center',fontSize:14,lineHeight:28}}>Breaker</Text>
                                  </View>

                                  {
                                      breakerScore.map((score,index) => (
                                          <Text key={index} style={{color:'white',marginHorizontal:'auto',marginTop:12,fontSize:20}}>{score}</Text>
                                      ))
                                  }


                              </View>

                              <View style={{backgroundColor:'white',width:2,height:'70%'}}>
                              </View>
                              <View style={{marginHorizontal:'auto'}}>
                                  <View style={{backgroundColor:'#FFB11F',width:110,height:30,borderRadius:6}}>
                                      <Text style={{color:'white',fontWeight:'600',textAlign:'center',fontSize:14,lineHeight:28}}>Line Breaker</Text>
                                  </View>

                                  {
                                      linebreakerScore.map((score,index) => (
                                          <Text key={index} style={{color:'white',marginHorizontal:'auto',marginTop:12,fontSize:20}}>{score}</Text>
                                      ))
                                  }
                              </View>
                          </View>
                      </View>
                  </View>
              )}

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
    },
    viewModalContainer:{
        position: 'absolute',
        zIndex: 1,
        width:'100%',
        height:'100%',
    },
    viewModalScore:{
        backgroundColor: '#000523',
        height: 330,
        width:'90%',
        marginHorizontal:'auto',
        marginVertical:'auto',
        borderRadius:10,
    },
    viewOverlay:{
        position: 'absolute',
        top:0,
        left:0,
        backgroundColor:'#44526B',
        opacity: 0.5,height:'100%',
        width:'100%',
    }
})
export default Index;
