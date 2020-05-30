import React, { Component } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Button
} from 'react-native';
import Comment from './Comment';
import PropTypes from 'prop-types';
import Pusher from 'pusher-js/react-native';
import UserInput from './UserInput'
import { useNavigation } from '@react-navigation/native';
import GlobalConfig from '../global_config.json'
import * as Network from 'expo-network';

const AppURI = GlobalConfig.RESTServiceURI;
// const API_URL = 'http://localhost:9000/api/';

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

    // this.updateText = this.updateText.bind(this);
    // this.postTask = this.postTask.bind(this);
    // this.deleteTask = this.deleteTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }



  // Fetch comments when component is about to mount
  //   componentWillMount = () => this.fetchComments();

  // Re-fetch comments when user pulls the list down
  //   onRefresh = () => this.fetchComments();

  // Call API to fetch comments
  //   fetchComments = async () => {
  //     this.setState({ refreshing: true });
  //     try {
  //       // Make API call
  //       const response = await get('comments');
  //       // Convert response to JSON
  //       const json = await response.json();
  //       this.setState({
  //         refreshing: false,
  //         comments: json.comments
  //       });
  //     }
  //     catch (error) {
  //       alert(error);
  //     }
  //   };

  // Call API to submit a new comment
  submitComment = async (comment) => {
    // const { user } = this.props;
    // this._scrollView.scrollTo({ y: 0 });
    // try {
    //   // Make API call
    //   const response = await put('comments', {
    //     user_id: user._id,
    //     content: comment,
    //   });
    //   // Convert response to JSON
    //   const json = await response.json();
    //   this.setState({
    //     // Push new comment to state before existing ones
    //     comments: [json.comment, ...this.state.comments]
    //   });
    // }
    // catch (error) {
    //   alert(error);
    // }
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
      console.error(error);
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
      console.error(error);
    }
  }

  getActiveUserSession() {
    try {

      return new Promise((reslove, reject) => {
        Network.getMacAddressAsync().then((mac) => {

          fetch(AppURI + '/api/user/getUserAuthSession/' + mac, {
            // method: 'GET',
            // headers: {
            //   Accept: 'application/json',
            //   'Content-Type': 'application/json'
            // },
            // body: {MAC:'a'}
          })
            .then((response) => response.json())
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
    // let abc = this.state.tasks.map(itm => itm)
    // this.state.comments.push(this.state.task)
    // console.log(this.state.comments)
    // const { navigate } = this.props.navigation;
    // Pull comments out of state
    // const { params } = this.props.navigation.state;
    // const itemId = params ? params.itemId : null;
    // const { params } = this.props.navigation.state;
    const { comments } = this.state;
    let user = this.state.userObject
    let userId = ''
    let optionEnable = false
    user.forEach(element => {
      userId = element.user.id
    });
    return (
      
      <View style={styles.container}>
        {/* <Button
        onPress={() => this.props.navigation.navigate('MyModal')}
        title="Close"
      /> */}
        {/* Scrollable list */}
        <ScrollView
        // ref={(scrollView) => { this._scrollView = scrollView; }}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={this.state.refreshing}
        //   //   onRefresh={this.onRefresh}
        //   />
        // }
        >
          {/* Render each comment with Comment component */}
          {comments.map((comment, index) => <Comment comment={comment} key={index} loguserId = {userId} />)}
        </ScrollView>
        {/* Comment input box */}
        <UserInput onSubmit={this.submitComment} />
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