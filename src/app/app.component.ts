import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { Menu, MenuItem } from './servicio/menu';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {

  menuItems: MenuItem[] = [];

  constructor(
    private menuServicio: Menu
  ) {}

  ngOnInit() {
    const rol = (localStorage.getItem('rol') || 'usuario') as 'adminSistema' | 'its' | 'conductor' | 'solicitante'
    | 'coordinador' ;
    this.menuItems = this.menuServicio.getMenuItems(rol);
  }
}
