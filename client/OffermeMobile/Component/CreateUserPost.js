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
    Card,
    Right,
    Input
} from 'native-base';

import PostShowCase from './PostShowCase'
import { StyleSheet, ImageBackground, Button, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { bool } from 'prop-types';
import UserInput from './UserInput'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class CreateUserPost extends React.Component {
    state = {
        image: null,
        show: false,
        imgresult: Object
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
            this.setState({imgresult: result})
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
createUserPost = (comment) => {
    console.log('@@@@@@@@@@@')
    console.log(this.state.imgresult)
    console.log(comment)

}
    render() {
        return (
            <Container style={styles.container}>
                <Card>
                    <CardItem>
                        <Left>
                            <Thumbnail source={require('../assets/promo.png')} />
                            <Body>
                                {/* <Textarea style={styles.text} rowSpan={6} placeholder="What's on your mind?" /> */}
                                <UserInput onSubmit={this.createUserPost} />
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        {this.state.show ? (
                            <ImageBackground style={styles.image} source={{ uri: this.state.image }}>
                                <View>
                                    <MaterialIcon
                                        style={{ alignSelf: 'flex-end', paddingTop: 5, paddingRight: 5, color: 'red' }}
                                        name={'close'}
                                        size={30}
                                        onPress={this.cancel}
                                    />
                                </View>
                            </ImageBackground>
                        ) : null}
                    </CardItem>
                    <CardItem style={styles.iconogy}>
                        <MaterialIcon
                            name={'image'}
                            size={35}
                            onPress={this.selectPicture} />
                        <MaterialIcon
                            name={'camera'}
                            size={35}
                            onPress={this.getNewPhoto} />
                        {this.state.show ? (
                            <MaterialIcon
                                name={'check'}
                                size={35}
                                onPress={this.getNewPhoto} />
                        ) : null}
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
    iconogy: {
        // flex: 1, 
        flexDirection: "row"

    }
});