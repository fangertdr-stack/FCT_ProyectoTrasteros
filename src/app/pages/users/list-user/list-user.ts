import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario';
import { UsersCrud } from '../../../services/users-crud';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService } from '../../../services/navigation';



@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-user.html',
  styleUrls: ['./list-user.css'],
})
export class ListUser implements OnInit {

  usuario: Usuario[] = [];

  constructor(private usersCrud: UsersCrud,
              private route: Router,
              private navigate: NavigationService
  ) {} // solo el servicio

  usuario$: Observable<Usuario[]> | undefined;

  ngOnInit(): void {
    this.usuario$ = this.usersCrud.getUsuarios();
  }


  volver() {
    this.navigate.goTo('/admin');
  }

}
