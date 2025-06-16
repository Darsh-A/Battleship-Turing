import "dotenv/config"
import { SocketManager } from "./lib/socket"
import { connect } from "./lib/db"

interface Events {
  ping: string
}

await connect()

const socket = new SocketManager<Events>()
socket.on("ping", (client, msg) => client.emit("ping", msg))
socket.start(Number(process.env.PORT) || 3000)

