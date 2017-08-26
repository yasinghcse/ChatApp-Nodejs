var express = require('express');
var app= express();
const port = process.env.PORT||3000;
const path= require('path');
const publicPath= path.join(__dirname,'../public');

//create route for all static pages
app.use(express.static(publicPath));

app.listen(port,()=>{
  console.log(`Listing at port ${port}`);
});

module.exports={app};
