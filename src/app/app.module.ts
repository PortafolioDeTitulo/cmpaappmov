import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { HomePage } from './home/home.page';
import { LoginPage } from './login/login.page';
import { RegistroUsuarioPage } from './registro-usuario/registro-usuario.page';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    LoginPage,
    RegistroUsuarioPage // Declara aquí otros componentes del módulo
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([])  // Configura tus rutas aquí
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }