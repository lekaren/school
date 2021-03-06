import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import { WebView } from 'react-native-webview';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import axios from 'axios';
import Axios from 'axios';

const PUSH_REGISTRATION_ENDPOINT = 'http://13.125.246.18:3000/token';
const MESSAGE_ENPOINT = 'http://13.125.246.18:3000/message';

export default function App() {

  const [state, setState] = useState({
    notification: null,
    messageText: ''
  });

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();

    return axios.post(PUSH_REGISTRATION_ENDPOINT, {
      token: {
        value: token
      },
      user: {
        username: 'karen',
        name: 'mypushapp'
      }
    });
    const notificationSubscription = Notifications.addListener(handleNotification);
  };

  const handleNotification = (notification) => {
    setState({ notification });
  };

  const handleChangeText = (text) => {
    setState({ messageText: text });
  };

  const sendMessage = async (message) => {
    axios.post(MESSAGE_ENPOINT, {
      message
    });
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const getlunch = async() => {
    const data = await Axios.get("http://13.125.246.18:3000/lunch");
    const res = data.data.match(/[^<p>.*?</p>]/g).join("").match(/[^</1>]/g).join("").match(/[^a-zA-Z!="'오늘의 급식메뉴]/g).join("").trim();
    sendMessage(res)
  }
  useEffect(() => {
    getlunch()
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WebView 
        source={{ uri: 'http://www.samil.hs.kr/main.php' }}
      />
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textInput: {
    width: 300,
    height: 50,
    backgroundColor: 'silver'
  },
  button: {
    fontSize: 15,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  buttonText: {
    color: 'white'
  }
});