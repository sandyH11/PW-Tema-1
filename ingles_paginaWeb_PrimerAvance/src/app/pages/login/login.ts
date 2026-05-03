import { Component } from '@angular/core';

import { supabase } from '../../supabase.client';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  email: string = '';

  password: string = '';

  /* Estado del ojito */
  showPassword = false;

  constructor(private router: Router) {}

  /* Mostrar / ocultar contraseña */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /* Inicio de sesión */
  async login() {
    /* Validar campos */
    if (!this.email || !this.password) {
      Swal.fire('Error', 'Completa todos los campos', 'error');

      return;
    }

    /* Login Supabase */
    const { error } = await supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password,
    });

    /* Error login */
    if (error) {
      Swal.fire('Error', 'Correo o contraseña incorrectos', 'error');

      return;
    }

    /* Obtener usuario autenticado */
    const { data: userData } = await supabase.auth.getUser();

    const userId = userData.user?.id;

    /* Consultar tabla usuarios */
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();

    /* Validar usuario */
    if (userError || !usuario) {
      Swal.fire('Error', 'No se pudo obtener la información del usuario', 'error');

      return;
    }

    /* Bienvenida */
    Swal.fire({
      title: 'Bienvenido',
      text: 'Has iniciado sesión correctamente',
      icon: 'success',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#4f46e5',
    }).then(() => {
      /* Redirección */
      if (usuario.rol === 'docente') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/student']);
      }
    });
  }

  /* Ir a registro */
  goToRegister() {
    this.router.navigate(['/register']);
  }

  /* Volver al inicio */
  goHome() {
    this.router.navigate(['/']);
  }
}
