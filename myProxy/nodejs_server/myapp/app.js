var express = require('express')
var app = express()

app.all('*',function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    next();
})

app.get('/', function(req, res){
    res.send('Hello World!');
})

app.get('/ajax', function(req, res){
    res.send('Ajax Get');
})
app.post('/ajax', function (req, res) {
  res.send('Ajax Post');
})

app.listen(3000, function(){
    console.log("Example app listening on port 3000!")
})