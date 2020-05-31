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
import GlobalConfig from '../global_config.json'
import * as Network from 'expo-network';

const AppURI = GlobalConfig.RESTServiceURI;

export default class CreateUserPost extends React.Component {
    state = {
        image: null,
        show: false,
        imgresult: Object,
        userObject: [],
        userPosts: []
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
            this.setState({ imgresult: result })
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
            this.setState({ imgresult: result })
        } catch (E) {
            console.log(E);
        }
    };

    cancel = () => {
        this.setState({ show: false });
    }
    createUserPost = (postText) => {

        const image = {
            uri: this.state.imgresult.uri,
            type: 'image/jpeg',
            name: 'userUpload' + '-' + Date.now() + '.jpg'
        }


        const imgBody = new FormData();
        let userParam = this.state.userObject
        let user = undefined
        userParam.forEach(element => {
            user = element.user
        });

        imgBody.append('image', image);
        imgBody.append('description', postText);
        imgBody.append('email', user.email);
        imgBody.append('familyName', user.familyName);
        imgBody.append('id', user.id);
        imgBody.append('name', user.name);
        imgBody.append('photoUrl', user.photoUrl);
        // imgBody.append('userid', '113486386180655834779');

        // imgBody.append('postData', postData);

        fetch(AppURI + '/api/post/createUserPost', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: imgBody
        }).then(res => res.json()).then(results => {
            // // Just me assigning the image url to be seen in the view
            // const source = { uri: res.imageUrl, isStatic: true };
            // const images = this.state.images;
            // images[index] = source;
            // this.setState({ images });
            console.log(results)
        }).catch(error => {
            console.error(error);
        });
        console.log(this.state.imgresult)
        console.log(postText)

    }

    getActiveUserSession() {
        try {
            return new Promise((reslove, reject) => {
                Network.getMacAddressAsync().then((mac) => {
                    fetch(AppURI + '/api/user/getUserAuthSession/' + mac, {
                    }).then((response) => response.json())
                        .then((callback) => {
                            reslove(callback);
                        }).catch((err) => {
                            reject(err)
                        })
                })
            })
        } catch (error) {
            console.error(error);
        }
    }
    getSpecificUserPosts() {
        try {
            const userParam = this.state.userObject
            return new Promise((reslove, reject) => {
                let userId = ''


                userParam.forEach(element => {
                    userId = element.user.id
                });
                fetch(AppURI + '/api/post/getSpecificUserPosts/' + userId)
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
        this.getActiveUserSession().then((userSession) => {
            this.setState({ userObject: userSession });
            this.getSpecificUserPosts().then((userPosts) => {
                this.setState({ userPosts: userPosts });
            })
        })

    }
    render() {

        const user = this.state.userObject
        let profileUrl = ''
        user.forEach(element => {
            profileUrl = element.user.photoUrl
        });
        const userPosts = this.state.userPosts
        return (
            <Container style={styles.container}>
                <Card>
                    <CardItem>
                        <Left>
                            <Thumbnail source={{ uri: profileUrl }} />
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
                    </CardItem>
                </Card>
                <Container>
                    <Content>
                        {userPosts.map((prop, key) => {
                            return (
                                <PostShowCase postProp = {prop} key={key}/>
                            )
                        })}
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
    image: {
        // alignContent: "center",
        marginStart: 15,
        width: 340,
        height: 200,
        backgroundColor: 'gray',

    },
    iconogy: {
        // flex: 1, 
        flexDirection: "row"

    }
});