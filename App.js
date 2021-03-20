import React from 'react';
import * as firebase from 'firebase';
import AppLoading  from 'expo-app-loading';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import apiKeys from './config/keys';
import LoginScreen from './src/Screens/LoginScreen';
import SignUpScreen from './src/Screens/SignUpScreen';
import LoadingScreen from './src/Screens/LoadingScreen';
import HomeScreen from './src/Screens/HomeScreen';
import AboutScreen from './src/Screens/AboutScreen';
import ListsScreen from './src/Screens/ListsScreen'
import ItemsScreen from './src/Screens/ItemsScreen';
import NewList from './src/Screens/NewList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Container,Text,View,Icon } from 'native-base';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import userReducer from './src/Redux/UserReducer';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {

    if (!firebase.apps.length) {
      console.log('Connected with Firebase')
      firebase.initializeApp(apiKeys.firebaseConfig);
    }

    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });

    this.setState({ isReady: true });
  }


  render() {

    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
     <Provider store={store}>
      <NavigationContainer>
         <Stack.Navigator initialRouteName={'Loading'}>
           <Stack.Screen name="NewList" component={NewList} options={{ title: "NewList" }} />
           <Stack.Screen name="Loading" component={LoadingScreen} options={{headerShown:false}}  />
           <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
           <Stack.Screen name="Register" component={SignUpScreen} options={{headerShown:false}} />        
           <Stack.Screen name="Items" component={ItemsScreen} options={{ title: "" }} />
           <Stack.Screen name="Tab" component={myTabNavigator}  options={{headerShown:false}}/>
           {
             //<Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}  />
             //<Stack.Screen name="Lists" component={ListsScreen} options={{headerShown:false}} />
           }
         </Stack.Navigator>
      </NavigationContainer>
    </Provider>
    );
  }
}

//Create Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const store = createStore(userReducer);

function myTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home" backBehavior='history' tabBarOptions={{labelStyle:{fontSize:18}}}>
       <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel:'Profile',tabBarIcon: ({focused})=>(<Icon name="person-circle" style={{ fontSize:40}}/>)}}/>
       <Tab.Screen name="Lists" component={ListsScreen} options={{tabBarLabel:'UserArea',tabBarIcon: ({focused})=>(<Icon name="ios-home" style={{ fontSize:40}} />)}} />
       <Tab.Screen name="About" component={AboutScreen} options={{tabBarLabel:'About',tabBarIcon: ({focused})=>(<Icon name="ios-information-circle-sharp" style={{ fontSize:40}} />)}} />
    </Tab.Navigator>
  );
}

