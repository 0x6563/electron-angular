import * as Electron from "electron";

export class ElectronService {
    private static electron: typeof Electron;
    private static _connected: (v: unknown) => void;
    static connected = new Promise(res => ElectronService._connected = res)
    static connect(electron: typeof Electron) {
        ElectronService.electron = electron;
        (this._connected as unknown as any)();
    }
    static async ipcMainHandle(path: string, callback: any) {
        await ElectronService.connected;
        ElectronService.electron.ipcMain.handle(path, callback)
    }
}

export function ServiceRoute(path: string, options: any, callback: any) {
    return ElectronService.ipcMainHandle(path, typeof callback == 'function' ? callback : () => callback)
}