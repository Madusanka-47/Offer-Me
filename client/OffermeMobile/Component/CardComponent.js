import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";

import { Card, CardItem, Thumbnail, Body, Left, Right, Button } from 'native-base'

import Icon from 'react-native-vector-icons/EvilIcons';


export default class CardComponent extends React.Component {

    render() {
        return (
            <Card>
                <CardItem>
                    <Left>
                        <Thumbnail source={require('../assets/promo.jpg')} />
                        <Body>
                            <Text>Offer Me Automation </Text>
                            <Text note>{this.props.fetchDate}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <Text>
                            <Text style={{ fontWeight: "900" }}>
                            </Text>
                            {this.props.caption}
                        </Text>
                    </Body>
                </CardItem>
                <CardItem cardBody>
                    <Image source={{ uri: this.props.imageSource }} style={{ height: 300, width: null, flex: 1 }} />
                </CardItem>
                <CardItem style={{ height: 20 }}>
                    <Text>{this.props.likes} </Text>
                </CardItem>
                <CardItem>
                    {this.props.automated ? (<Text></Text>) : (
                        <Button transparent
                            style={styles.container}
                        // onPress={() => }
                        >
                            <Icon name="heart" size={30} color={'purple'} />
                            <Text>
                                Rate up
                        </Text>
                        </Button>)}
                    <Button transparent
                        style={styles.container}
                        onPress={() => {
                            this.props.navigate.navigate('Comments', {
                                postId: this.props.postId
                                // user: this.props.loggedInUser
                            })
                        }}>
                        <Icon name="comment" size={30} />
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