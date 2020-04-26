const { app, BrowserWindow } = require('electron')
const net = require('net');

// ELECTRON window

function createWindow () {
  let win = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html');
}

app.whenReady().then(createWindow)

// ======== connection to arduino

const IP = '192.168.31.29';
const PORT = 80;

var client = new net.Socket();
client.connect(PORT, IP, function() {
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

function sendToArduino(arg) {
    console.log('sending', arg);
    client.write(arg);
}

//======= COMM BETWEEN ELECTRON AND HTML and forwarding to Arduino

const { ipcMain } = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
    sendToArduino(arg);
})

ipcMain.on('synchronous-message', (event, arg) => {
    sendToArduino(arg);
})
