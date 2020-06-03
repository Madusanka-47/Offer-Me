import React, { Component } from 'react';
import { Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class PostShowCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userPosts: [],
        refreshing: true,
    };
}
  deleteUserPost = async () => {
    try {
      console.log('@@@@@@@@@@')
      // fetch(AppURI + '/api/PostComment/removecomment/' + id_, {
      //   method: 'DELETE'
      // });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const posts = this.props.postProp
    return (
      <Content>
        <Card style={{ borderColor: 'purple' }}>
          <CardItem>
            <Body>
              <Image source={{ uri: posts.imgurl }} style={{ height: 200, width: 340, marginStart: 15, marginTop: 30, flex: 1 }} />
              {/* <Text>
                  //Your text here
                </Text> */}
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Text>{posts.description}</Text>
            </Left>
            </CardItem>
            <CardItem>
              <TouchableOpacity activeOpacity={.5} onPress={() => this.deleteUserPost}>
                <Icon name="delete-circle" size={30} style={{ alignSelf: 'flex-end', paddingRight: 10, paddingLeft:1, color: '#878787' }} />
              </TouchableOpacity>
              <Text>LIVE</Text>
              <Text> Expire In 2 Days</Text>
            </CardItem>
            {/* </Right> */}
        </Card>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    // paddingTop: 20,
  }
});