const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // レンダラー → メイン
    send: async (channel, data) => { return await ipcRenderer.invoke(channel, data) },
    getText: async () => { return await ipcRenderer.invoke('getText') },

    // メイン → レンダラー
    // on: (channel, callback) => ipcRenderer.on(channel, (event, argv) => callback(event, argv))
  }
);
