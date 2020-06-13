import React from "react";
import {
    RefreshControl,
    StyleSheet,
    ToastAndroid
} from "react-native";

import { Container, Content, Icon } from 'native-base'
import CardComponent from '../CardComponent'
import GlobalConfig from '../../global_config.json'
import * as Network from 'expo-network';

/**
 * @Dulanjan
 * Get configuration paths from the global config file.
 * All the configuration gose under this section
 */
//#region 
const AppURI = GlobalConfig.RESTServiceURI;
const BasePath = GlobalConfig.BasePath;
const SecuredPath = GlobalConfig.SecuredPath;
//#endregion

export default class ActivityFeed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            feedPosts: [],
            refreshing: true,
            userObject: [],
            userRewards: []
        };
    }

    getUserActivityFeedPosts() {
        try {
            this.setState({ refreshing: true });
            return new Promise((reslove, reject) => {
                fetch(AppURI + '/api/post/getActivityFeeds/5')
                    .then((response) => response.json())
                    .then((feedPosts) => {
                        reslove(feedPosts);
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

    getActiveUserSession() {
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
    //TODO: This function wont work proprly
    getAwardUserPoint(userId) {
        try {
            return new Promise((reslove, reject) => {
                fetch(AppURI + '/api/Point/getCurrentUserAwards/' + userId)
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

    onRefresh = () => this.getUserActivityFeedPosts().then((feeds) => {
        this.setState({
            feedPosts: feeds,
            refreshing: false,
        });
    })

    componentDidMount() {
        this.getUserActivityFeedPosts().then((feeds) => {
            this.setState({
                feedPosts: feeds,
                refreshing: false,
            });
        })
        this.getActiveUserSession().then((userSession) => {
            this.setState({ userObject: userSession });
            let userId = ''
            userSession.forEach(element => {
                userId = element.user.id
            });
            this.getAwardUserPoint(userId).then((callback) => {
                this.setState({ userRewards: callback })
            })
        })
    }

    render() {
        const feedActivities = this.state.feedPosts;
        const userObject = this.state.userObject;
        let userSession = []
        userObject.forEach(element => {
            userSession = element.user
        });
        return (
            <Container style={styles.container}>
                <Content
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}>
                    {feedActivities.map((prop, key) => {
                        let caption = ''
                        let user = ''
                        let postid = prop.postid
                        if (prop.discount != 'undefined' && prop.base_amount != 'undefined') {
                            caption = prop.is_automated ? prop.description + ' off ' + prop.discount + ' from ' + prop.base_amount : prop.description
                        } else {
                            caption = prop.description
                        }
                        
                        const imgurl = (prop.imgurl).replace(SecuredPath, BasePath)
                        var fetchDate = prop.fetched_date;
                        var expDate = prop.expire_date;
                        if (!prop.is_automated) {
                            user = prop.user
                        }
                        const rewards = this.state.userRewards;
                        let pulltag = false
                        rewards.forEach(element => {
                            if (user.id == element.auther_id && postid == element.postid) {
                                pulltag = true
                            }
                        });
                        return (
                            <CardComponent imageSource={imgurl} likes="" key={key} navigate={this.props.navigation} caption={caption} fetchDate={fetchDate} automated={prop.is_automated} postId={postid}
                                loggedInUser={0} user={user} currentUser={userSession} pullTag={pulltag} expDate={expDate} />)
                    })}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d1d1d1'
    }
});