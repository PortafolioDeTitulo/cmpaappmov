import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
         IonList, IonItem, IonLabel, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchCircle } from 'ionicons/icons';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.page.html',
  styleUrls: ['./bitacora.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonSearchbar
  ]
})
export class BitacoraPage implements OnInit {
  constructor(private router: Router) {
    addIcons({ searchCircle });
  }

  ngOnInit() {
    // Inicialización del componente
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }
}
