


export function GetUserIDByEmail(email){  

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
    },
    (error) => {
      console.log("err post=", error);
    });   
}


export function CheckIfUserExists(email){  

 
  fetch(`http://10.0.0.9:53382/api/User?email=`+email, {
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
      return result;
      
    },
    (error) => {
      console.log("err post=", error);
    });   
}


export function PostUserToServerFacebook(displayName,email){  

  let UserDetails={     
      UserName:displayName,
      UserEmail:email,       
  }
  fetch(`http://10.0.0.9:53382/api/User`, {
    method: 'POST',
    body: JSON.stringify(UserDetails),
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

export function PostUserToServer(email,lastName,firstName){  

    let name = firstName+" "+lastName;
    let UserDetails={     
        UserName:name,
        UserEmail:email,       
    }
    fetch(`http://10.0.0.9:53382/api/User`, {
      method: 'POST',
      body: JSON.stringify(UserDetails),
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