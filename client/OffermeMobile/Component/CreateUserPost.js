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
    Input,
    Spinner
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
import Dialog from "react-native-dialog";

const AppURI = GlobalConfig.RESTServiceURI;

export default class CreateUserPost extends React.Component {
    state = {
        image: null,
        show: false,
        imgresult: Object,
        userObject: [],
        userPosts: [],
        dialogVisible: false,
        postText: '',
        dateNo: undefined,
        inputCol: '',
        validInput: false,
        progressStrt: false
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
    createUserPost = () => {

        this.setState({
            progressStrt: true,
            show: false
        });
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
        imgBody.append('description', this.state.postText);
        imgBody.append('email', user.email);
        imgBody.append('familyName', user.familyName);
        imgBody.append('id', user.id);
        imgBody.append('name', user.name);
        imgBody.append('photoUrl', user.photoUrl);
        imgBody.append('expDate', this.state.dateNo);

        fetch(AppURI + '/api/post/createUserPost', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: imgBody
        }).then(res => res.json()).then(results => {

            this.setState({progressStrt: false});
            console.log(results)
        }).catch(error => {
            console.error(error);
        });
        console.log(this.state.imgresult)
        console.log(this.state.postText)

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

    showDialog = (postText) => {
        this.setState({
            dialogVisible: true,
            postText: postText
        });
    };

    handleCancel = () => {
        this.setState({ dialogVisible: false });
    };

    handleConfirm = () => {
        if (this.state.validInput) {
            this.setState({ dialogVisible: false });
            this.createUserPost()
        }

    };

    onChangeText = (dateNo) => {
        this.setState({ dateNo })
        if (dateNo == undefined || dateNo === '') {
            this.setState({
                inputCol: 'red',
                validInput: false
            })
        } else {
            this.setState({
                inputCol: 'black',
                validInput: true
            })
        }
    };

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
        let profileUrl = 'https://storage.googleapis.com/scraphub-store/AppData/template.png'
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
                                <UserInput placeholder = {'Found anything?...'}  buttonName = {'Create'} onSubmit={this.showDialog} />
                                <Dialog.Container visible={this.state.dialogVisible}>
                                    <Dialog.Title>Set Expire Date</Dialog.Title>
                                    <Dialog.Description>
                                        Offer valid for ?
                                    </Dialog.Description>
                                    <Dialog.Input wrapperStyle={{ borderBottomWidth: 1, width: 200, alignSelf: "center", borderBottomColor: this.state.inputCol }} keyboardType='numeric' onChangeText={this.onChangeText}></Dialog.Input>
                                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                                    <Dialog.Button label="Ok" onPress={this.handleConfirm} />
                                </Dialog.Container>
                            </Body>
                        </Left>
                    </CardItem>
                    {this.state.progressStrt ? (
                        <Spinner color="#000000" />
                    ) : (null)}
                    <CardItem>
                        {this.state.show ? (
                            <ImageBackground style={styles.image} source={{ uri: this.state.image }}>
                                <View>
                                    <MaterialIcon
                                        style={{ alignSelf: 'flex-end', paddingTop: 5, paddingRight: 5, color: '#e32020' }}
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
                            color={'#1e54b4'}
                            onPress={this.selectPicture} />
                        <MaterialIcon
                            name={'camera'}
                            size={35}
                            color={'#1e54b4'}
                            onPress={this.getNewPhoto} />
                    </CardItem>
                </Card>
                <Container>
                    <Content>
                        {userPosts.map((prop, key) => {
                            return (
                                <PostShowCase postProp={prop} key={key} />
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