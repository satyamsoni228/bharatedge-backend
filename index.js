const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./db/dbconn.js');
const allScripsKey = require('./scripSymbol.json');
const Scrip = require('./models/Scrip.js');
const Order = require('./models/Order.js');
const WatchlistItem = require('./models/WatchlistItem.js');
const routes = require('./routes/routes.js');
const watchlistRoutes = require('./routes/watchlist/WatchlistRoutes.js');
const { executeDailyAccessCodeTask } = require('./cronJob'); // Import the access code task
const { executeDailyTasks } = require('./scheduledTasks'); // Import the scheduled tasks

const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT;

const WebSocket = require("ws");

// Configure CORS to allow requests from localhost:3000 and allow credentials
app.use(cors({
    origin: 'http://localhost:3000',  // Adjust this to your client URL
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(routes);
app.use('/watchlist', watchlistRoutes);  // Use watchlist routes

app.get('/', (req, res) => {
  res.send('Welcome to Stockify APIs');
});

server.listen(port, async () => {
  console.log(`Server is running at ${port}`);

  // Run the daily access code task on server startup
  console.log('Running daily access code task on startup...');
  await executeDailyAccessCodeTask();

  // Run the daily cleanup tasks on server startup
  console.log('Running daily cleanup tasks on startup...');
  await executeDailyTasks();
});

const WebSocketServer = new WebSocket.Server({ server: server });

WebSocketServer.on('connection', function connection(ws, req) {
  ws.on('message', async function message(data, isBinary) {
    const userId = JSON.parse(data.toString());
    console.log("WS: ", userId);

    for await (const client of WebSocketServer.clients) {
      client.userId = userId;
      if (client === ws && client.readyState === WebSocket.OPEN) {
        const userWatchlist = await WatchlistItem.find({ userId: client.userId?.userId });

        let resp = {
          active: WebSocketServer.clients.size,
          belongs: "connection",
          watchlistSize: userWatchlist.length,
          scrips: userWatchlist
        }
        client.send(JSON.stringify(resp));
      }
    }
  });

  ws.on('close', () => console.log('Client has disconnected!'));
});
