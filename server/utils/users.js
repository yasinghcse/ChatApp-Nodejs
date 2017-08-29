class Users{

  //constructor to intialise the array
  constructor(){
    this.users=[];
  }

  //Add a new user to the array
  addUser(id, name, room){
    var user= {id, name, room};
    this.users.push(user);
    return user;
  }

  //getUserList to get all users name from the particular room
  getUserList(room){

    //filter all users of the input room
    var users= this.users.filter((user)=>{
      return user.room===room;
    });

    //map only the name from the retured users list
    var namesArray= users.map((user)=>{
      return user.name;
    });

    return namesArray;
  }

  //get Users by an id
  getUser(id){
    //filter user of the input id
    var user= this.users.filter((user)=>{
      return user.id===id;
    });
    return user[0];
  }

  //remove user by id
  removeUser(id){
    //check if the user exists
    var user= this.getUser(id);
    if(user){
      this.users= this.users.filter((user)=> user.id!= id);
    }
    return user;
  }

}

module.exports= {Users};
