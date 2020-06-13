import React, { Component } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  ToastAndroid
} from 'react-native';
import Comment from './Comment';
import Pusher from 'pusher-js/react-native';
import UserInput from './UserInput'
import GlobalConfig from '../global_config.json'
import * as Network from 'expo-network';

const AppURI = GlobalConfig.RESTServiceURI;

export default class List extends Component {

  constructor({ props, route, navigation }) {
    super(props);
    this.state = {
      comments: [],
      refreshing: true,
      tasks: [],
      task: '',
      routerParam: route.params,
      userObject: []
    };

    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }

  submitComment = async (comment) => {
    try {
      const mac = await Network.getMacAddressAsync();
      const commentParam = JSON.stringify({
        MAC: mac,
        postid: this.state.routerParam.postId,
        content: comment
      })

      fetch(AppURI + '/api/PostComment/createComment', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: commentParam
      });

    } catch (error) {
      ToastAndroid.showWithGravity(
        "Something went wrong. please contact support",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }

  };

  addTask(newTask) {
    if (this.state.routerParam.postId == newTask.postid) {
      this.setState(prevState => ({
        comments: prevState.comments.concat(newTask),
        task: ''
      }));
    }

  }

  removeTask(id) {
    this.setState(prevState => ({
      comments: prevState.comments.filter(el => el._id !== id)
    }));
  }
  getUserPostComments(postId) {
    try {

      return new Promise((reslove, reject) => {
        fetch(AppURI + '/api/PostComment/getPostComments/' + postId, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        })
          .then((response) => response.json())
          .then((userComments) => {
            reslove(userComments);
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

  componentDidMount() {
    this.getUserPostComments(this.state.routerParam.postId).then((comments) => {
      this.setState({ comments: comments });
    })

    this.getActiveUserSession().then((userSession) => {
      this.setState({ userObject: userSession });
    })
    this.pusher = new Pusher('dc0082564549a4440b3c', {
      cluster: 'ap2',
      encrypted: true,
    });
    this.channel = this.pusher.subscribe('post_comment');

    this.channel.bind('inserted', this.addTask);
    this.channel.bind('deleted', this.removeTask);

  }

  render() {
    const { comments } = this.state;
    let user = this.state.userObject
    let userId = ''
    let optionEnable = false
    user.forEach(element => {
      userId = element.user.id
    });
    return (
      <View style={styles.container}>
        <ScrollView>
          {comments.map((comment, index) => <Comment comment={comment} key={index} loguserId={userId} />)}
        </ScrollView>
        <UserInput placeholder={'Add a comment...'} buttonName={'Post'} onSubmit={this.submitComment} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 20,
  }
});