import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import ActivityFeed from './AppTabNavigator/ActivityFeed'
import CommentList from './CommentList'
import CreateUserPost from './CreateUserPost'
import UserProfile from './UserProfile'
// import TestLogin from './AppLogin'

import MeterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';


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
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ forcused, color, size }) => {
                            let iconName;
                            switch (route.name) {
                                case 'Home': iconName = forcused ? 'home-circle' : 'home-circle'; break;
                                case 'Post': iconName = forcused ? 'card-text' : 'card-text'; break;
                                case 'Profile': iconName = forcused ? 'account-circle' : 'account-circle'; break;
                            }
                            return <MeterialIcon name={iconName} size={30} color={color} />;
                        },
                    })}
                >
                    <Tab.Screen name="Home" component={MainStackScreen} options={({ route }) => ({
                        tabBarVisible: this.getTabBarVisibility(route)
                    })} />
                    <Tab.Screen name="Post" component={CreateUserPost} />
                    <Tab.Screen name="Profile" component={UserProfile} />
                    {/* <Tab.Screen name="TestLogin" component={TestLogin} /> */}
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
    getTabBarVisibility(route) {
        const routeName = route.state ? route.state.routes[route.state.index].name : '';
        if (routeName === 'Comments') {
            return false;
        }
        return true;
    }
}



