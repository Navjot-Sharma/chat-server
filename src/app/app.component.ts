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
  @ViewChild('text') textArea: ElementRef;
  sidenav = true;
  isLoading = false;
  status = 'Not connected';
  title = 'private-chat';
  userId = '';
  connectId = '';
  formValue = '';
  scrollTop = 0;
  msgs = [
    // {value: 'hello', id: 0},
    // {value: 'hey', id: 1},
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
    this.connectId = this.textArea.nativeElement.value;
    if (this.connectId !== this.userId && this.connectId) {
      this.status = 'Connecting...';
      this.isLoading = true;
      this.appService.connectFriend(this.connectId)
       .subscribe( response => {
         this.isLoading = false;
         this.status = response.status;
       });
    } else {
      this.snack.open('Please enter a valid id', 'Ok',
       {duration: 2000});
    }
  }
  onSubmit() {
    this.appService.sendMessage(this.formValue, this.connectId);
    this.msgs.push({value: this.formValue, id: 0});
    this.formValue = '';
    this.scrollTop += 900;
    document.scrollingElement.scrollTop = this.scrollTop;
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
        this.scrollTop += 900;
    document.scrollingElement.scrollTop = this.scrollTop;
     });
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
    this.msgSub.unsubscribe();
  }
}
