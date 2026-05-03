import { Component } from '@angular/core';
import { supabase } from '../../supabase.client';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  confirmPassword = '';

  // estados de visibilidad
  showPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router) {}

  // toggle password
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // toggle confirm password
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async register() {
    // validar campos vacíos
    if (!this.nombre || !this.apellido || !this.email || !this.password || !this.confirmPassword) {
      Swal.fire('Error', 'Por favor llena todos los campos', 'error');
      return;
    }

    // validar email básico
    if (!this.email.includes('@')) {
      Swal.fire('Error', 'Ingresa un correo válido', 'error');
      return;
    }

    // validar contraseña mínima
    if (this.password.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener mínimo 6 caracteres', 'error');
      return;
    }

    // validar contraseñas iguales
    if (this.password !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: this.email,
      password: this.password,
    });

    if (error) {
      Swal.fire('Error', error.message, 'error');
      return;
    }

    if (data.user) {
      const { error: insertError } = await supabase.from('usuarios').insert([
        {
          id: data.user.id,
          email: this.email,
          nombre: this.nombre,
          apellido: this.apellido,
          rol: 'alumno',
        },
      ]);

      if (insertError) {
        Swal.fire('Error', insertError.message, 'error');
        return;
      }

      Swal.fire({
        title: 'Éxito',
        text: 'Usuario registrado correctamente',
        icon: 'success',
        confirmButtonText: 'Ir al login',
        confirmButtonColor: '#4f46e5',
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  cancelar() {
    Swal.fire({
      title: '¿Cancelar registro?',
      text: 'Los datos no se guardarán',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Seguir aquí',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }
}
