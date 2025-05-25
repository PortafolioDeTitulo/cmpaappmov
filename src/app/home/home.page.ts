import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonTitle, IonToolbar, IonIcon, IonButton} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  imports: [IonContent,  IonTitle, IonToolbar, CommonModule, IonButton, FormsModule, IonIcon] 
})
export class HomePage implements OnInit {

  constructor(private router: Router) {addIcons({person});}

  // Método para redirigir al login
  goToLoginPage() {
    this.router.navigate(['/login']);
  }


  ngOnInit() {
  }

}
