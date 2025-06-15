# Server

This backend exposes a Socket.IO interface and connects to PostgreSQL through Drizzle ORM. Use the `SocketManager` class to register and emit events.

Run with:

```bash
npm run server
```

Configure the database by setting `DATABASE_URL`.
