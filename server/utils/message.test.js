const expect = require('expect');

var {generateMessage} = require('./message');

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
