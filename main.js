const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path')
const url = require('url')

let win = null

function createOrShowWindow() {
    if (win === null) {
        const screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width
        const screenHeight = electron.screen.getPrimaryDisplay().workAreaSize.height
        const width = 300
        const height = 100
        const padding = 20
        const posX = parseInt(screenWidth) - (width + padding)
        const posY = parseInt(screenHeight) - (height + padding)

        win = new BrowserWindow({ 
            width: width, 
            height: height, 
            frame: false,
            backgroundColor: '#2e2c29', 
            alwaysOnTop: true, 
            x: posX, 
            y: posY + 20
        })

        win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
        }))

        win.on('closed', () => {
            win = null
        })

        // win.webContents.openDevTools()
    }

    // if (!win.isFocused()) {
    //     win.focus()
    // }
}

let showInterval = setInterval(createOrShowWindow, 3000)

app.on('ready', createOrShowWindow)
app.on('activate', createOrShowWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        clearInterval(showInterval)
        app.quit()
    }
})

