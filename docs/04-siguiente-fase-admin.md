# Siguiente fase: admin funcional

El archivo `admin/index.html` es solo una maqueta visual. No tiene seguridad real, no guarda datos y no debe prometerse como panel terminado.

## Objetivo del admin real

Permitir que Anderson y su novia puedan crear, editar y publicar invitaciones sin tocar codigo.

## Funciones necesarias

1. Login real.
2. Lista de eventos/clientes.
3. Editor de datos de invitacion.
4. Subida de imagenes y musica.
5. Selector de plantilla.
6. Vista previa.
7. Exportar carpeta para Netlify.
8. Publicar o preparar deploy.

## Tecnologia recomendada

- Frontend: Next.js o React.
- Base de datos: Supabase.
- Login: Supabase Auth.
- Archivos: Supabase Storage o Cloudinary.
- Publicacion: Netlify con Git o API.

## Modelo de datos inicial

```text
events
- id
- client_name
- event_type
- title
- date
- location_name
- location_url
- whatsapp
- template_id
- status
- published_url

templates
- id
- name
- event_type
- base_path
- preview_image
- price_from

guests
- id
- event_id
- name
- phone
- access_code
- table_name
- companions_allowed

guest_photos
- id
- event_id
- guest_id
- image_url
- caption
- approved
- created_at
```

## Reglas premium

- Invitado solo ve su mesa despues de entrar con codigo.
- Invitado puede subir fotos.
- Todos pueden ver fotos aprobadas.
- Solo el invitado que subio una foto puede borrarla.
- Administradores pueden borrar cualquier foto.
- Album profesional de Pixieset se maneja como enlace externo.

## Antes de programar

Definir:

- Numero de WhatsApp comercial.
- Nombre final de marca.
- Dominio final.
- Si el admin sera privado dentro del mismo sitio o en otro subdominio.
- Si se publicara manualmente en Netlify o con deploy automatico.
