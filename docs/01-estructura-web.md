# Estructura de la pagina - Invitaciones Web

Este documento define la primera version de la pagina comercial para vender invitaciones digitales y el camino para convertirla despues en una plataforma con panel privado, plantillas, mesas, RSVP, galeria de invitados y album profesional.

## Objetivo del negocio

Vender invitaciones web para eventos sociales:

- Bodas
- Quinceanos
- Bautizos
- Primera comunion
- Baby showers
- Revelaciones de genero
- Cumpleanos
- Eventos personalizados

La oferta principal debe ser facil de entender:

> Invitaciones digitales con diseno, musica, ubicacion, confirmacion por WhatsApp y enlace listo para compartir.

## Nombre de marca pendiente

Nombre recomendado provisional:

**Invitaciones Web Colombia**

Opciones a validar:

- `@invitacionesweb.co`
- `@invitacioneswebcolombia`
- `@invitacionesenlink`
- `@tarjetasweb.co`
- `@misinvitacionesweb`

Dominio ideal:

- `invitacionesweb.co`
- `invitacioneswebcolombia.com`
- `invitacionesenlink.com`

La marca final debe cumplir:

- Facil de buscar en Google.
- Facil de dictar por WhatsApp.
- No limitarse a un solo evento.
- Servir para Instagram y pagina web.
- Poder crecer a fotografia, galerias y paquetes premium.

## Fase 1 - Pagina publica de venta

La primera pagina no debe ser una plataforma compleja. Debe vender.

### Rutas principales

```text
/
/catalogo
/precios
/como-funciona
/preguntas
/contacto
```

### Rutas SEO por tipo de evento

```text
/invitaciones-web-bodas
/invitaciones-web-quinceanos
/invitaciones-baby-shower
/invitaciones-bautizo
/invitaciones-primera-comunion
/invitaciones-revelacion-genero
/invitaciones-cumpleanos
```

Cada ruta debe tener:

- Titulo claro del servicio.
- 3 a 6 demos o ejemplos.
- Beneficios especificos para ese evento.
- Precio desde.
- Boton a WhatsApp.
- Preguntas frecuentes.

## Pagina de inicio

### Seccion 1 - Hero

Objetivo: explicar en 5 segundos que se vende.

Texto sugerido:

**Invitaciones web para eventos especiales**

Subtexto:

Invitaciones digitales personalizadas para bodas, quinceanos, baby showers, bautizos, primeras comuniones, revelaciones y cumpleanos.

Botones:

- Ver catalogo
- Pedir por WhatsApp

### Seccion 2 - Categorias

Mostrar tarjetas por tipo de evento:

- Bodas
- Quinceanos
- Baby Shower
- Bautizos
- Primera comunion
- Revelaciones
- Cumpleanos

Cada tarjeta lleva a su pagina SEO.

### Seccion 3 - Demos

Mostrar ejemplos reales o plantillas:

- Baby shower azul
- Boda elegante
- Quince anos rosado/dorado
- Bautizo clasico
- Cumpleanos infantil

Cada demo debe tener:

- Imagen previa
- Nombre de plantilla
- Boton "Ver demo"
- Boton "Quiero esta"

### Seccion 4 - Que incluye

Lista clara:

- Link personalizado
- Musica
- Ubicacion con Google Maps
- Cuenta regresiva
- Confirmacion por WhatsApp
- Fotos
- Dress code
- Sugerencia de regalos
- Animaciones
- Diseno responsive

### Seccion 5 - Paquetes

#### Basico - 50.000 COP

Para clientes que quieren una invitacion bonita y rapida.

Incluye:

- 1 plantilla editable
- Datos del evento
- Fecha y hora
- Ubicacion
- Boton de WhatsApp
- Musica
- Cuenta regresiva
- 1 ronda de ajustes

#### Personalizado - 90.000 a 120.000 COP

Para clientes que quieren algo mas trabajado.

Incluye:

- Todo lo del basico
- Colores personalizados
- Fuentes personalizadas
- Fotos del cliente
- Animaciones extra
- 2 rondas de ajustes

#### Premium - desde 180.000 COP

Para bodas, quinces y eventos donde se necesita mas que una invitacion.

Incluye:

- Todo lo anterior
- Confirmacion avanzada
- Credencial o codigo por invitado
- Consulta de mesa
- Galeria de fotos subidas por invitados
- Album profesional enlazado si el fotografo entrega fotos
- Panel de control para organizadores

### Seccion 6 - Como funciona

1. El cliente elige una plantilla.
2. Envia datos, fotos, cancion y ubicacion.
3. Se arma la invitacion.
4. El cliente revisa.
5. Se hacen ajustes.
6. Se entrega el link final.

### Seccion 7 - Preguntas frecuentes

Preguntas base:

