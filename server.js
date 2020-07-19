const express = require('express')

const app  = express()

app.use(express.static('public'))

const PORT = process.env.PORT || 3000
  
const server = app.listen(PORT,() =>
{console.log(`server started on port ${PORT}`)  }
)

let io = require('socket.io')(server) 

io.on('connection', (socket) => {
  console.log(`new connection ${socket.id}`)
  socket.on('comment', (data) => {
    data.time=Date()
    socket.broadcast.emit('comment',data)
  })

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing',data)
  })
})