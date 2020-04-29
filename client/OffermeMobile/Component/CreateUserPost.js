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
import { StyleSheet, Button, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { bool } from 'prop-types';

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class CreateUserPost extends React.Component {
    state = {
        image: null,
        show: false
    };

    selectPicture = async () => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ show: true });
                this.setState({ image: result.uri });
            }

            console.log(result);
        } catch (E) {
            console.log(E);
        }
    };

    getNewPhoto = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ show: true });
                this.setState({ image: result.uri });

            }

            console.log(result);
        } catch (E) {
            console.log(E);
        }
    };

    cancel = () => {
        this.setState({ show: false });
    }

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
                        {this.state.show ? (
                            <Image style={styles.image} source={{ uri: this.state.image }} />
                        ) : null}

                        {this.state.show ? (
                            <MaterialIcon
                                name={'close'}
                                size={30}
                                onPress={this.cancel}
                            />
                        ) : null}
                    </CardItem>
                    <CardItem>
                        <MaterialIcon
                            name={'image'}
                            size={35}
                            onPress={this.selectPicture} />
                        <MaterialIcon
                            name={'camera'}
                            size={35}
                            onPress={this.getNewPhoto} />
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

    },
    image: { width: 300, height: 200, backgroundColor: 'gray' },

});