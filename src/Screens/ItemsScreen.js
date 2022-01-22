import React, { Component } from 'react';
import { StyleSheet,Modal,Dimensions, } from 'react-native';
import { Container,Text,View,Content,Button,Item,Icon,Input} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import ItemCard from '../Components/ItemCard';

const { width } = Dimensions.get("window"); 


class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ItemsToRender:[],
      ItemInput:'',
      QuantityInput:'',
      isModalVisible:'',
      NewAuthUser:'',
    };
    this.CurrentList='';
  }

  //Done
  componentDidMount(){
    const {ListID} = this.props.route.params;
    this.CurrentList = ListID;

    this._unsubscribeFocus = this.props.navigation.addListener('focus',(payload)=>{
      this.CurrentList = ListID;
      this.GetItemsListFromServer(ListID);
    });
  }

  //Done
  componentWillUnmount(){
    this._unsubscribeFocus();
  }
 
  // Create toggleModalVisibility function that will 
  // Open and close modal upon button clicks. 
  toggleModalVisibility = () => { 

      let newModalView= !(this.state.isModalVisible);
      this.setState({
        isModalVisible:newModalView,
      }); 
  }; 
  //Done
  GetItemsListFromServer=(ListID)=> {
 
    let FetchURL = `http://10.0.0.9:53382/api/Items`;
    let Parameter = ListID;

    fetch(`http://10.0.0.9:53382/api/Items?id=`+Parameter, {
      method: 'GET',
      headers: new Headers({
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json; charset=UTF-8',
      })
    })    
    .then(res => {
      console.log('res=',  JSON.stringify(res));
      console.log('res.status', res.status);
      console.log('res.ok', res.ok);
      return res.json()
    })
    .then(
    (result) => {
      console.log("fetch GetItemsFromServerByListID= ", result);
      this.setState({
        ItemsToRender:result,
      })
    },
    (error) => {
      console.log("err post=", error);
    });

    
  }

  //Done
  SendItemToServer = () =>{
   
    let Quantity = this.state.QuantityInput;
    let ItemInput = this.state.ItemInput;
    
    if(Quantity === ''){
       alert("Please Insert Item Name");
    }else if(ItemInput === ''){
       alert("Please Insert Item Quantity");
    }else{
     
      let ItemToSend = {     
        Name:ItemInput,
        Quantity:Quantity,
        ListID:this.CurrentList
      }

      fetch(`http://10.0.0.9:53382/api/Items`, {
        method: 'POST',
        body: JSON.stringify(ItemToSend),
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
          this.setState({
            ItemsToRender:result,
          })
        },
        (error) => {
          console.log("err post=", error);
        });  
     
      this.setState({
        ItemInput:'',
        QuantityInput:'',
      })

    }   
  }


  AddUserToList=()=>{
    
    let UserEmail = this.state.NewAuthUser;
    let ListID = this.CurrentList;

    if(UserEmail===''){
      alert("Insert user email");
    }else{

      fetch(`http://10.0.0.9:53382/api/ListUser?ListId=`+ListID, {
        method: 'POST',
        body: JSON.stringify(UserEmail),
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
           
          if(result ==2){
            alert("User Doesnt Exist!");
          }
          if(result==0)
          {
             alert("User is already in the list");
          }
          if(result==1){
            alert("User Has been successfully added to the list");
          }      
        },
        (error) => {
          console.log("err post=", error);
        });  
    }

    this.toggleModalVisibility();
    this.setState({
      NewAuthUser:'',
    })
    
  }

 //Done
  EditItemFromList=(ItemID)=>{

    let Quantity = this.state.QuantityInput;
    let ItemInput = this.state.ItemInput;
    
    if(Quantity === ''){
       alert("Please Insert Item Name (Edit)");
    }else if(ItemInput === ''){
       alert("Please Insert Item Quantity (Edit)");
    }else{
     
      let ItemToSend = {     
        Name:ItemInput,
        Quantity:Quantity,
        ListID:this.CurrentList
      }

      fetch(`http://10.0.0.9:53382/api/Items?id=`+ItemID, {
        method: 'PUT',
        body: JSON.stringify(ItemToSend),
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
  
          this.setState({
            ItemsToRender:result,
            ItemInput:'',
            QuantityInput:'',

          })
        },
        (error) => {
          console.log("err post=", error);
        });  
    }   
  }
  //Done
  deleteItemsFromList=(Item)=>{
   
    let itemIDToDelete = Item.ItemID;

    fetch(`http://10.0.0.9:53382/api/Items?id=`+itemIDToDelete, {
      method: 'DELETE',
      //body: JSON.stringify(ItemToSend),
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


      let ItemsList= this.state.ItemsToRender;
      let ItemsToRenderNew=[];

      ItemsList.map((item =>{
        if(item.ItemID!=itemIDToDelete){
          ItemsToRenderNew.push(item);
        }
     }))

     this.setState({
       ItemsToRender:ItemsToRenderNew,
     })
   }
 
  render() {
     const {ListID,ListTitle} = this.props.route.params;
     const {ItemsToRender,QuantityInput,ItemInput,isModalVisible,NewAuthUser} = this.state;
    return (
      <Container>

        <Item style={styles.HeaderView}>
          <Text style={styles.header}>{ListTitle}</Text>
        </Item>

        <Item style={styles.HeaderButtons}>
          <Item  style={styles.ItemTitle}> 
              <Input style={styles.titleInput} value={ItemInput} onChangeText={ItemInt=> this.setState({ItemInput: ItemInt})} placeholder='Add Item...' placeholderTextColor='white'/>
          </Item> 

          <Item  style={styles.ItemQty}> 
              <Input style={styles.titleInput} value={QuantityInput} onChangeText={Qty=> this.setState({QuantityInput: Qty})} placeholder='#' placeholderTextColor='white' keyboardType='decimal-pad'/>
          </Item> 

          <Item> 
            <Button style={styles.AddItemBtn} onPress={this.SendItemToServer}>
                <Icon name="md-add-circle-sharp" style={styles.DoneIcon} />
            </Button>   
            <Button style={styles.AddUserBtn} onPress={this.toggleModalVisibility}>
                <Icon name="person-add" style={styles.AddUser} />
            </Button>   
          </Item>        
        </Item>  
      
      <Content>
      <Modal animationType="slide" 
                   transparent visible={isModalVisible}  
                   presentationStyle="overFullScreen" 
                   onDismiss={this.toggleModalVisibility}> 
                <Item style={styles.viewWrapper}> 
                    <Item style={styles.modalView}> 
                        <Input placeholder="User Email..." value={NewAuthUser} style={styles.textInput} onChangeText={(value) => this.setState({NewAuthUser:value})} />                
                       <Button title="Close" onPress={this.toggleModalVisibility}>
                          <Icon name="close" style={styles.AddUser} />
                        </Button>      
                    </Item> 
                </Item> 
                 <Button success rounded style={styles.inviteBtn} onPress={this.AddUserToList}>
                      <Text>Send Invite...</Text>
                 </Button>  
            </Modal> 
        <Grid style={styles.GridStyle}>
  
          <Col style={styles.MainCol}>
            {
              ItemsToRender.length>0&&
              ItemsToRender.map((item,key)=><ItemCard Item={item} key={key} DeleteEvent={this.deleteItemsFromList} EditEvent={this.EditItemFromList}/>)
            }
          </Col>          
        </Grid>     
      </Content>           
    </Container>
    );
  }
}

export default Category;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  GridStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
  },
  MainCol:{
    width:'100%',
    margin:20,
  },
  HeaderView:{
    marginTop:10,
  },
  HeaderButtons:{

  },
  DoneIcon:{
    marginLeft: 0, 
    marginRight: 0,
    fontSize: 50,
  },
  AddUser:{
    marginLeft: 0, 
    marginRight: 0,
    fontSize: 40,
  },
  inviteBtn:{
    alignSelf:'center',
  },
  AddItemBtn:{
    alignSelf: 'flex-end',
    paddingTop: 0,
    paddingBottom: 0,
    height: 45,
    width: 45,
    justifyContent: "center",
    marginRight:10,
  },
  AddUserBtn:{
    alignSelf: 'flex-end',
    paddingTop: 0,
    paddingBottom: 0,
    height: 45,
    width: 45,
    justifyContent: "center",
  },
  header:{
    fontWeight:"bold",
    fontSize:35,
    color:"#fb5b5a",
    marginBottom:10,
    marginLeft:20,

  },
  ItemTitle:{
    backgroundColor:"#465881",
    marginTop:15,
    marginBottom:15,
    width:'50%',
    borderRadius:20,
    paddingLeft:10
    
  },
  ItemQty:{ 
    backgroundColor:"#465881",
    marginTop:15,
    marginBottom:15,
    width:'13%',
    marginLeft:10,
    marginRight:10,
    borderRadius:20,
    paddingLeft:5,
  },

  SubmitButton:{
    borderRadius:25,
    backgroundColor:"#465881",
    height:40,
    width:"30%",
    justifyContent:"center",
    padding:10,
    width:"30%",
  },
  titleInput:{
    color:'white',
    fontSize:16,
  },
  viewWrapper: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    }, 
  modalView: { 
    position: "absolute", 
    top: "50%", 
    left: "50%", 
    elevation: 5, 
    transform: [{ translateX: -(width * 0.4) },  
                { translateY: -90 }], 
    height: 200, 
    width: width * 0.8,
    
    backgroundColor: "#fff", 
    borderRadius: 7,
    paddingLeft:35,
  }, 
  textInput: { 
    width: "80%", 
    borderRadius: 5, 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderColor: "rgba(0, 0, 0, 0.2)", 
    borderWidth: 1, 
    marginBottom: 8, 
  }, 
});
