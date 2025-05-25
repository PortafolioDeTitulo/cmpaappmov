import { openDB, IDBPDatabase } from 'idb';

export interface BaseItem {
  id: string;
}

export class Memorialocal {
  private static dbPromise: Promise<IDBPDatabase>;

  private static initDB(): Promise<IDBPDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = openDB('AppDB', 2, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('usuarios')) {
            db.createObjectStore('usuarios', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('vehiculos')) {
            db.createObjectStore('vehiculos', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('viajesSolicitados')) {
            db.createObjectStore('viajesSolicitados', { keyPath: 'id' }); 
          }
        }
      });
    }
    return this.dbPromise;
  }

  static async guardar<T extends BaseItem>(clave: string, datos: T | T[]): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(clave, 'readwrite');
    const store = tx.objectStore(clave);

    if (Array.isArray(datos)) {
      for (const dato of datos) {
        await store.put(dato);
      }
    } else {
      await store.put(datos);
    }

    await tx.done;
  }

  static async obtener<T>(clave: string): Promise<T[]> {
    const db = await this.initDB();
    return await db.getAll(clave);
  }

  static async eliminar(clave: string, id: string): Promise<void> {
    const db = await this.initDB();
    await db.delete(clave, id);
  }

  static async limpiarTodo(): Promise<void> {
    const db = await this.initDB();
    for (const storeName of db.objectStoreNames) {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).clear();
      await tx.done;
    }
  }

  static async existe(clave: string, id: string): Promise<boolean> {
    const db = await this.initDB();
    const result = await db.get(clave, id);
    return result !== undefined;
  }

  static async actualizarPorCampo<T extends BaseItem>(
    clave: string,
    campo: keyof T,
    valor: T[keyof T],
    transformador: (item: T) => T
  ): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(clave, 'readwrite');
    const store = tx.objectStore(clave);
    const items = await store.getAll() as T[];
    const index = items.findIndex(item => item[campo] === valor);
    if (index !== -1) {
      const actualizado = transformador(items[index]);
      await store.put(actualizado);
    }
    await tx.done;
  }

  static async eliminarPorCampo<T>(clave: string, campo: keyof T, valor: any): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(clave, 'readwrite');
    const store = tx.objectStore(clave);
    const items = await store.getAll() as T[];
    const nuevaLista = items.filter((item: any) => item[campo] !== valor);
    for (const item of nuevaLista) {
      await store.put(item);
    }
    await tx.done;
  }

  static async buscarPorCampo<T>(clave: string, campo: keyof T, valor: any): Promise<T | undefined> {
    const db = await this.initDB();
    const store = db.transaction(clave, 'readonly').objectStore(clave);
    const items = await store.getAll() as T[];
    return items.find(item => item[campo] === valor);
  }

  static async reemplazarPorCampo<T extends BaseItem>(
    clave: string,
    campo: keyof T,
    valor: T[keyof T],
    nuevoObjeto: T
  ): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(clave, 'readwrite');
    const store = tx.objectStore(clave);
    const items = await store.getAll() as T[];
    const index = items.findIndex(item => item[campo] === valor);
    if (index !== -1) {
      await store.put(nuevoObjeto);
    }
    await tx.done;
  }

  
}
