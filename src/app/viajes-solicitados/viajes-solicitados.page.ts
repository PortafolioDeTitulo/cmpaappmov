import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routes } from '../app.routes';
import {     } from '@ionic/angular/standalone';
import { MenuLateralComponent } from '../componentes/menu-lateral/menu-lateral.component';
import { Agenda, AgendaItem } from '../servicio/agenda';
import { IonCard, IonButton, IonCardContent, IonCardHeader, IonCardSubtitle, 
  IonCardTitle, IonItem, IonLabel } from '@ionic/angular/standalone';
  import { ToastController } from '@ionic/angular'


@Component({
  selector: 'app-viajes-solicitados',
  templateUrl: './viajes-solicitados.page.html',
  styleUrls: ['./viajes-solicitados.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ IonCard, IonButton, IonCardContent, IonCardHeader, IonCardSubtitle, 
    IonCardTitle, IonItem, IonLabel, CommonModule, FormsModule, MenuLateralComponent]
})
export class ViajesSolicitadosPage implements OnInit {
  solicitudes: any[] = [];
  rolUsuario: string = '';

  constructor(
    private agenda: Agenda,
    private toastController: ToastController
  ) {}

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  async ngOnInit() {
    await this.cargarSolicitudes();
  }

  async cargarSolicitudes() {
    this.solicitudes = await this.agenda.obtenerSolicitudes() || [];
  }

  async aceptarSolicitud(id: string) {
    await this.agenda.actualizarEstadoSolicitud(id, 'aceptado');
    await this.cargarSolicitudes();
    this.mostrarToast('Solicitud aceptada.');
  }


  async rechazarSolicitud(id: string) {
    await this.agenda.actualizarEstadoSolicitud(id, 'rechazado');
    await this.cargarSolicitudes();
    this.mostrarToast('Solicitud rechazada.');
  }

  async actualizarEstado(id: string, nuevoEstado: string) {
    await this.agenda.actualizarEstadoSolicitud(id, nuevoEstado);
    await this.cargarSolicitudes(); 
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

 
}