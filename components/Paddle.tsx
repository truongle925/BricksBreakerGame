import {View, StyleSheet} from "react-native";

const Paddle = (props) => {
    //console.log(props,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    const top = props.body.position.y
    const left = props.body.position.x - 50



    return(
        <View style={[styles.container,{top:top,left:left}]}/>

    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: 100,
        height: 10,
        borderRadius:10,
        backgroundColor: "blue",

    }
})

export default Paddle;