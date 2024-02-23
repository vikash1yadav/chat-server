const path = require('path');

//importing env variables
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, 'config', 'config.env') });

//setting up express and middlewares
const express = require('express');
const app = express();
 
const port = process.env.PORT || 8080

var whitelist = ['https://mern-chatting.herokuapp.com/test','http://mern-chatting.herokuapp.com/test',
 'http://justnow.vercel.app', 'http://localhost:3000', 'https://localhost:3000',
];
const cors = require('cors');
// app.use(cors({
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200
// }));
app.use(cors());
//serving static files
app.use(express.static(path.join(__dirname, 'static')));

//for reading request.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));

//handling all rountes here
const routeHandler = require('./routes/routes');
app.use('/api', routeHandler);

app.use("/test", (req, res) => {
    res.status(200).send({ data: "This is justnowv1 server Index. Use the respective routes to begin." })
})


//handling all errors from routes here
const errorHandler = require('./errorHandler/errorHandler.middleware');
app.use(errorHandler);

//connecting to db
const connectDB = require('./connectDB/connectDb');
connectDB('chatApp');

//setting up http server
var server;
const http = require('http');
server = http.Server(app);
// if (process.env.mode === 'production') {
//     console.log("hit true");
//     const http = require('http');
//     server = http.Server(app);
// }
// else {
//     console.log("hit else");
//     const fs = require('fs');
//     const options = {
//         key: fs.readFileSync('key.pem'),
//         cert: fs.readFileSync('cert.pem')
//     };

//     server = require('https').Server(options, app);
// }

// init socket.io
const io = require('socket.io')(server,{
    cors: {
        origin: whitelist,//"http://localhost:3000",
         //"https://justnow.vercel.app",//whitelist,
        // methods: ["GET", "POST"]
    }
});

const socketHandler = require('./socketHandler/socketHandler');
socketHandler(io);


//setting up peerServer
// var ExpressPeerServer = require('peer').ExpressPeerServer;
// var options = {
//     debug: true
// }
// app.use('/peerjs', ExpressPeerServer(server, options));


 
//strarting server
server.listen(port, () => {
    console.log(`server listeneing on port ${port} in ${process.env.MODE} mode`);
});
// const io = require('socket.io') (server)
// const socketHandler = require('./socketHandler/socketHandler');
// socketHandler(io);
// app.use('/peerjs', ExpressPeerServer(server, options));

//close server on unhandeled rejections
// process.on('unhandeledRejection', (err, promise) => {
//     console.log("close server", err.message);
//     server.close(() => {
//         process.exit("terminating the process");
//     })
// });
