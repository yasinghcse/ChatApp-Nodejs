const expect = require('expect');
var {Users} = require('./users');

describe('Users', () => {
  var users;
  beforeEach(()=>{
    users= new Users();
    users.users=[{
      id: 1,
      name: "first",
      room: "one"
    },
    {
      id: 2,
      name: "second",
      room: "two"
    },
    {
      id: 3,
      name: "third",
      room: "one"
    }];
  });

  //TC 1 to add simple user
  it('should add new user',()=>{
    var users= new Users();
    var user = {
      id: 1,
      name: "User1",
      room: "Room1"
    };
    var result=users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  //TC 2 return name of all users of a room
  it('should return names of room one',()=>{
    var userList= users.getUserList('one');
    expect(userList).toEqual(['first', 'third']);
  });

  //TC 3 return name of all users of a room
  it('should return names of room two',()=>{
    var userList= users.getUserList('two');
    expect(userList).toEqual([ 'second']);
  });

  //TC 4 remove a valid users
  it('should remove a valid user',()=>{
    var user= users.removeUser(1);
    expect(user.id).toEqual(1);
    expect(users.users.length).toEqual(2);
  });

  //TC 5 should not remove a invalid user
  it('should not remove a invalid user',()=>{
    var user= users.removeUser(10);
    expect(user).toNotExist();
    expect(users.users.length).toEqual(3);
  });

  //TC6 should find a user
  it('should find a user',()=>{
    var user = users.getUser(1);
    expect(user.id).toEqual(1);
  });

  //TC 7 should not find a invalid user
  it('should not find a invalid user',()=>{
    var user = users.getUser(10);
    expect(user).toNotExist();
  });
});
