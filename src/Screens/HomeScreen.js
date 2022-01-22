import React, { useEffect, useState  } from 'react';
import { Container,Content, Button,Text,Icon} from 'native-base';
import { StyleSheet, ImageBackground,Alert,View,Image } from 'react-native';
import { Col,Row, Grid } from 'react-native-easy-grid';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import {loggingOut} from '../../API/firebaseMethods';
import {GetUserIDByEmail} from '../../UserMethods/UserAPI';
import { useLinkProps } from '@react-navigation/native';

import { updateUser } from '../Redux/UserActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


function HomeScreen({navigation,UserId,updateUser})  {
  
  let currentUserUID = firebase.auth().currentUser.uid;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileUrl,setProfileUrl] = useState('');  
  const [userID, setUserID] = useState('');


  //Replace ComponentDidMount and ComponentDidUpdate
  useEffect(() => {

      async function getUserInfo(){
      
        let user = await firebase.auth().currentUser;
         if(user != null)
         {      
            let UserProviderName = '';

              user.providerData.forEach((userInfo) => {
                console.log('User info for provider: ', userInfo);
              UserProviderName=userInfo.providerId;

            });
            if(UserProviderName==='facebook.com'){             
                setFirstName(user.displayName);
                setEmail(user.email);
                setProfileUrl(user.photoURL);
                UpdateID();
            }else
            {
                let doc = await firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .get();

                if (!doc.exists){
                  alert("UserNotSigned");
                } else {
                  let dataObj = doc.data();                
                  setLastName(dataObj.lastName);
                  setFirstName(dataObj.firstName);
                  setEmail(dataObj.email);
                  UpdateID();
                }    
            }                      
         }         
      }
    getUserInfo();
  })


  const UpdateID=()=>{

    fetch(`http://10.0.0.9:53382/api/ListUser?email=`+email, {
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
        console.log("fetch GetUserIDByEmail= ", result);
        setUserID(result);
      //  updateUser(result);
      },
      (error) => {
        console.log("err post=", error);
      });   
      
  }

  const handlePress = () => {
    loggingOut();
    navigation.replace('Login');
  };

  return ( 
    <Container>
      <ImageBackground  source={require('../../assets/background2.jpg')} style={styles.background} >
       <Text style={styles.Text}> SharedList</Text>
        <Grid>      
          <Row>
              <Button style={styles.LogOutButton} onPress={handlePress} rounded >
                <Text style={styles.LogOutText}>LogOut</Text>  
                <Icon name="md-exit-outline" />
              </Button>    
          </Row>   
          <Col styles={styles.UserDetails}> 
              <Text style={styles.UserText}>UserID={userID}</Text>
              <Text style={styles.UserText}>Welcome!, {firstName} {lastName}</Text>
              <Text style={styles.UserText}>{email}</Text>    
          </Col> 
          <Row style={styles.SecondRow} >
              <Button style={styles.Button} onPress={() => navigation.navigate('Lists',{UserID:userID})} large rounded success>
                <Text>Start Writing!</Text>
              </Button>          
          </Row> 
          <Row style={styles.ThirdRow}>
            <Text style={styles.MiniText}> React Native Notes App </Text>
          </Row>   
        </Grid>
      </ImageBackground>
    </Container>
  );
}

const mapStateToProps = (state) => {
  const { UserId } = state
  console.log("UserId==============>>"+UserId);
  return { UserId }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateUser,
  }, dispatch)
);
const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%'
  },
  UserText:{
    fontSize:20,
    fontWeight:'bold',
    marginLeft:15,
  },
  SecondRow:{
     height:380,
     flex:1,
     alignItems: 'center',
     justifyContent: 'center',
  },
  ThirdRow:{
    height:150,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
 },
  UserDetails:{
  },
  Text:{
    fontWeight:"bold",
    fontSize:48,
    color:"#fb5b5a",
    marginBottom:20,
    alignSelf:'center',
    marginTop:40,
  },
  MiniText:{
    fontSize:14,
    fontWeight:'bold',
    color:'white'

  },
  LogOutButton:{
    marginTop:20,
    width:150,
    marginLeft:25,
  },
  LogOutText:{
    
  },
});

export default connect(mapStateToProps,mapDispatchToProps)(HomeScreen);
