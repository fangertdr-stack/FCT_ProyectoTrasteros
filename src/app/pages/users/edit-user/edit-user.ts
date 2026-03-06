import { routes } from './../../../app.routes';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersCrud } from '../../../services/users-crud';
import { Usuario } from '../../../models/usuario';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser implements OnInit {

  usuario!: Usuario;
  idUsuario!: number;

  constructor(public route: ActivatedRoute,  // Esto es para leer parámetros
              public router: Router,         // Esto es para navegar
              private userService: UsersCrud
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.idUsuario = Number(params.get('id'));
      console.log('ID recibido en EditUser:', this.idUsuario);

      this.userService.getUsuarioById(this.idUsuario)
        .subscribe(data => {
          this.usuario = data;
        });

    });

  }

  guardarCambios() {
    this.userService.updateUsuario(this.usuario)
      .subscribe(() => {
        alert("Usuario actualizado correctamente");
        this.router.navigate(['/users']); // Volver al listado
      });
  }
  }


