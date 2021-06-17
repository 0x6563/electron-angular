import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
export class IPCService {
  ipcRenderer: typeof ipcRenderer;
  constructor() {
    this.ipcRenderer = (window as any).require('electron').ipcRenderer;
  }

  invoke(channel: string, ...args: any[]) {
    return this.ipcRenderer.invoke(channel, args);
  }
}
