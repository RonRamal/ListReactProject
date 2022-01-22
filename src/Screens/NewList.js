import React, {Component} from 'react';
import { StyleSheet,Dimensions,Image,View, Alert } from 'react-native';
import { Container, H3, Content, Button, Left, Right, Text,H1,Item,Form,Input,Textarea } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NewList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ListTitle:"",
      ListDescription:"",
      image:"",
      hasCameraPermission: null,
    };
    this.CurrentUserID=0;
  }
 

  async componentDidMount() {

    const {userID} = this.props.route.params
    this.CurrentUserID=userID;
    //const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    this.setState({ hasCameraPermission: status === "granted" });  
  }


  //Fixed
  OpenGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
     allowsEditing: true,
     aspect: [4, 3]
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  }

  //Fixed
  OpenCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
     allowsEditing: true,
     aspect: [3, 3],
     quality:1
     
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  }

  
  PostListInServer=(NewCreatedList)=>{
  
    fetch(`http://10.0.0.9:53382/api/HubList`, {
      method: 'POST',
      body: JSON.stringify(NewCreatedList),
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
        console.log("fetch POST= ", result);
      },
      (error) => {
        console.log("err post=", error);
      });
    
  }

  SubmitList =()=>{

    
    let NewCreatedList = {
     ListName:this.state.ListTitle,
     ListDescription:this.state.ListDescription,
     ImageURL:this.state.image,
     ownerUserID:this.CurrentUserID,
    }    

    this.PostListInServer(NewCreatedList);

    this.setState({
      ListTitle:'',
      ListDescription:'',
      image:'',
    });
    
    this.props.navigation.goBack();
  }


  ValidateForm =()=>{

    let title=this.state.ListTitle;
    let description=this.state.ListDescription;

    if(title===''){
      alert("Missing List title");
    }else if(description===''){
      alert("Missing List description");
    }else{

      this.SubmitList;
    }
     
 }

  render() {
    const {image,hasCameraPermission,ListDescription,ListTitle} = this.state;
    const {navigation} = this.props.route.params
   
    if (hasCameraPermission === null) {
     return <View />;
    }
    else if (hasCameraPermission === false) {
     return <Text>Access to camera has been denied.</Text>;
    }
    else {
    return (
      <Container>
       <Content>
        <Grid style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Row>
                <Text style={styles.header}>Add New List</Text>
            </Row>
            <Col>           
                <Item rounded style={styles.ItemTitle} > 
                  <Input style={styles.titleInput} placeholder='List title...' placeholderTextColor='white' value={ListTitle} onChangeText={InputTitle=> this.setState({ListTitle: InputTitle})}/>
                </Item>
                
                <Item rounded style={styles.ItemDescription}>
                  <Textarea style={styles.titleInput} rowSpan={3} placeholder="List description..."  placeholderTextColor='white' value={ListDescription} onChangeText={InputDescription=> this.setState({ListDescription: InputDescription})} /> 
                </Item>
            </Col>
            <Col>
                  <Text>Image from galley/Camera (Optional)</Text>
              <Row>
                  <View style={styles.activeImageContainer}>
                    {image ? (<Image source={{ uri: image }}  style={{ flex: 1 }} />) : (<View/>)}
                  </View> 
                  <Button rounded info style={styles.Button} onPress={this.OpenCamera}>
                      <Text>Camera</Text>
                  </Button>
                  <Button rounded info style={styles.Button} onPress={this.OpenGallery}>
                      <Text>Gallery</Text>
                  </Button>
              </Row>    
            </Col>  

            <Row>
              <Button rounded success style={styles.SubmitButton} onPress={this.SubmitList} >
                <Text>Create List</Text>
              </Button>
            </Row>        
         </Grid>
        </Content>
      </Container>
    );
   }
  }
}
export default NewList;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  header:{
    fontWeight:"bold",
    fontSize:46,
    color:"#fb5b5a",
    marginBottom:40,
  },

  ItemTitle:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:20,
    height:50,
    marginBottom:40,
    justifyContent:"center",
    padding:20,
    borderWidth: 1,
  },
  ItemDescription:{
    width:'80%',
    backgroundColor:"#465881",
    borderRadius:20,
    height:90,
    marginBottom:40,
    padding:20,
    borderWidth: 1,
  },
  titleInput:{
   color:'white',
   fontSize:18,
   padding:10,
   width:'100%',

  },
  Button: {
    width:'35%'
  },
  SubmitButton:{
    width:'80%',
    justifyContent:'center',
    marginTop: 30,
  },
  activeImageContainer: {
    flex: 1,
    width: '30%',
    height:50 ,
    backgroundColor: "#eee",
    borderBottomWidth: 0.5,
    borderColor: "#fff",
    },
});
