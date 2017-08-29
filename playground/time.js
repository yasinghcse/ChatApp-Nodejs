const moment = require('moment');
var date = moment();

//date maipulation
date.add(1, 'year');

//date formatting
console.log(date.format('h:mm a'));
