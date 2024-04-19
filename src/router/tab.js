import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from '../page/home';
import User from '../page/user';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Tabs = createBottomTabNavigator();

export default function HomeTabs(){
    return(
            <Tabs.Navigator
              screenOptions={({route}) => ({
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: '#DBE000',
                  paddingBottom: 10,
                  height: 80,
                  // borderTopRightRadius: 60,
                  // borderTopLeftRadius: 60,
                },
                tabBarLabelStyle: {fontSize: 14, fontWeight: 'bold'},
              })}>
              <Tabs.Screen
                name="Home"
                component={Home}
                options={{
                  headerrShown: false,
                  tabBarIcon: ({color, size}) => (
                    <Icon name="home" size={40} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="User"
                component={User}
                screenOptions={{headerShown: false}}
                options={{
                  tabBarIcon: ({color, size}) => (
                    <Icon name="user" size={40} color={color} />
                  ),
                }}
              />
            </Tabs.Navigator>
    )
}