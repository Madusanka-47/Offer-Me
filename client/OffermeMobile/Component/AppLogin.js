import React from "react"
import { StyleSheet, Text, View, Image, Button, ImageBackground, TouchableOpacity } from "react-native"
import * as Google from 'expo-google-app-auth';
import MainScreen from '../Component/MainScreen'

export default class AppLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeSession: false,
            userName: "",
            profileUrl: ""
        }
    }
    userAuthenticate = async () => {
        try {
            const callback_ = await Google.logInAsync({
                androidClientId:
                    "156487268323-55miqriid99a68c114t683tvgc2u678q.apps.googleusercontent.com",
                scopes: ["profile", "email"]
            })

            if (callback_.type === "success") {
                this.setState({
                    activeSession: true,
                    userName: callback_.user.userName,
                    profileUrl: callback_.user.profileUrl
                })
            } else {
                console.log("session canceled")
            }
        } catch (e) {
            console.log("error", e)
        }
    }

    render() {
        const userAuthenticate = this.state.activeSession
        console.log(this.state.activeSession)
        return (
            <SwitchScreens userAuthenticate={this.userAuthenticate} isLoggedIn={userAuthenticate} />
        )
    }
}

const AppLoginScreen = props => {
    const image = { uri: "https://reactjs.org/logo-og.png" };
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/BackGround.jpg')} style={styles.image}></ImageBackground>
            <TouchableOpacity activeOpacity={.5} onPress={() => props.userAuthenticate()}>
                <Image style={styles.avatar} source={require('../assets/google.png')} onc={() => props.userAuthenticate()} />
            </TouchableOpacity>
        </View>
    )
}

const SwitchScreens = (props) => {
    console.log(props)

    if (props.isLoggedIn) {
        return <MainScreen />;
    }
    return <AppLoginScreen userAuthenticate={props.userAuthenticate} />;
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        fontSize: 25
    },
    image: {
        marginTop: 15,
        width: 500,
        height: 500
    },
    avatar: {
        width: 50,
        height: 50,
        marginBottom: 10,
        alignSelf: 'center',
    },
})