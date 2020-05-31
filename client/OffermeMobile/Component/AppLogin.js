import React from "react"
import { StyleSheet, Text, View, Image, Button, ImageBackground, TouchableOpacity } from "react-native"
import * as Google from 'expo-google-app-auth';
import MainScreen from '../Component/MainScreen'
import * as Network from 'expo-network';
import GlobalConfig from '../global_config.json'

const AppURI = GlobalConfig.RESTServiceURI;
const clientID = GlobalConfig.ClientID;

export default class AppLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeSession: false,
            userName: "",
            profileUrl: "",
            user: undefined
        }
    }
    userAuthenticate = async () => {
        try {
            const callback_ = await Google.logInAsync({
                androidClientId: clientID,
                scopes: ["profile", "email"]
            })

            if (callback_.type === "success") {
                const mac = await Network.getMacAddressAsync();

                const userParam = JSON.stringify({
                    MAC: mac,
                    userObject: callback_,
                    isSession: true
                })
                fetch(AppURI + '/api/User/saveUserLogins', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: userParam
                });

                this.setState({
                    activeSession: true,
                    userName: callback_.user.userName,
                    profileUrl: callback_.user.profileUrl,
                    user: callback_.user
                })
            } else {
                console.log("session canceled")
            }
        } catch (e) {
            console.log("error", e)
        }
    }
    getUserAuthenticationSession() {
        try {
            return new Promise((reslove, reject) => {

                fetch(AppURI + '/api/User/getUserAuthSession', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        MAC: '02:00:00:44:55:66'
                    })
                }).then((response) => response.json())
                    .then((auth) => {
                        reslove(auth);
                    }).catch((err) => {
                        reject(err)
                    })
            })
        } catch (error) {
            console.error(error);
        }
    }

    // componentDidMount() {
    //     this.getUserAuthenticationSession().then((auth) => {
    //         this.setState({ user: auth });
    //     })

    // }

    render() {
        const userAuthenticate = this.state.activeSession
        return (
            <SwitchScreens userAuthenticate={this.userAuthenticate} isLoggedIn={userAuthenticate} useParam={this.state.user} />
        )
    }
}

const AppLoginScreen = props => {
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
    if (props.isLoggedIn) {
        return <MainScreen userObj={props} />;
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