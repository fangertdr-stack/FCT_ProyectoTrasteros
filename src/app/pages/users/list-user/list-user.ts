import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario';
import { UsersCrud } from '../../../services/users-crud';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-user.html',
  styleUrls: ['./list-user.css'], // ojo: es styleUrls, no styleUrl
})
export class ListUser implements OnInit {

  usuario: Usuario[] = [];

  constructor(private usersCrud: UsersCrud,
              private route: Router
  ) {} // solo el servicio

  usuario$: Observable<Usuario[]> | undefined;

ngOnInit(): void {
  this.usuario$ = this.usersCrud.getUsuarios();
}

  getUsuarios(): void {
    this.usersCrud.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuario = usuarios;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

  volver() {
    this.route.navigate(['/']);
  }

}
