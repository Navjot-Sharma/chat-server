import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root'})

export class AppService {
  private url = 'http://localhost:3000';
  private userId;
  private idListener = new Subject<any>();
  private msgListener = new Subject<any>();

  constructor(private http: HttpClient,
              private socket: Socket) {}

  get UserId() {
    return this.userId;
  }
  getUserIdListener() {
    return this.idListener.asObservable();
  }
  getMessageListener() {
    return this.msgListener.asObservable();
  }
  startConnection() {
    this.socket.connect();
  }
  getConnection() {
    this.socket.on('connect', () => {
      this.userId = this.socket.ioSocket.id;
      this.idListener.next(this.userId);
    });
  }
  sendMessage(msg, id) {
    const obj = {id, value: msg};
    this.socket.emit('message1', obj);
  }
  receiveMessage() {
    this.socket.on('reply', (msg) => {
      this.msgListener.next(msg);
    });
  }

  connectFriend(id) {
    return this.http.get<{status: string}>(this.url + '/' + id);
  }
}
