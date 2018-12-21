var path = require('path');

const jsonServer = require('json-server')
const server = jsonServer.create()
const dbFile = 'database.json' 
const router = jsonServer.router(path.join(__dirname,'public', dbFile))
console.log(path.join(__dirname,'public', dbFile));
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use(router)
server.listen(3001, () => {
  console.log('JSON Server is running')
})

module.exports = server