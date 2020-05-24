import React from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";

import { Container, Content, Icon } from 'native-base'
import CardComponent from '../CardComponent'

export default class ActivityFeed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            feedPosts: []
        };
    }

    getUserActivityFeedPosts() {
        try {
            return new Promise((reslove, reject) => {

                fetch('https://24d35226.ngrok.io/api/post/getActivityFeeds/5')
                    .then((response) => response.json())
                    .then((feedPosts) => {
                        reslove(feedPosts);
                    }).catch((err) => {
                        reject(err)
                    })
            })
        } catch (error) {
            console.error(error);
        }
    }


    componentDidMount() {
        this.getUserActivityFeedPosts().then((feeds) => {
            this.setState({ feedPosts: feeds });
        })

    }

    render() {
        const feedActivities = this.state.feedPosts;
        return (
            <Container style={styles.container}>
                <Content>
                    {feedActivities.map((prop, key) => {
                        const caption = prop.description + ' off ' + prop.discount + ' from ' + prop.base_amount
                        const imgurl = (prop.imgurl).replace('https://storage.cloud.google.com', 'https://storage.googleapis.com')
                        var fetchDate = prop.fetched_date; // this need to convert to initial date format
                        // console.log(fetchDate)
                        return (
                            <CardComponent imageSource={imgurl} likes="" key={key} navigate={this.props.navigation} caption={caption} fetchDate={fetchDate} />)
                    })}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});