import {View, StyleSheet, TouchableOpacity, ImageBackground, Text, Dimensions} from "react-native";

const {width, height} = Dimensions.get("window");
const CustomModal = ({ onButtonPress,title,type,widthModal })=> {
    const numBtn = [
        {
            key: "btnResume",
            title: "Resume",
            imgBackground: require("../assets/images/button/startbtn.png"),
            width: 60,
            height: 60,
        },
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
        {
            key: "btnQuit",
            title: "Quit",
            imgBackground: require("../assets/images/button/quitbtn.png"),
            width: 60,
            height: 60,
        },
    ];

    const numBtn_2 = [
        {
            key: "btnCancel",
            title: "Cancel",
        },
        {
            key: "btnExit",
            title: "Quit",
        },
    ]

    const styles = StyleSheet.create({
        container: {

            position: 'absolute',
            height:'100%',
            width:'100%',
            zIndex:1
        },
        overlay:{

            position: 'absolute',
            top:0,
            left:0,
            backgroundColor:'#44526B',
            opacity: 0.5,height:'100%',
            width:'100%',
        },
        modalContainer: {
            backgroundColor:'#000B22',
            height:200,
            //marginHorizontal:15,
            paddingHorizontal:25,
            top: (height/2) - 100,
            marginRight:'auto',
            marginLeft:'auto',
            borderRadius: 15,
            width: widthModal ? widthModal : '90%',
        },
        modalBtnContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 35,
        },
        titleModal: {
            marginTop: 25
        },
        titleModalText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
        }
    })


    return (
        <View style={styles.container}>
            <View style={styles.overlay}>

            </View>
            <View style={styles.modalContainer}>
                <View style={[styles.titleModal]}>
                    <Text style={[styles.titleModalText]}>{title}</Text>
                </View>

                <View style={styles.modalBtnContainer}>
                    {
                        type == 1 ? (
                            numBtn.map((item) => (
                                    <TouchableOpacity  key={item.key} onPress={() => onButtonPress(item.key)}>
                                        <ImageBackground
                                            style={{ width: item.width, height: item.height }}
                                            source={item.imgBackground}
                                        />
                                    </TouchableOpacity>
                                ))
                        ) : (
                            numBtn_2.map((item)=> (

                                    <TouchableOpacity key={item.key} onPress={() => onButtonPress(item.key)}>
                                        <View style={[{
                                            backgroundColor: '#FFB11F',
                                            width: 75,
                                            height: 75,
                                            borderRadius: 80
                                        }]}>
                                            <View style={[{
                                                backgroundColor: '#543700',
                                                position:'absolute',
                                                width: 65,
                                                height: 65,
                                                top: '7%',
                                                left: '7%',
                                                borderRadius: 70
                                            }]}>
                                                <Text style={[{
                                                    fontSize: 18,
                                                    textAlign:'center',
                                                    fontWeight: "bold",
                                                    color:'white',
                                                    lineHeight:60,
                                                }]}>{item.title}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                            ))

                        )
                    }

                </View>


            </View>
        </View>
   )
}


export default CustomModal;