import { Injectable } from "@angular/core";
import { Memorialocal } from "../almacen/memorialocal";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface UsuarioSimulado {
  rut: string;
  usuario: string;
  contraseña: string;
  nombre: string;
  rol: 'adminSistema' | 'conductor' | 'its' | 'solicitante' | 'coordinador';
  correo: string;
}

// Interface for the new user data to be sent to the API
interface NuevoUsuarioAPI {
  rut: string;
  username: string; // This will be the email/correo
  password: string; // Raw password, backend will hash
  nombre: string;
  rol: 'adminSistema' | 'conductor' | 'its' | 'solicitante' | 'coordinador';
  correo: string;
  centro?: string;
  areaDesempeno?: string;
  departamento?: string;
}
  
  @Injectable({
    providedIn: 'root'
  })

  

  export class AutentificacionUsuario {

    private apiUrl = 'http://localhost:3000/api/auth';
  
    constructor(
      private http: HttpClient
    ) {}


  //  REGISTRO usando API
  async login(usuario: string, contraseña: string): Promise<any> {
    if (navigator.onLine) {
      try {
        const res: any = await this.http.post(`${this.apiUrl}/login`, {
          username: usuario,
          password: contraseña
        }).toPromise();

        await Memorialocal.guardar('usuarioActivo', {
          id: res.username,
          username: res.username,
          rol: res.rol,
          token: res.token
        });

        return res;
      } catch (error) {
        throw error;
      }
    } else {
      const usuarios = await Memorialocal.obtener<UsuarioSimulado>('usuarios') || [];
      const local = usuarios.find(u => u.correo === usuario && u.contraseña === contraseña);
      if (local) {
        await Memorialocal.guardar('usuarioActivo', { ...local, id: local.correo });
        return local;
      } else {
        throw new Error('Sin conexión y sin datos locales válidos');
      }
    }
  }

  loginAPI(correo: string, contraseña: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      username: correo,
      password: contraseña
    });
  }

  // REGISTRO local (offline)
  async registrarUsuarioLocal(nuevoUsuario: UsuarioSimulado): Promise<boolean> {
    const usuarios = await Memorialocal.obtener<UsuarioSimulado>('usuarios') || [];
    const existe = usuarios.some(u => u.rut === nuevoUsuario.rut || u.correo === nuevoUsuario.correo);
    if (existe) return false;

    await Memorialocal.guardar('usuarios', {
      ...nuevoUsuario,
      id: nuevoUsuario.correo
    });
    return true;
  }


  //  REGISTRO online (API)
  registrarUsuarioAPI(usuario: NuevoUsuarioAPI): Observable<any> {
    // The backend expects 'password' for the raw password, and 'username' for the login identifier.
    // All other fields from NuevoUsuarioAPI are passed through.
    const payload = {
      username: usuario.username, // This is the correo
      password: usuario.password, // Sending raw password, backend will hash
      rol: usuario.rol,
      nombre: usuario.nombre,
      rut: usuario.rut,
      correo: usuario.correo, // Keep original correo field as well
      centro: usuario.centro,
      areaDesempeno: usuario.areaDesempeno,
      departamento: usuario.departamento
    };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  async logout(): Promise<void> {
    await Memorialocal.limpiarTodo();
  }

  async obtenerUsuarioActivo(): Promise<UsuarioSimulado | null> {
    const usuarios = await Memorialocal.obtener<UsuarioSimulado>('usuarioActivo');
    return usuarios ? usuarios[0] : null;
  }

  async obtenerRolActivo(): Promise<string | null> {
    const usuario = await this.obtenerUsuarioActivo();
    return usuario?.rol || null;
  }

  async estaLogeado(): Promise<boolean> {
    const activo = await Memorialocal.obtener('usuarioActivo');
    return activo !== null;
  }
  }