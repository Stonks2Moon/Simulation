import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbCardModule, NbInputModule, NbToggleModule, NbButtonGroupModule, NbStepperModule, NbButtonModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ChartComponent } from './chart/chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { RouterModule } from '@angular/router';
import { InputboxComponent } from './inputbox/inputbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    InputboxComponent,
  ],
  imports: [
    NbSelectModule,
    BrowserModule,
    HttpClientModule,
    NbInputModule,
    NbToggleModule,
    NbButtonModule,
    NbButtonGroupModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbLayoutModule,
    NbEvaIconsModule,
    RouterModule.forRoot([]),
    NbCardModule,
    NbStepperModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    ReactiveFormsModule,
    FormsModule,
    NbSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
