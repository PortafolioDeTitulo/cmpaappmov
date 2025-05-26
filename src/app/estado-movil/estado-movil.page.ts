import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router para navegación
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Interfaz para definir la estructura de un vehículo
interface Vehiculo {
  titulo: string; // Título del vehículo
  estado: string; // Estado actual del vehículo
  lugar: string; // Ubicación del vehículo
  imagen: string; // Ruta de la imagen del vehículo
}

@Component({
  selector: 'app-estado-movil',
  templateUrl: './estado-movil.page.html',
  styleUrls: ['./estado-movil.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class EstadoMovilPage implements OnInit {
  // Lista de vehículos que se mostrarán en la página
  vehiculos: Vehiculo[] = [
    {
      titulo: 'Vehículo 1',
      estado: 'Disponible',
      lugar: 'Estacionamiento A',
      imagen: 'assets/img/vehiculo1.jpg'
    },
    {
      titulo: 'Vehículo 2',
      estado: 'En uso',
      lugar: 'Ruta 5',
      imagen: 'assets/img/vehiculo2.jpg'
    },
    {
      titulo: 'Vehículo 3',
      estado: 'Mantenimiento',
      lugar: 'Taller',
      imagen: 'assets/img/vehiculo3.jpg'
    }
    // Puedes agregar más vehículos aquí
  ];

  constructor(private router: Router) { } // Inyectar el servicio Router para navegación

  ngOnInit() {
    // Método que se ejecuta al inicializar el componente
  }

  // Método para obtener el color del estado del vehículo
  getStatusColor(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'disponible': return 'success'; // Verde para disponible
      case 'en uso': return 'warning'; // Amarillo para en uso
      case 'mantenimiento': return 'danger'; // Rojo para mantenimiento
      default: return 'medium'; // Gris para estados desconocidos
    }
  }

  // Método para identificar cada vehículo en la lista (para mejorar el rendimiento)
  trackByFn(index: number, item: Vehiculo): string {
    return item.titulo; // Usar el título como identificador único
  }

  // Método para manejar el evento de scroll infinito
  onIonInfinite(event: any) {
    setTimeout(() => {
      event.target.complete(); // Finalizar el evento de scroll infinito
    }, 500);
  }

  // Método para manejar el botón "Detalles"
  goToDetalles(vehiculo: Vehiculo) {
    console.log('Detalles del vehículo:', vehiculo); // Aquí puedes implementar la lógica para mostrar detalles
    this.router.navigate(['/detalles', vehiculo.titulo]); // Navegar a una página de detalles (ejemplo)
  }

  // Método para manejar el botón "Cancelar Viajes"
  cancelarViajes(vehiculo: Vehiculo) {
    console.log('Cancelar viajes para el vehículo:', vehiculo); // Aquí puedes implementar la lógica para cancelar viajes
    alert(`Viajes del vehículo "${vehiculo.titulo}" han sido cancelados.`);
  }

  // Método para manejar la navegación de la barra lateral
  navigateTo(route: string) {
    this.router.navigate([route]); // Navegar a la ruta especificada
  }
}