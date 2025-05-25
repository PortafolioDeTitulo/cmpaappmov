import { Injectable } from "@angular/core";
import { openDB, IDBPDatabase,  } from "idb";

export interface AgendaItem {
  fecha: string;
  horas: string[];
}

@Injectable({ providedIn: 'root' })

export class Agenda {
  private agenda: AgendaItem[] = [];
  private horaMin = '08:00';
  private horaMax = '17:30';

  constructor() {}

  // Inicializa la base de datos si no existe
  private async initDB(): Promise<IDBPDatabase<any>> {
    return await openDB('AppDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('viajesSolicitados')) {
          db.createObjectStore('viajesSolicitados', { keyPath: 'id' });
        }
      }
    });
  }

  async agregarHorario(fecha: string, hora: string): Promise<boolean> {
    if (hora < this.horaMin || hora > this.horaMax) return false;
    const dia = this.agenda.find(d => d.fecha === fecha);
    if (dia) {
      if (dia.horas.includes(hora)) return false;
      dia.horas.push(hora);
    } else {
      this.agenda.push({ fecha, horas: [hora] });
    }
    return true;
  }

  async obtenerHorarios(fecha: string): Promise<string[]> {
    const dia = this.agenda.find(d => d.fecha === fecha);
    return dia ? dia.horas : [];
  }

  async obtenerSolicitudes(): Promise<any[]> {
    const db = await this.initDB();
    const tx = db.transaction('viajesSolicitados', 'readonly');
    const store = tx.objectStore('viajesSolicitados');
    return await store.getAll();
  }
  
  async obtenerSolicitudPorId(id: string): Promise<any | undefined> {
    const db = await this.initDB();
    return await db.get('viajesSolicitados', id);
  }
  
  async eliminarSolicitud(id: string): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction('viajesSolicitados', 'readwrite');
    await tx.objectStore('viajesSolicitados').delete(id);
    await tx.done;
  }
  
  async filtrarSolicitudesPorCampo(campo: keyof any, valor: any): Promise<any[]> {
    const db = await this.initDB();
    const tx = db.transaction('viajesSolicitados', 'readonly');
    const store = tx.objectStore('viajesSolicitados');
    const items = await store.getAll();
    return items.filter(item => item[campo] === valor);
  }
  
  async actualizarEstadoSolicitud(id: string, nuevoEstado: string): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction('viajesSolicitados', 'readwrite');
    const store = tx.objectStore('viajesSolicitados');
    const solicitud = await store.get(id);
    if (solicitud) {
      solicitud.estado = nuevoEstado;
      await store.put(solicitud);
    }
    await tx.done;
  }
  
  async reagendarSolicitud(id: string, nuevaFecha: string, nuevaHora: string): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction('viajesSolicitados', 'readwrite');
    const store = tx.objectStore('viajesSolicitados');
    const solicitud = await store.get(id);
    if (solicitud) {
      solicitud.fecha = nuevaFecha;
      solicitud.hora = nuevaHora;
      await store.put(solicitud);
    }
    await tx.done;
  }

}