import { BrowserWindow, app, ipcMain } from 'electron';
import ElectronStore from 'electron-store';

const mainURL = `file://${__dirname}/index.html`;
let mainWindow: BrowserWindow | null = null;

const store = new ElectronStore();

// アプリ起動後にWindowを立ち上げる
const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: `${__dirname}/preload.js`
    }
  });

  mainWindow.loadURL(mainURL);
  // 開発者ツールも同時に開く場合はコメント外す
  // mainWindow.webContents.openDevTools();
  // データを全削除したい場合はコメント外す
  // store.clear()

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// アプリの起動と終了
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  app.quit();
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC通信
ipcMain.handle('sendMemos', async (_, data) => {
  store.set('data', data);

  return store.get('data');
});

ipcMain.handle('fetchMemos', async () => {
  return store.get('data');
});
