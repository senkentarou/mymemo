const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // レンダラー → メイン
    sendMemos: async (channel, data) => { return await ipcRenderer.invoke(channel, data) },
    fetchMemos: async () => { return await ipcRenderer.invoke('fetchMemos') },

    // メイン → レンダラー
    // on: (channel, callback) => ipcRenderer.on(channel, (event, argv) => callback(event, argv))
  }
);
