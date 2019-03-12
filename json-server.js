var path = require('path');
var fs = require('fs');

const jsonServer = require('json-server')
const server = jsonServer.create()
const dbFile = 'database.json' 
const router = jsonServer.router(path.join(__dirname,'public', dbFile))
console.log(path.join(__dirname,'public', dbFile));
const middlewares = jsonServer.defaults()

server.use(middlewares)



server.get('/images/allSize',function(req,res,next){

  var imagePath = 'public/images/';

  var files = fs.readdir(imagePath,function(err,files){
      //console.log(files);
      //console.log(err);
      var total_size = 0;

      files.forEach(f => {
          
          var stat = fs.lstatSync(path.join(imagePath,f));
          total_size += stat.size;
          //console.log(stat.size);
          
          /*
          console.log(path.join(imagePath,f));
          var stats = fs.statSync(imagePath,f);
          console.log(stats);
          var size = fs.statSync(imagePath,f)["size"];
          console.log(size);
          */
      });
      console.log(total_size);
      res.setHeader('Content-Type','application/json');
      res.send(JSON.stringify({total_size:total_size/1024/1024}));
     
  });
});

server.use(router)
server.listen(3001, () => {
  console.log('JSON Server is running')
})

module.exports = server