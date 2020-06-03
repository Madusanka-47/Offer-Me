import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert
} from "react-native";

import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Badge } from 'native-base'

import Icon from 'react-native-vector-icons/EvilIcons';
import MeterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalConfig from '../global_config.json'

const AppURI = GlobalConfig.RESTServiceURI;

export default class CardComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pullTag: false
        }
    }
    saveAwardedUserPoints(postUser, currentUser, postId) {

        const awardParam = JSON.stringify({
            postid: postId,
            auther_id: postUser.id,
            user: currentUser,
            point_wage: 10
        })

        fetch(AppURI + '/api/Point/AwardUserPoints', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: awardParam
        });
        this.setState({ pullTag: true })
    }

    awardUserPoint = (postUser, currentUser, postId) => {
        let customMesssage = ''
        let messageParam = []

        if (!this.state.pullTag) {
            customMesssage = 'You are about to reward this member with 10+ ❤️️ points. Please confirm'
            messageParam = [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        this.saveAwardedUserPoints(postUser, currentUser, postId)
                    }
                }
            ]
        }
        else {
            customMesssage = 'You have alredy awarded points for this member 😥'
            messageParam = [
                {
                    text: "OK", onPress: () => console.log("Cancel Pressed")
                }
            ]
        }

        Alert.alert("Alart", customMesssage, messageParam, { cancelable: false });
    }
    componentDidMount() {
        const rewardedObj = this.props.userRewards
        const postUserObj = this.props.user
        const postid = this.props.postId
        rewardedObj.forEach(element => {
            if (postUserObj.id == element.auther_id && postid == element.postid) {
                console.log('true')
            }
        });
        // this.setState({ pullTag: this.props.pulled[0] })
    }
    render() {
        // this.setState({pullTag: this.props.pulled[0]})
        var date = Date.parse(this.props.expDate)
        var expdate = Math.round((date - new Date()) / (1000 * 3600 * 24));
        var color_ = '#41a61f'
        let expMessage = 'Expire in ' + expdate + ' D'
        if (expdate > 3) { color_ = '#41a61f' } else if (expdate > 2) { color_ = '#c4aa23' } else if (expdate < 2) { color_ = '#e32020'; expMessage = 'Expire Soon' }
        let userName = ''
        let profileUrl = ''
        let rateEnable = this.props.currentUser.id == this.props.user.id || this.props.automated ? false : true
        if (!this.props.automated) {
            userName = this.props.user.name
            profileUrl = this.props.user.photoUrl
        } else {
            userName = 'Offer Me Automation'
            profileUrl = 'https://storage.googleapis.com/scraphub-store/AppData/DataCenter.jpg'
        }
        return (
            <Card>
                <CardItem>
                    <Left>
                        <Thumbnail source={{ uri: profileUrl }} />
                        <Body>
                            <Text>{userName}</Text>
                            <Text note>{this.props.fetchDate}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <Text>
                            <Text style={{ fontWeight: "900" }}>
                            </Text >
                            {this.props.caption}
                        </Text>
                        <Text></Text>
                        {this.props.automated ? (null) : (
                            <Badge style={{ justifyContent: "center", alignSelf: "flex-end", backgroundColor: color_ }}>
                                <Text style={{ fontWeight: "bold" }}> {expMessage} </Text>
                            </Badge>
                        )}
                    </Body>
                </CardItem>
                <CardItem cardBody>
                    <Image source={{ uri: this.props.imageSource }} style={{ height: 270, width: null, flex: 1 }} />
                </CardItem>
                <CardItem style={{ height: 20 }}>
                    <Text>{this.props.likes} </Text>
                </CardItem>
                <CardItem>
                    {!rateEnable ? (null) : (
                        <Button transparent
                            style={styles.container}
                            onPress={() => { this.awardUserPoint(this.props.user, this.props.currentUser, this.props.postId) }}
                        >
                            {!this.state.pullTag ? (
                                <MeterialIcon name="tag-heart-outline" size={35} color='#878787' />
                            ) :
                                (<MeterialIcon name="tag-heart" size={35} color='#d92b25' />
                                )}
                            <Text>
                                Rate up
                        </Text>
                        </Button>)}
                    <Button transparent
                        style={styles.container}
                        onPress={() => {
                            this.props.navigate.navigate('Comments', {
                                postId: this.props.postId
                            })
                        }}>
                        <Icon name="comment" size={35} color ={'#878787'}/>
                        <Text>
                            Comment
                        </Text>
                    </Button>
                </CardItem>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});