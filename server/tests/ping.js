import { io } from "socket.io-client"

const s = io("ws://localhost:3000")
s.emit("ping", "hello")
s.on("ping", m => {
  console.log(m)
  s.disconnect()
})
