import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import * as Google from 'expo-google-app-auth';
import { Badge } from 'native-base'
import GlobalConfig from '../global_config.json'

const AppURI = GlobalConfig.RESTServiceURI;
const BasePath = GlobalConfig.BasePath;
const BannerPath = BasePath + GlobalConfig.clientAssest.profile_banner;
const SignOutGoogle = BasePath + GlobalConfig.clientAssest.signout_google;

export default class UserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isSession: true,
            userData: []
        }
    }

    userLogout = async () => {
        await Google.signOutAsync();
        this.setState({ isSession: false });
    };
    
    getUserProfileDetails(userId) {
        try {
            return new Promise((reslove, reject) => {
                fetch(AppURI + '/api/Point/getAwardDetails/' + userId)
                    .then((response) => response.json())
                    .then((callback) => {
                        reslove(callback);
                    }).catch((err) => {
                        reject(err)
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
        this.getUserProfileDetails(this.props.useParam.useParam.id).then((data) => {
            this.setState({ userData: data })
        })

    }

    render() {
        var userName = (this.props.useParam.useParam.name);
        userName = userName.charAt(0).toUpperCase() + userName.slice(1)
        const profileUrl = this.props.useParam.useParam.photoUrl
        return (
            <View>
                <View style={styles.header}>
                    <Image style={styles.backImg} source={{ uri: BannerPath }} />
                </View>


                <Image style={styles.avatar} source={{ uri: profileUrl }} />
                <View>
                    <TouchableOpacity activeOpacity={.5} onPress={() => this.userLogout()}>
                        <Image style={styles.signout} source={{ uri: SignOutGoogle }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{userName}</Text>
                        <Badge style={{ justifyContent: "center", alignSelf: "center", backgroundColor: '#bab8b8', marginTop: 10, marginBottom: 5 }}>
                            <Text style={{ fontWeight: "bold" }}> Points {this.state.userData.pointCount} </Text>
                        </Badge>
                        <Badge style={{ justifyContent: "center", alignSelf: "center", backgroundColor: '#bab8b8', marginBottom: 10 }}>
                            <Text style={{ fontWeight: "bold" }}> Posts {this.state.userData.postCount} </Text>
                        </Badge>
                        <QRCode
                            value='some string value'
                            backgroundColor={'white'}
                            size={130}
                            logoMargin={2}
                            logoSize={20}
                            logoBorderRadius={10}
                            logoBackgroundColor={'transparent'} />
                    </View>
                </View>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#1e54b4",
        height: 170,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 63,
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 100
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    body: {
        marginTop: 30,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    signout: {
        width: 60,
        height: 60,
        alignSelf: "flex-end",
        marginEnd: 110
    },
    backImg: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain'
    }
});