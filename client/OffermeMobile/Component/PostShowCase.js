import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';

export default class PostShowCase extends Component {
  render() {
    return (
        <Content>
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                {/* <Thumbnail source={{uri: 'Image URL'}} /> */}
                <Body>
                  {/* <Text>NativeBase</Text>
                  <Text note>April 15, 2016</Text> */}
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={require('../assets/feed_images/2.jpg')} style={{height: 200, width: 390, flex: 1}}/>
                {/* <Text>
                  //Your text here
                </Text> */}
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="logo-github" />
                  {/* <Text>1,926 stars</Text> */}
                </Button>
              </Left>
            </CardItem>
          </Card>
        </Content>
    );
  }
}