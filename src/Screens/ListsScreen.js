import React from 'react';
import { StyleSheet } from 'react-native';
import { Container,Header, Content, Button, Input, Item, Text ,Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import ListCard from '../Components/ListCard';

import { updateUser } from '../Redux/UserActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ListsScreen extends React.Component {

    constructor(props){
      super(props)
      this.state={      
        ListsToRender: [],
      };
      this.CurrentUserID=0;
  }


  //DONE
  componentDidMount(){

    const {UserID} = this.props.route.params;
    //alert(UserID);
    this.CurrentUserID = UserID;
    this._unsubscribeFocus = this.props.navigation.addListener('focus',(payload)=>{
     this.GetListsFromServerByUserID();
    });
  }  

  componentWillUnmount(){
    this._unsubscribeFocus();
  }


  //DONE
  GetListsFromServerByUserID = () => {

   let UserID=this.CurrentUserID;

    fetch(`http://10.0.0.9:53382/api/HubList?UserID=`+UserID, {
        method: 'GET',
        headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
        })
      })    
      .then(res => {
        console.log('res=', JSON.stringify(res));
        console.log('res.status', res.status);
        console.log('res.ok', res.ok);
        return res.json()
      })
      .then(
      (result) => {
        console.log("fetch GetListsFromServerByUserID= ", result);
        this.setState({
          ListsToRender:result,
        })
      },
      (error) => {
        console.log("err post=", error);
      });
  }

 //Done but Useless
  GetListsFromServer = () => {
    fetch(`http://10.0.0.9:53382/api/HubList`, {
        method: 'GET',
        headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
        })
      })    
      .then(res => {
        console.log('res=', JSON.stringify(res));
        console.log('res.status', res.status);
        console.log('res.ok', res.ok);
        return res.json()
      })
      .then(
      (result) => {
        console.log("fetch btnFetchGetStudents= ", result);
        this.setState({
          ListsToRender:result,
        })
      },
      (error) => {
        console.log("err post=", error);
      });
  }

 //DONE 
 RemoveUserFromList=(ClickedList)=>{
   
  let ListIDToBeRemoved = ClickedList.ListID;
  let UserID = this.CurrentUserID;

   fetch(`http://10.0.0.9:53382/api/ListUser?UserID=`+UserID+`&ListID=`+ListIDToBeRemoved, {
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
        console.log("fetch DELETE= ", result);

        if(result==1){
 
          let UserLists= this.state.ListsToRender;
          let ListsToRenderNew=[];
          UserLists.map((item =>{

              if(item.ListID!=ListIDToBeRemoved)
              {
                ListsToRenderNew.push(item);
              }
          }))  
          this.setState({
            ListsToRender:ListsToRenderNew,
          })
          alert("You have successfully removed yourself");
        }else{
          alert("You cant remove yourself from the table, Try Deleting");
        }
      },
      (error) => {
        console.log("err post=", error);
      });
}


 //Done
 DeleteListFromServer=(ClickedList)=>{
   
    let ListIDToDelete = ClickedList.ListID;
    let UserID = this.CurrentUserID;

     fetch(`http://10.0.0.9:53382/api/HubList?UserID=`+UserID+`&ListID=`+ListIDToDelete, {
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
          console.log("fetch DELETE= ", result);

          if(result==1){
   
            let UserLists= this.state.ListsToRender;
            let ListsToRenderNew=[];
            UserLists.map((item =>{

                if(item.ListID!=ListIDToDelete)
                {
                  ListsToRenderNew.push(item);
                }
            }))  
            this.setState({
              ListsToRender:ListsToRenderNew,
            })
            alert("Deleting table was a success");
          }else{
            alert("Only the table owner can delete the table,Try removing yourself");
          }
        },
        (error) => {
          console.log("err post=", error);
        });
 }
  
  render(){
    const {ListsToRender} = this.state;
    const {UserID} = this.CurrentUserID;
   return(
    <Container>
         <Text style={styles.StillHeader}>My Lists</Text>
          
          <Item style={styles.HeaderButtons}>
            <Button rounded style={styles.NewListBtn} onPress={() =>this.props.navigation.navigate('NewList',{userID:this.CurrentUserID})}>
                <Text style={{fontSize:15}}>New List</Text>   
                <Icon name="md-list" style={styles.ListIcon} />
            </Button>          
          </Item>
  
      <Content>
        <Grid style={{flex:1,justifyContent:'center',alignItems:'center', marginTop:20}}>
          <Col style={{width:'100%',margin:30}}>
           {   
            ListsToRender?.length>0&&
            ListsToRender.map((item,key)=><ListCard ClickedList={item} RemoveEvent={this.RemoveUserFromList} DeleteEvent={this.DeleteListFromServer} key={key} navigation={this.props.navigation} />)
           }
          </Col>     
        </Grid>
      </Content>  
    </Container>

   );
 }
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  header:{
    fontWeight:"bold",
    fontSize:48,
    color:"#fb5b5a",
    marginBottom:50,
   },

   StillHeader:{
    fontWeight:"bold",
    fontSize:48,
    color:"#fb5b5a",
    marginBottom:20,
    alignSelf:'center',
    marginTop:40,
   },
   HeaderButtons:{
    marginTop:20,
    paddingBottom:20,
   },
   NewListBtn:{
    width:150,
    marginLeft:20,
   },
   ListIcon:{
    marginLeft: 0, 
    marginRight: 0,
    fontSize: 40,
   },
});
export default connect(mapStateToProps,mapDispatchToProps)(ListsScreen)
