import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';

import { supabase } from '../supabase.client';

/* Protección de rutas */
export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  /* Obtener sesión actual */
  const {
    data: { session },
  } = await supabase.auth.getSession();

  /* Si NO existe sesión */
  if (!session) {
    router.navigate(['/login']);

    return false;
  }

  /* Permitir acceso */
  return true;
};
