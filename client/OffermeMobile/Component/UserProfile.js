import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';

export default class UserProfile extends React.Component {
    render() {
        return (
            <View>
                <View style={styles.header}></View>
                <Image style={styles.avatar} source={require('../assets/promo.png')} />
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>Promo LK</Text>
                        <Text>Points 10K Posts 20K</Text>
                        {/* {/* <Text style={styles.info}>UX Designer / Mobile developer</Text> */}
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
        backgroundColor: "#9d50e6",
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
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    }
});