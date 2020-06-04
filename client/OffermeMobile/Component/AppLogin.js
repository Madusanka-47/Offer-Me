import React from "react"
import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    ToastAndroid
} from "react-native"

import * as Google from 'expo-google-app-auth';
import MainScreen from '../Component/MainScreen'
import * as Network from 'expo-network';
import GlobalConfig from '../global_config.json'

/**
 * @Dulanjan
 * Get configuration paths from the global config file.
 * All the configuration gose under this section
 */
//#region 
const AppURI = GlobalConfig.RESTServiceURI;
const clientID = GlobalConfig.ClientID;
const BasePath = GlobalConfig.BasePath;
const pageImg = BasePath + GlobalConfig.clientAssest.login_background;
const pageLoginLogo = BasePath + GlobalConfig.clientAssest.google_logo;
//#endregion

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
                ToastAndroid.showWithGravity(
                    "We couldn't able to connect you with google",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            }
        } catch (e) {
            ToastAndroid.showWithGravity(
                "Something went wrong. please contact support",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    }
    getUserAuthenticationSession() {
        try {
            return new Promise((reslove, reject) => {
                Network.getMacAddressAsync().then((mac) => {
                    fetch(AppURI + '/api/user/getUserAuthSession/' + mac)
                        .then((response) => response.json())
                        .then((callback) => {
                            reslove(callback);
                        }).catch((err) => {
                            reject(err)
                        })
                })
            })
        } catch (error) {
            ToastAndroid.showWithGravity(
                "Something went wrong. please contact support",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    }

    componentDidMount() {
        this.getUserAuthenticationSession().then((auth) => {
            auth.forEach(element => {
                this.setState({
                    activeSession: element.isActive,
                    userName: element.user.name,
                    profileUrl: element.user.photoUrl,
                    user: element.user
                })
            });
        })
    }

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
            <ImageBackground source={{ uri: pageImg }} style={styles.image}></ImageBackground>
            <TouchableOpacity activeOpacity={.5} onPress={() => props.userAuthenticate()}>
                <Image style={styles.avatar} source={{ uri: pageLoginLogo }} onc={() => props.userAuthenticate()} />
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