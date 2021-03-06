import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as firebase from 'firebase';

export default function LoadingScreen({ navigation }) {

  useEffect( () => {
    
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          navigation.replace('Tab');
        } else {
          navigation.replace('Login');
        }
      });
    }
  );

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color="#0000ff" />
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center"
    },
 
  
});