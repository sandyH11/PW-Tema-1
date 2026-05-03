import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { supabase } from '../../supabase.client';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

/* Dashboard docente */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  /* Lista de alumnos */
  alumnos: any[] = [];

  /* Lista filtrada */
  alumnosFiltrados: any[] = [];

  /* Texto búsqueda */
  busqueda: string = '';

  /* Nombre del docente */
  nombreUsuario: string = '';

  /* Total de alumnos */
  totalAlumnos: number = 0;

  /* Control de secciones */
  seccion: string = 'inicio';

  /* Estado de carga */
  loading: boolean = true;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  /* Cargar datos automáticamente */
  async ngOnInit() {
    await this.cargarDatos();
  }

  /* Obtener información */
  async cargarDatos() {
    /* Obtener usuario autenticado */
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    /* Obtener información del docente */
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    /* Guardar nombre completo */
    if (usuario) {
      this.nombreUsuario = usuario.nombre + ' ' + usuario.apellido;
    }

    /* Obtener alumnos */
    const { data: alumnosData } = await supabase.from('usuarios').select('*').eq('rol', 'alumno');

    /* Guardar alumnos */
    this.alumnos = alumnosData || [];

    /* Inicializar lista filtrada */
    this.alumnosFiltrados = this.alumnos;

    /* Total de alumnos */
    this.totalAlumnos = this.alumnos.length;

    /* Finalizar carga */
    this.loading = false;

    /* Actualizar vista */
    this.cdr.detectChanges();
  }

  /* Cambiar sección */
  cambiarSeccion(nombre: string) {
    this.seccion = nombre;
  }

  /* Buscar alumnos */
  buscarAlumno() {
    /* Filtrar */
    this.alumnosFiltrados = this.alumnos.filter((alumno) => {
      const nombreCompleto = alumno.nombre + ' ' + alumno.apellido;

      return nombreCompleto.toLowerCase().includes(this.busqueda.toLowerCase());
    });
  }

  /* Cerrar sesión */
  async logout() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión actual finalizará.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    /* Confirmar */
    if (result.isConfirmed) {
      /* Cerrar sesión */
      await supabase.auth.signOut();

      /* Mensaje */
      await Swal.fire({
        title: 'Sesión cerrada',
        text: 'Has salido correctamente.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
      });

      /* Redirección */
      this.router.navigate(['/login']);
    }
  }
}
