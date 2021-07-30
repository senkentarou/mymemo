import { BrowserWindow, app } from 'electron';

const mainURL = `file://${__dirname}/index.html`;
let mainWindow: BrowserWindow | null = null;

// アプリ起動後にWindowを立ち上げる
const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: { nodeIntegration: true } // webページを開くなら脆弱性があるので設定を見直す
  });

  mainWindow.loadURL(mainURL);
  // 開発者ツールも同時に開く場合はコメント外す
  // mainWindow.webContents.openDevTools();

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
