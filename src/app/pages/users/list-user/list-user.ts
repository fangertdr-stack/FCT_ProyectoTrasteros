import { Component } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-user',
  imports: [CommonModule],
  templateUrl: './list-user.html',
  styleUrl: './list-user.css',
})
export class ListUser {

  constructor() {}


  usuario: Usuario [] = [
    { id_usuario: 1, nombre: 'Juan Pérez', email: 'juan.perez@example.com', password:'abc', rol: 1, dni: '12345678A', direccion: 'Calle Principal 123', telefono: '600123456' },
    {
    id_usuario: 2,nombre: "María García",email: "maria.garcia@example.com",password: "def",
    rol: 2,dni: "87654321B",direccion: "Avenida de la Libertad 45, 2ºA",
    telefono: "600654321"
  },
  {
    id_usuario: 3,nombre: "Carlos Rodríguez",email: "carlos.rodriguez@example.com",password: "ghi",
    rol: 1,dni: "11223344C",direccion: "Calle del Sol 15, Bajo",
    telefono: "600987654"
  }
  ];

}
