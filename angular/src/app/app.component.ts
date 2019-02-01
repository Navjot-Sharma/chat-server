import { AppService } from './app.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  sidenav = true;
  isLoading = false;
  status = 'Not connected';
  title = 'private-chat';
  userId = '';
  connectId = '';
  formValue = '';
  msgs = [
    {value: 'hello', id: 0},
    {value: 'hey', id: 1},
  ];
  idSub: Subscription;
  msgSub: Subscription;

  constructor(private appService: AppService,
              private snack: MatSnackBar) {}

  copyClipboard() {
    const event = (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', this.userId);
      e.preventDefault();
    };
    document.addEventListener('copy', event);
    document.execCommand('copy');
    this.snack.open('Copied to clipboard', 'Ok',
      {duration: 2000});
  }
  pasteClipboard(el) {
    // el.focus();
    // document.execCommand('paste');
  }

  onConnect() {
    if (this.connectId !== this.userId && this.connectId) {
      this.status = 'Connecting...';
      this.isLoading = true;
      this.appService.connectFriend(this.connectId)
       .subscribe( response => {
         this.isLoading = false;
         this.status = response.status;
       });
    } else {
      this.snack.open('Please enter a valid id', 'Ok');
    }
  }
  onSubmit() {
    this.appService.sendMessage(this.formValue, this.connectId);
    this.msgs.push({value: this.formValue, id: 0});
    this.formValue = '';
  }
  ngOnInit() {
    this.appService.startConnection();
    this.appService.getConnection();

    this.idSub = this.appService.getUserIdListener()
     .subscribe( id => {
       this.userId = id;
       this.appService.receiveMessage();
      } );
    this.msgSub = this.appService.getMessageListener()
     .subscribe( msg => {
       console.log('component');
        this.msgs.push({value: msg, id: 1});
     });
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
    this.msgSub.unsubscribe();
  }
}
