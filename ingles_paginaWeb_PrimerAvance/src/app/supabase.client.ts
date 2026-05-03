// Importamos la librería de Supabase
import { createClient } from '@supabase/supabase-js';

// URL del proyecto
const supabaseUrl = 'https://vtmwzxbvmdrcyiguxqwh.supabase.co';

// Clave
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bXd6eGJ2bWRyY3lpZ3V4cXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDYyNTAsImV4cCI6MjA5MjcyMjI1MH0.SxTfdvfQnJDX2-opBvzQetN4TryDHE5uvOQCBhEHwwA';

// Se crea la conexión con Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);