import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import ActivityFeed from './AppTabNavigator/ActivityFeed'
import CommentList from './CommentList'
import CreateUserPost from './CreateUserPost'
import UserProfile from './UserProfile'


const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainStackScreen() {
    return (
        <MainStack.Navigator>
            <MainStack.Screen name="Offer Me" component={ActivityFeed} />
            <MainStack.Screen options={{ headerTitle: false }} name="Comments" component={CommentList} />
        </MainStack.Navigator>
    );
}

export default class MainScreen extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Home" component={MainStackScreen} />
                    <Tab.Screen name="Post" component={CreateUserPost} />
                    <Tab.Screen name="Profile" component={UserProfile} />
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
}



