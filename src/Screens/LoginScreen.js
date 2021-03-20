import React, { useState } from 'react';
import * as Facebook from 'expo-facebook';
import { StyleSheet, View,Alert,Image, TextInput,Text,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {signIn} from '../../API/firebaseMethods';
import "firebase/firestore";
import firebase from "firebase";
import {PostUserToServerFacebook} from '../../UserMethods/UserAPI';
import {CheckIfUserExists} from '../../UserMethods/UserAPI';

function LoginScreen ({navigation}) {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [lblErr, setlblErr] = useState('');
  const [check ,setCheck] = useState(0);


  const handlePress = () => {
    if (!email) {
      Alert.alert('Email field is required.'); 
    }else
    {
      if (!password) {
        Alert.alert('Password field is required.');
      }
    }

    signIn(email, password);
    setEmail('');
    setPassword('');
  };

  const btnFBLogin = async() => {
    try {
        await Facebook.initializeAsync({
          appId: '802022317193125',
        });
        const { type, token, expires, permissions, declinedPermissions, } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
        });

        if (type === 'success')
        {            
           await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
           const credential = firebase.auth.FacebookAuthProvider.credential(token);
           const facebookProfileData = await firebase.auth().signInWithCredential(credential);
    
           let user = await firebase.auth().currentUser;   
           
            if(user != null){                 
                CheckIfUserExists(user.email,user.displayName);                    
              }        
        }else{ 
          type === 'cancel' 
        }
        }catch({ message }) 
        {
          alert(`Facebook Login Error: ${message}`);
        }
  };

const btnFetch_PersonPicture = () => {
    // POST adds a random id to the object sent
    fetch(`https://graph.facebook.com/me?fields=picture&access_token=${this.state.token}`, {
    method: 'POST',
    body: '',
    headers: {
    "Content-type": "application/json; charset=UTF-8"
     }
    })
    .then(response => response.json())
    .then(json => {
        if (json != null) 
        {
            this.setState({ photoUrl: json.picture.data.url });
            alert(`picture= ${json.picture}\npicture.data.url= ${(json.picture.data.url)}\nRES=${JSON.stringify(json)}`);
        }
        else
        {
        this.setState({ lblErr: true });
        }
    });
  };
    
  const CheckIfUserExists = (email,displayName) => {  

    fetch(`http://10.0.0.1:53382/api/User?email=`+email, {
      method: 'GET',
     // body: JSON.stringify(UserDetails),
      headers: new Headers({
      'Content-type': 'application/json; charset=UTF-8', //very important to add the 'charset=UTF-8'!!!!
      Accept: 'application/json; charset=UTF-8',
      })
    })
      .then((res) => {
        console.log('res=', JSON.stringify(res));
        return res.json();
      })
      .then(
      (result) => {
        console.log("fetch CheckIfUserExistsFacebook= ", result);
        
        if(Number.parseInt(result,10)==1)
        {
          
        }else{
            PostUserToServerFacebook(displayName,email);      
        }      
      },
      (error) => {
        console.log("err post=", error);
      });   
  }
  return (

  <View style={styles.container}>

        <Text style={styles.logo}>MyList</Text>

        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Email..." 
            placeholderTextColor="#003f5c"
            value={email}
            onChangeText={(email) => setEmail(email)}
            autoCapitalize="none"/>
        </View>

        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..." 
            placeholderTextColor="#003f5c"
            value={password}
            onChangeText={(password) => setPassword(password)}/>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={handlePress}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.facebookBtn} onPress={btnFBLogin}>     
         <Text style={styles.loginText}> 
          <Ionicons name="md-logo-facebook" size={20}/> Login with Facebook
         </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.SignUpBtn} onPress={() =>navigation.navigate('Register')}  >
          <Text style={styles.loginText}>SignUp</Text>
        </TouchableOpacity>
  </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#003f5c',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:30,
    marginTop: 40,
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  Pic:{
    width:"60%",
    height:100,
    backgroundColor:"#465881",

  },
  inputText:{
    height:50,
    color:"white",
    fontSize:18
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
  },
  facebookBtn:{
    width:"80%",
    backgroundColor:"#3b5998",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
  },
  SignUpBtn:{
 
    marginTop:20,
  },
  loginText:{
    color:"white",
    fontSize:18
  }
});
export default LoginScreen;
