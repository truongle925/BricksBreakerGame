import {View, StyleSheet, Image, ImageBackground} from "react-native";


const Paddle = (props) => {
    //console.log(props,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    const top = props.body.position.y
    const left = props.body.position.x - 50



    return(
        <View style={[styles.container,{top:top,left:left}]}>
            <Image source={require("@/assets/images/paddle.png")}  style={{ width:'100%',height:'100%'}}/>
        </View>
        // <ImageBackground
        //     source={require("@/assets/images/paddle.png")} // Đổi thành đường dẫn ảnh của bạn
        //     style={[styles.container, { top, left }]}
        //     resizeMode="cover"
        //     width={100}
        //     height={10}
        // />
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: 100,
        height: 10,
        borderRadius:10,
        backgroundColor: "#b9bbb0",


    }
})

export default Paddle;