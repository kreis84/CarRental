import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  showLoader:boolean = true;

  constructor(public loaderApi: LoaderService){}
  ngOnInit(){
    this.loaderApi.status.subscribe((value) => {
      console.log(value);
      this.showLoader = value
    });
  }
}
