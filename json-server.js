var path = require('path');

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname,'public', 'db.json'))
console.log(path.join(__dirname,'public', 'db.json'));
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use(router)
server.listen(3001, () => {
  console.log('JSON Server is running')
})

module.exports = server