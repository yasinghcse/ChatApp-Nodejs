const expect = require('expect');

var {isRealString} = require('./validation');
describe('isRealString', () => {

  //TC-1
  it('should reject non-string value',()=>{
    var str = 123;
    var result = isRealString(str);
    expect(result).toEqual(false);
  });

  //TC-2
  it('should reject string with only space',()=>{
    var str = "     ";
    var result = isRealString(str);
    expect(result).toEqual(false);
  });

  //TC-3
  it('should allow string with no sapces',()=>{
    var str = "validString";
    var result = isRealString(str);
    expect(result).toEqual(true);
  });
});
