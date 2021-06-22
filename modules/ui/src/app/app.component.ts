import { Component, OnInit } from '@angular/core';
import { IPCService } from './services/ipc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = '';
  header?: string;
  content?: string;
  constructor(private ipc: IPCService) { }
  async ngOnInit() {
    this.title = await this.ipc.invoke('title');
    this.header = await this.ipc.invoke('header')
    this.content = await this.ipc.invoke('content')
  }
}
