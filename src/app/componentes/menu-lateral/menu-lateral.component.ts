import { Component, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA, isStandalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Menu, MenuItem } from 'src/app/servicio/menu';

import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonMenuToggle
} from '@ionic/angular/standalone';

type RolValido = 'adminSistema' | 'its' | 'solicitante' | 'coordinador' | 'conductor';

function esRolValido(rol: string): rol is RolValido {
  return ['adminSistema', 'its', 'solicitante', 'coordinador', 'conductor'].includes(rol);
}

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonMenuToggle, CommonModule, RouterModule
  ]

})
export class MenuLateralComponent  implements OnInit {

  @Input() rol: string = '';
  menuItems: MenuItem[] = [];

  constructor(private menu: Menu) {}

  ngOnInit() {
    if (esRolValido(this.rol)) {
      this.menuItems = this.menu.getMenuItems(this.rol);
    } else {
      this.menuItems = this.menu.getMenuItems('solicitante'); // puedes cambiar el default
    }
  }

}
