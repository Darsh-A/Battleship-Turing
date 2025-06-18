# Server

This backend exposes a Socket.IO interface and relies on PostgreSQL via Drizzle ORM. Use the `SocketManager` class to register and emit events.

## Prerequisites

- Node.js v18 or newer
- A local PostgreSQL instance

## Installation

From the project root install all dependencies:

```bash
npm install
```

## Database setup

Install PostgreSQL with your package manager and then create an isolated cluster in the repository:

```bash
initdb -D server/pgdata
pg_ctl -D server/pgdata -l server/pgdata/logfile start
createdb battleship
```

Add the connection string in a `.env` file at the repository root:

```
DATABASE_URL=postgresql://localhost:5432/battleship
```

Stop the database when done:

```bash
pg_ctl -D server/pgdata stop
```

## Running the server

Start the Socket.IO server:

```bash
npm run server
```

It listens on port `3000` unless `PORT` is set.

## Quick test

Verify communication in a Node REPL:

```bash
node
> const { io } = require('socket.io-client');
> const s = io('http://localhost:3000');
> s.on('ping', m => { console.log('pong', m); });
> s.emit('ping', 'hello');
```

You should see `pong hello` in the console.
