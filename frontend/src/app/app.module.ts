import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent        // ✅ ONLY AppComponent here
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

