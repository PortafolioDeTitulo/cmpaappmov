import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutentificacionUsuario } from '../servicio/autentificacion-usuario';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonInput, IonButton
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { logInOutline, atSharp, lockClosed } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ CommonModule,  FormsModule, IonContent, IonHeader, IonTitle,
    IonToolbar, IonList, IonItem, IonInput, IonButton
  ]
})
export class LoginPage implements OnInit {

  usuario: string = '';
  contraseña: string = '';
  mensaje: string = '';

  constructor(
    private router: Router,
    private authService: AutentificacionUsuario
  ) { addIcons({atSharp,lockClosed,logInOutline});}

  async login() {
    try {
      await this.authService.login(this.usuario, this.contraseña);
      this.router.navigate(['/home']);
    } catch (err: any) {
      alert(err.message || 'Error al iniciar sesión');
    }
  }

  goToRegistroUsuarioPage() {
    this.router.navigate(['/registro-usuario']);
  }

  goToRecuperarContrasenaPage() {
    this.router.navigate(['/recuperar-contrasena']);
  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }

  ngOnInit() {}
}