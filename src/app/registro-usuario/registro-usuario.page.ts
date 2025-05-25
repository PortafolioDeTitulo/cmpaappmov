import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuLateralComponent } from '../componentes/menu-lateral/menu-lateral.component';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, 
         IonGrid, IonRow, IonCol, IonButton, IonItem, IonLabel, IonSelect, 
         IonSelectOption,  } from '@ionic/angular/standalone';
import { Validadores } from '../validador/validadores';
import { ToastController } from '@ionic/angular';
import { CentroServicio } from '../servicio/centro-servicio';
import { AutentificacionUsuario } from '../servicio/autentificacion-usuario';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonContent,  IonHeader, IonToolbar, IonInput,  MenuLateralComponent,
    IonGrid, IonRow, ReactiveFormsModule, IonCol, IonButton, IonItem, IonLabel, IonSelect, IonSelectOption,
    CommonModule, FormsModule, 
  ]
})
export class RegistroUsuarioPage implements OnInit {

  nombre: string = '';
  correo: string = '';
  rut: string = '';
  contraseña: string = '';
  rol: 'adminSistema' | 'conductor' | 'its' | 'solicitante' | 'coordinador' = 'solicitante';
  usarAPI: boolean = false;

  centros: {
    salud: any[];
    atm: any[];
    educacion: any[];
    central: any[];
  } = {
    salud: [],
    atm: [],
    educacion: [],
    central: []
  };

  registroForm!: FormGroup; 

   //Variables para mostrar campos dinámicamente
   showSolicitanteFields = false;
   showConductorFields = false;
   showCoordinadorFields = false;
   showItsFields = false;
   showAdminSistemaFields = false;

    showNivelCentralFields = false;
    showEducacionFields = false;
    showAtmFields = false;
    showSaludFields = false; 


  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private toastController: ToastController,
    private centroServicio: CentroServicio,
    private autentificacionUsuario: AutentificacionUsuario
  ) {}

  rolUsuario: string = '';

  //metodo para  mensajes de error
  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 20000,
      position: 'top',
      color: color
    });
    toast.present();
  }

  //validadores de formulario
  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.compose([Validators.required, Validadores.soloTexto])],
      apellidoPaterno: ['', Validators.compose([Validators.required, Validadores.soloTexto])],
      apellidoMaterno: ['', Validators.compose([Validators.required, Validadores.soloTexto])],
      rut: ['', Validators.compose([Validators.required, Validadores.validarRut])],
      correo: ['', Validators.compose([Validators.required, Validadores.correoValido])],
      contrasena: ['', Validators.compose([Validators.required, Validadores.contra])],
      cargo: ['', Validators.required], 
      centro: ['', Validators.required],
      areaDesempeno: ['', Validators.compose([Validators.required, Validadores.soloTexto])],
      departamento: ['', Validators.compose([Validators.required, Validadores.soloTexto])]
    });

    this.centros = {
      
      salud: this.centroServicio.obtenerCentros('salud'),
      atm: this.centroServicio.obtenerCentros('atm'),
      educacion: this.centroServicio.obtenerCentros('educacion'),
      central: this.centroServicio.obtenerCentros('central')
    };
   
  }

 async registrarUsuario() {
    const nuevoUsuario = {
      id: this.rut,
      rut: this.rut,
      usuario: this.correo,
      contraseña: this.contraseña,
      nombre: this.nombre,
      rol: this.rol,
      correo: this.correo
    };

    if (this.usarAPI) {
      this.autentificacionUsuario.registrarUsuarioAPI(nuevoUsuario).subscribe({
        next: res => {
          alert('Usuario registrado en servidor');
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error(err);
          alert('Error en registro API: ' + (err.error?.message || 'desconocido'));
        }
      });
    } else {
      const registrado = await this.autentificacionUsuario.registrarUsuarioLocal(nuevoUsuario);
      if (registrado) {
        alert('Usuario registrado localmente');
        this.router.navigate(['/login']);
      } else {
        alert('El usuario ya existe (local)');
      }
    }
  }

   async onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.mostrarToast('Lo sentimos, el formulario no está completo. Revisa tus errores.', 'danger');
      return;
    }
  
  
    const form = this.registroForm.value;

    const nuevoUsuario = {
      rut: form.rut,
      usuario: `${form.nombre} ${form.apellidoPaterno}`,
      contraseña: form.contraseña, 
      nombre: form.nombre,
      rol: form.cargo,
      correo: form.correo,
      centro: form.centro,
      areaDesempeno: form.areaDesempeno,
      departamento: form.departamento
      
    };

    const registrado = await this.autentificacionUsuario.registrarUsuarioLocal(nuevoUsuario);

    if (registrado) {
      this.mostrarToast('Usuario registrado con éxito', 'success');
      this.registroForm.reset();
      this.router.navigate(['/login']);
    } else {
      this.mostrarToast('El RUT ya está registrado.', 'danger');
    }
  }

  onCargoChange(event: any) {
    const selectedCargo = event.detail.value;

    // Restablecer los campos visibles
    this.showSolicitanteFields = false;
    this.showConductorFields = false;
    this.showCoordinadorFields = false;
    this.showItsFields = false;
    this.showAdminSistemaFields = false;
    

    // Mostrar campos según el cargo seleccionado
   if (selectedCargo === 'solicitante') {
      this.showSolicitanteFields = true;
    } else if (selectedCargo === 'conductor') {
      this.showConductorFields = true;
    } else if (selectedCargo === 'coordinador') {
      this.showCoordinadorFields = true;
    } else if (selectedCargo === 'its') {
     this.showItsFields = true;
    } else if (selectedCargo ==='adminSistema'){
      this.showAdminSistemaFields = true;
    }
 }

  onCentroChange(event: any) {
    
    const selectedCentro = event.detail.value;

    // Restablecer los campos visibles
    this.showNivelCentralFields = false;
    this.showEducacionFields = false;
    this.showAtmFields = false;
    this.showSaludFields = false;    

    // Mostrar campos según el cargo seleccionado
   if (selectedCentro === 'nivelCentral') {
      this.showNivelCentralFields = true;
    } else if (selectedCentro === 'educacion') {
      this.showEducacionFields = true;
    } else if (selectedCentro === 'atm') {
      this.showAtmFields = true;
    } else if (selectedCentro === 'salud') {
     this.showSaludFields= true;
    } 
  }


   // Navegaciones
   goToHomePage() {
    this.router.navigate(['/home']);
  }
  goToRegistroUsuarioPage() {
    this.router.navigate(['/registro-usuario']);
  }
  goToRegistroVehiculoPage() {
    this.router.navigate(['/registro-vehiculo']);
  }
  goToBitacoraPage() {
    this.router.navigate(['/bitacora']);
  }
  goToViajesSolicitadosPage() {
    this.router.navigate(['/viajes-solicitados']);
  }
  
  goToLoginPage() {
    this.router.navigate(['/login']);
  }


}
