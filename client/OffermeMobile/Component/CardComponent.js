import React from 'react';
import {
    Text,
    StyleSheet,
    Image,
    Alert
} from "react-native";

import {
    Card,
    CardItem,
    Thumbnail,
    Body,
    Left,
    Button,
    Badge
} from 'native-base'

import Icon from 'react-native-vector-icons/EvilIcons';
import MeterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalConfig from '../global_config.json'
import Moment from 'moment';

/**
 * @Dulanjan
 * Get configuration paths from the global config file.
 * All the configuration gose under this section
 */
//#region 
const AppURI = GlobalConfig.RESTServiceURI;
const BasePath = GlobalConfig.BasePath;
const automateImg = BasePath + GlobalConfig.clientAssest.automate_logo;
const rewardAlart = GlobalConfig.clientMessages.reward_alart;
const rewardOk = GlobalConfig.clientMessages.reward_alart_ok;
const BotName = GlobalConfig.BotName;
//#endregion

export default class CardComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pullTag: this.props.pullTag
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

    awardUserPoint = (postUser, currentUser, postId, tagpulled) => {
        let customMesssage = ''
        let messageParam = []
        if (!tagpulled) {
            customMesssage = rewardAlart
            messageParam = [
                {
                    text: "Cancel",
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
            customMesssage = rewardOk
            messageParam = [
                {
                    text: "OK"
                }
            ]
        }

        Alert.alert("Alart", customMesssage, messageParam, { cancelable: false });
    }

    render() { 
        var date = Date.parse(this.props.expDate)
        var expdate = Math.round((date - new Date()) / (1000 * 3600 * 24));
        var color_ = '#41a61f'
        let expMessage = 'Expire in ' + expdate + ' D'
        if (expdate > 3) { color_ = '#41a61f' } else if (expdate >= 2) { color_ = '#e3b836' } else if (expdate < 2) { color_ = '#e32020'; expMessage = 'Expire Soon' }
        let userName = ''
        let profileUrl = ''
        let rateEnable = this.props.currentUser.id == this.props.user.id || this.props.automated ? false : true
        if (!this.props.automated) {
            userName = this.props.user.name
            profileUrl = this.props.user.photoUrl
        } else {
            userName = BotName
            profileUrl = automateImg
        }
        return (
            <Card>
                <CardItem>
                    <Left>
                        <Thumbnail source={{ uri: profileUrl }} />
                        <Body>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{userName}</Text>
                            <Text note style={{ color: '#BBB' }}>{Moment(this.props.fetchDate).format('MMM D') + ' at ' + Moment(this.props.fetchDate).format('hh:mm A')}</Text>
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
                            onPress={() => { this.awardUserPoint(this.props.user, this.props.currentUser, this.props.postId, this.props.pullTag) }}
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
                        <Icon name="comment" size={35} color={'#878787'} />
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