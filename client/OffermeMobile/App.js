import React, { Component } from 'react';
import { Text, View, TextInput, Button, ListView } from 'react-native';
import Pusher from 'pusher-js/react-native';


const API_URL = 'http://localhost:9000/';
const PUSHER_APP_KEY = 'dc0082564549a4440b3c';
const PUSHER_APP_CLUSTER = 'ap2';

export default class HelloWorldApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      task: ''
    };
    this.updateText = this.updateText.bind(this);
    this.postTask = this.postTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }
  updateText(e) {
    this.setState({ task: e.target.value });
  }

  postTask(e) {
    e.preventDefault();
    if (!this.state.task.length) {
      return;
    }
    const newTask = {
      task: this.state.task
    };
    fetch(API_URL + 'new', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    }).then(console.log);
  }
  deleteTask(id) {
    fetch(API_URL + id, {
      method: 'delete'
    }).then(console.log);
  }

  addTask(newTask) {
    this.setState(prevState => ({
      tasks: prevState.tasks.concat(newTask),
      task: ''
    }));
  }

  removeTask(id) {
    this.setState(prevState => ({
      tasks: prevState.tasks.filter(el => el.id !== id)
    }));
  }
  componentDidMount() {
    this.pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
      encrypted: true,
    });
    this.channel = this.pusher.subscribe('tasks');

    this.channel.bind('inserted', this.addTask);
    this.channel.bind('deleted', this.removeTask);
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var taskname = '';
    let tasks = this.state.tasks.map(item =>
      taskname = item.task +'a'
    );
    console.log('@@@@@@@@@@@')
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={this.updateText}
          value={this.state.task}

        />
        <Button
          title={taskname}
          onPress={this.postTask}
        />
        {/* <input type="text" className="input-todo" placeholder="New task" onChange={this.updateText} value={this.state.task} />
          <div className="btn btn-add" onClick={this.postTask}>+</div> */}
        <ListView
        dataSource={ds.cloneWithRows(['row 1', 'row 2'])}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
      </View>
    );
  }
}

class Task extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
  }
  _onClick() {
    this.props.onTaskClick(this.props.task.id);
  }
  render() {
    return (
      <ListView
      dataSource={this.props.task.id}
      renderRow={(rowData) => <Text>{rowData}</Text>}
    />
    );
  }
}