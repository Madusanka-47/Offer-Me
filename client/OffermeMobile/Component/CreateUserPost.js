<script src="http://localhost:8097"></script>
import React from 'react'
import {
    Container,
    Header,
    Content,
    Form,
    Textarea,
    Left,
    Thumbnail,
    Body,
    CardItem,
    Text,
    Card
} from 'native-base';

import PostShowCase from './PostShowCase'
import { StyleSheet, Button } from 'react-native'

export default class CreateUserPost extends React.Component {
    render() {
        return (
            <Container style={styles.container}>
                <Card>
                    <CardItem>
                        <Left>
                            <Thumbnail source={require('../assets/promo.png')} />
                            <Body>
                                <Textarea style={styles.text} rowSpan={6} placeholder="What's on your mind?" />
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        <Button
                            // onPress={() => this.props.navigation.navigate('MyModal')}
                            title="Close"
                        />
                    </CardItem>
                </Card>
                <Container>
                    <Content>
                        <PostShowCase />
                        <PostShowCase />
                    </Content>
                </Container>
            </Container>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '10%'
    },
    text: {
        flex: 1,
        textAlign: 'left',
        justifyContent: 'center',
        paddingTop: 15

    }

});