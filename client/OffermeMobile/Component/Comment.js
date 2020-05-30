import React, { PureComponent } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
// import moment from 'moment';
import PropTypes from 'prop-types';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class Comment extends PureComponent {

  static propTypes = {
    // Comment object shape
    comment: PropTypes.shape({
      content: PropTypes.string.isRequired,
      created: PropTypes.string.isRequired,
      // User object shape
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    // Pull comment object out of props
    const { comment } = this.props;
    // Pull data needed to display a comment out of comment object
    const { content, created, user } = comment;
    // Pull user name and avatar out of user object
    const { name, avatar } = user;
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {avatar && <Image
            resizeMode='contain'
            style={styles.avatar}
            source=
            // {require('../../assets/me.png')}
            {{ uri: avatar }}
          />}
        </View>
        <View style={styles.contentContainer}>
          <Text>
            <Text style={[styles.text, styles.name]}>{name}</Text>
            {' '}
            <Text style={styles.text}>{content}</Text>
          </Text>
          <View style={styles.commentView}>
            <Text style={[styles.text, styles.created]}>
              {/* {moment(created).fromNow()} */}
              {this.props.comment.created_at}
            </Text>
            {this.props.loguserId == this.props.comment.user.userid && this.props.loguserId != '' ? (
              <MaterialIcon
                style={{ alignSelf: 'flex-end', paddingRight: 10 }}
                name={'delete-circle'}
                size={30}
                onPress={this.deleteComment}
              />
            ) : (
                <View></View>
              )}
          </View>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  avatarContainer: {
    alignItems: 'center',
    marginLeft: 5,
    paddingTop: 10,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    padding: 5,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 100,
  },

  text: {
    color: '#000',
    // fontFamily: 'Avenir',
    fontSize: 15,
  },
  name: {
    fontWeight: 'bold',
  },
  created: {
    color: '#BBB',
  },
  commentView: {
    flexDirection: "row",
    justifyContent: 'space-between',
  }
});