- Cuanto tarda?
- Puedo elegir musica?
- Puedo cambiar colores?
- Sirve para WhatsApp?
- Se puede editar despues?
- El link cuanto dura?
- Que pasa si quiero una plantilla desde cero?
- Puedo agregar fotos?
- Puedo poner mesa de regalos?
- Puedo usar un dominio propio?

### Seccion 8 - Contacto

Boton principal:

**Quiero mi invitacion**

Debe abrir WhatsApp con mensaje prellenado:

```text
Hola, quiero una invitacion web para mi evento.
Tipo de evento:
Fecha:
Ciudad:
```

## Fase 2 - Catalogo de plantillas

El catalogo debe permitir filtrar:

- Tipo de evento
- Estilo
- Color
- Precio

Estilos sugeridos:

- Elegante
- Infantil
- Floral
- Minimalista
- Religioso
- Moderno
- Romantico
- Lujo

Cada plantilla debe tener:

- Nombre comercial
- Tipo de evento
- Precio desde
- Vista previa
- Boton "Ver demo"
- Boton "Pedir esta"

## Fase 3 - Panel privado para ustedes

Ruta sugerida:

```text
/admin
```

Al inicio puede ser:

- Login con usuario y contrasena.
- O enlace secreto temporal.

Recomendado para crecer:

- Login real con Supabase Auth.

### Funciones del panel

Crear cliente/evento:

- Nombre del cliente
- Tipo de evento
- Fecha
- Estado: pendiente, en diseno, enviado, aprobado, publicado

Editar invitacion:

- Nombre del evento
- Nombres principales
- Fecha y hora
- Lugar
- Link de mapa
- WhatsApp
- Texto de invitacion
- Texto de regalos
- Dress code
- Musica
- Fotos
- Fondo
- Paleta
- Fuente
- Plantilla

Publicar:

- Generar carpeta final
- Exportar ZIP
- Publicar en Netlify
- Copiar enlace final

## Fase 4 - Sistema premium de invitados

Esta fase convierte la invitacion en una experiencia de evento.

### Login de invitado

El invitado entra con:

- Codigo unico
- Numero de documento
- Telefono
- O clave entregada por los novios

Ejemplo:

```text
Codigo: MESA07-LAURA
```

Al entrar, ve:

- Nombre del invitado
- Numero de mesa
- Numero de acompanantes permitidos
- Confirmar asistencia
- Subir fotos
- Ver galeria

### Mesas

Panel para cargar lista:

```text
Nombre, telefono, codigo, mesa, acompanantes
Laura Perez, 3000000000, LAURA07, Mesa 7, 1
```

La invitacion muestra:

> Hola Laura, tu mesa es la Mesa 7.

### Galeria de invitados

Funciones:

- Invitados suben fotos.
- Todos pueden ver las fotos aprobadas/publicas.
- Cada foto muestra quien la subio.
- Solo quien la subio puede borrarla.
- Administradores pueden borrar cualquier foto.
- Opcion de moderacion antes de publicar.

Regla importante:

> Un invitado no puede borrar fotos de otro invitado.

Tecnologia recomendada:

- Supabase Database para usuarios, eventos, mesas y permisos.
- Supabase Storage o Cloudinary para imagenes.
- Reglas por usuario para controlar borrado.

## Fase 5 - Album profesional con Pixieset

Pixieset se usa para entregar el album profesional cuando el fotografo hace la cobertura.

En la invitacion premium se agrega:

- Boton "Ver album profesional"
- Link a Pixieset
- Clave de acceso si aplica

No se recomienda usar Pixieset como galeria de fotos subidas por invitados, porque el control de permisos por invitado es mas especifico y conviene manejarlo en sistema propio.

## Fase 6 - Publicacion y Netlify

### Version inicial

Publicacion manual:

1. El panel o el sistema genera una carpeta limpia.
2. Se arrastra a Netlify.
3. Netlify entrega URL.

### Version profesional

Publicacion automatica:

1. Cada invitacion se guarda en base de datos.
2. El sistema genera el sitio.
3. Se sube a GitHub o se usa API de Netlify.
4. Netlify despliega.
5. El panel guarda el enlace final.

## Recomendacion de construccion

Orden recomendado:

1. Definir nombre de marca y dominio.
2. Crear landing page publica.
3. Crear catalogo con 3 plantillas.
4. Convertir la invitacion actual en plantilla reutilizable.
5. Crear panel privado basico.
6. Agregar generador/exportador para Netlify.
7. Crear premium con invitados, mesas y galeria.
8. Conectar Pixieset como album profesional.

## Primera version que debemos construir

Para no desgastarnos, la primera version debe ser:

- Pagina de venta.
- Catalogo simple.
- 3 demos.
- Boton a WhatsApp.
- README/estructura.
- Sin login todavia.
- Sin galeria todavia.

Despues de tener ventas o muestras fuertes, hacemos el panel privado.
