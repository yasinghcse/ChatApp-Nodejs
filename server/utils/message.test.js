const expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  //sync function testing
  it('should generate correct message object',()=>{
    var from = "Yadi";
    var text= "Hi..!!!!";
    var result = generateMessage(from,text);
    expect(result).toInclude({from,text});
    expect(result.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  //sync function testing
  it('should generate correct message object',()=>{
    var from = "Admin";
    var longitude= 234;
    var latitude= 1234;
    var url=`https://www.google.com/maps?q=${latitude},${longitude}`;
    var result = generateLocationMessage(from,latitude,longitude);
    expect(result).toInclude({from,url});
    expect(result.createdAt).toBeA('number');
  });
});
