import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

/* Módulos necesarios */
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/* Supabase */
import { supabase } from '../../supabase.client';

import Swal from 'sweetalert2';

/* Dashboard alumno */
@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student.html',
  styleUrls: ['./student.css'],
})
export class StudentComponent implements OnInit {
  /* Nombre del alumno */
  nombreUsuario: string = '';

  /* Control de secciones */
  seccion: string = 'inicio';

  /* Pantalla de carga */
  loading: boolean = true;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  /* Cargar información automáticamente */
  async ngOnInit() {
    await this.cargarDatos();
  }

  /* Obtener datos */
  async cargarDatos() {
    /* Obtener usuario autenticado */
    const {
      data: { user },
    } = await supabase.auth.getUser();

    /* Verificar sesión */
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    /* Buscar usuario */
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    /* Guardar nombre completo */
    if (usuario) {
      this.nombreUsuario = usuario.nombre + ' ' + usuario.apellido;
    }

    /* Quitar loading */
    this.loading = false;

    /* Actualizar vista */
    this.cdr.detectChanges();
  }

  /* Cambiar sección */
  cambiarSeccion(nombre: string) {
    this.seccion = nombre;
  }

  /* Cerrar sesión */
  async logout() {
    /* Confirmación */
    const result = await Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Deseas salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    });

    /* Verificar confirmación */
    if (!result.isConfirmed) return;

    /* Cerrar sesión */
    await supabase.auth.signOut();

    /* Redirigir */
    this.router.navigate(['/login']);

    /* Ir al login */
    this.router.navigate(['/login']);
  }
}
