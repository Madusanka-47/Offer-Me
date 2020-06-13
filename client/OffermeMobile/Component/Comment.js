import React, { PureComponent } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import GlobalConfig from '../global_config.json'

const AppURI = GlobalConfig.RESTServiceURI;

export default class Comment extends PureComponent {

  static propTypes = {
    comment: PropTypes.shape({
      content: PropTypes.string.isRequired,
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  deleteComment = async (id_) => {
    try {
      fetch(AppURI + '/api/PostComment/removecomment/' + id_, {
        method: 'DELETE'
      });
    } catch (error) {
      ToastAndroid.showWithGravity(
        "Something went wrong. please contact support",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  }

  render() {
    const { comment } = this.props;
    const { content, created, user } = comment;
    const { name, avatar } = user;
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {avatar && <Image
            resizeMode='contain'
            style={styles.avatar}
            source=
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
              {this.props.comment.created_at}
            </Text>
            {this.props.loguserId == this.props.comment.user.userid && this.props.loguserId != '' ? (
              <TouchableOpacity activeOpacity={.5} onPress={() => this.deleteComment(this.props.comment.commentid)}>
                <Icon name="delete-circle" size={30} style={{ alignSelf: 'flex-end', paddingRight: 10, color: '#878787' }} />
              </TouchableOpacity>

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