# Guía de configuración — DJ Landing Page

---

## 1. Cambiar la información del DJ

Todo el contenido estructural de la página vive en un solo archivo:

```
lib/config.ts
```

Abrís ese archivo y cambiás lo que necesites. No hay que tocar ningún componente.

### Nombre, tagline y géneros

```ts
name: 'NEXUS',           // Aparece en hero, navbar y footer
tagline: 'Electronic Music Producer & DJ',
genres: ['Tech House', 'Techno', 'Electronic'],
```

### Biografía y foto

```ts
bio: {
  short: 'Frase corta...',
  full:  'Biografía larga...',   // ← este campo ya no se usa directamente (ver sección 6)
  photo: '/images/bio.jpg',
  stats: [
    { label: 'Años activo', value: '12+' },
    { label: 'Shows',       value: '600+' },
    { label: 'Países',      value: '25+' },
    { label: 'Releases',    value: '60+' },
  ],
},
```

> **Nota:** el texto de la bio larga se gestiona en `lib/i18n.ts` (sección 6)
> porque necesita versión en español e inglés. El campo `full` en config quedó
> como referencia pero el componente usa el texto del sistema de idiomas.

### Redes sociales

```ts
social: {
  instagram:  'https://instagram.com/TU_USUARIO',
  spotify:    'https://open.spotify.com/artist/TU_ID',
  soundcloud: 'https://soundcloud.com/TU_USUARIO',
  youtube:    'https://youtube.com/@TU_CANAL',
  beatport:   'https://www.beatport.com/artist/TU_NOMBRE',
},
```

### Releases (discografía)

```ts
{
  id: '1',                      // Único, no repetir
  title: 'NOMBRE DEL RELEASE',
  year: 2024,
  type: 'album',                // 'album' | 'ep' | 'single'
  label: 'Nombre del sello',    // Opcional
  coverGradient: 'linear-gradient(135deg, #0d0221 0%, #6d00cc 100%)',
  links: {
    spotify:    'https://open.spotify.com/album/...',
    appleMusic: 'https://music.apple.com/...',
    soundcloud: 'https://soundcloud.com/...',
    beatport:   'https://www.beatport.com/...',
  },
},
```

> Cuando tengas la imagen real del cover: poné el archivo en `public/images/releases/`
> y en `Releases.tsx` reemplazá el `style={{ background: release.coverGradient }}`
> por un `<Image src={release.cover} ... />`.

### Shows (agenda)

```ts
{
  id: '1',
  date: '2026-05-10',                  // Formato YYYY-MM-DD
  city: 'Buenos Aires',
  country: 'Argentina',
  venue: 'Mandarine Park',
  festival: 'Ultra Music Festival',    // Opcional
  ticketUrl: 'https://...',            // Opcional — si no hay, se oculta el botón
  isSoldOut: false,                    // true → badge "Sold Out"
  isPast: false,                       // true → aparece en "Shows anteriores"
},
```

### Galería (fotos)

Cada item de galería actualmente usa un gradiente de placeholder:

```ts
{ id: '1', gradient: 'linear-gradient(...)', caption: 'Texto', aspect: 'portrait' }
```

Cuando tengas fotos reales:

1. Creás `public/images/gallery/` y ponés las fotos ahí (`01.jpg`, `02.jpg`, ...)
2. En `lib/config.ts` cambiás cada item (reemplazás `gradient` por `src`):
   ```ts
   { id: '1', src: '/images/gallery/01.jpg', caption: 'Texto', aspect: 'portrait' }
   ```
3. En `components/sections/Multimedia.tsx`, en `GalleryCard`, reemplazás el `div` gradiente por:
   ```tsx
   import Image from 'next/image'
   <Image src={item.src} alt={item.caption} fill className="object-cover" />
   ```

El `aspect` acepta: `'portrait'` (3/4), `'landscape'` (4/3), `'square'` (1/1).

### YouTube

```ts
youtube: {
  channelUrl:      'https://youtube.com/@TU_CANAL',
  featuredVideoId: 'XXXXXXXXXX',  // ID del video — lo encontrás en la URL: ?v=XXXXXXXXXX
},
```

### Contacto

```ts
contact: {
  bookingEmail: 'booking@tudominio.com',
  pressEmail:   'press@tudominio.com',
},
```

---

## 2. Imágenes reales

### Foto de bio

1. Creás la carpeta `public/images/`
2. Ponés la foto como `public/images/bio.jpg`
3. En `components/sections/Bio.tsx`, buscás el bloque comentado y lo reemplazás:

```tsx
// Eliminás este bloque:
<div className="absolute inset-0" style={{ background: 'linear-gradient(...)' }} />

// Y descomentás esto:
import Image from 'next/image'
<Image src={bio.photo} alt={djConfig.name} fill className="object-cover" />
```

---

## 3. Sistema de idiomas (Español / Inglés)

La página tiene soporte completo ES/EN. El usuario elige el idioma con las banderitas
🇪🇸 / 🇺🇸 que aparecen en la navbar, a la derecha del botón "Reservar".

### Dónde están los textos

**Todos los textos visibles** de la interfaz viven en:

```
lib/i18n.ts
```

El archivo tiene dos secciones: `es` (base) y `en` (debe tener la misma estructura).
TypeScript te avisa si te falta traducir algo en inglés.

### Cambiar o agregar un texto

Ejemplo: querés cambiar el texto del botón de booking.

```ts
// En lib/i18n.ts:
const es = {
  nav: {
    bookNow: 'Reservar',  // ← cambiás esto en español
    ...
  },
}

const en = {
  nav: {
    bookNow: 'Book Now',  // ← y esto en inglés
    ...
  },
}
```

### Cambiar el texto de la biografía

El texto largo de la bio está en `lib/i18n.ts` (no en `lib/config.ts`) porque
necesita versión en ambos idiomas:

```ts
const es = {
  bio: {
    text: 'Con más de una década...',  // ← texto en español
  },
}

const en = {
  bio: {
    text: 'With over a decade...',     // ← texto en inglés
  },
}
```

### Cambiar los labels de los stats de bio

Los labels de las estadísticas (Años activo, Shows, Países, Releases) también
están en `lib/i18n.ts`:

```ts
const es = {
  bio: {
    statLabels: ['Años activo', 'Shows', 'Países', 'Releases'],
  },
}
const en = {
  bio: {
    statLabels: ['Years active', 'Shows', 'Countries', 'Releases'],
  },
}
```

Los **valores** (12+, 600+, etc.) siguen viniendo de `lib/config.ts`.

### Agregar un tercer idioma (ej: Portugués)

1. En `lib/i18n.ts`, agregás la nueva entrada:
   ```ts
   const pt = { ... } satisfies typeof es
   export const translations = { es, en, pt } as const
   export type Lang = 'es' | 'en' | 'pt'
   ```
2. En `contexts/LanguageContext.tsx`, el tipo `Lang` se actualiza automáticamente.
3. En `components/layout/Navbar.tsx`, agregás la banderita:
   ```ts
   const FLAGS: Record<Lang, string> = { es: '🇪🇸', en: '🇺🇸', pt: '🇧🇷' }
   const LANGS: Lang[] = ['es', 'en', 'pt']
   ```

---

## 4. Conectar Instagram

La integración usa la **Instagram Graph API** de Meta. Solo funciona con cuentas
**Business** o **Creator** (no personales). Sin configurar, la sección muestra
placeholders automáticamente — no rompe nada.

### Paso a paso

**a) Convertir la cuenta a Business/Creator**

En Instagram app: `Configuración → Cuenta → Cambiar tipo de cuenta → Creador / Profesional`

**b) Crear una app en Meta for Developers**

1. Entrás a developers.facebook.com
2. Clic en **Mis apps → Crear app** → Tipo: **Business**
3. Nombre (ej: "DJ NEXUS Website")
4. **Agregar producto** → **Instagram Graph API** → Configurar

**c) Conectar tu Instagram y obtener el token**

1. Dentro de Instagram Graph API → **Configuración de Instagram** → conectás tu cuenta
2. Vas a **Herramientas → Explorador de la API Graph**
3. Generás un token corto con permisos: `instagram_basic`, `pages_read_engagement`
4. Lo convertís en token de larga duración (60 días):
   ```
   GET https://graph.instagram.com/access_token
     ?grant_type=ig_exchange_token
     &client_id={APP_ID}
     &client_secret={APP_SECRET}
     &access_token={TOKEN_CORTO}
   ```

**d) Configurar el proyecto**

Creás `.env.local` en la raíz del proyecto:

```env
INSTAGRAM_ACCESS_TOKEN=tu_token_aqui
```

Reiniciás `npm run dev` → los posts reales aparecen en la sección Instagram.

> **El token vence cada 60 días.** Renovarlo antes:
> ```
> GET https://graph.instagram.com/refresh_access_token
>   ?grant_type=ig_refresh_token
>   &access_token={TOKEN_ACTUAL}
> ```

---

## 5. Activar el formulario de contacto

Por defecto el formulario registra los mensajes en los logs del servidor (`console.log`).
Para recibir emails, el servicio más simple es **Resend** (tiene plan gratuito).

**a) Instalás:**
```bash
npm install resend
```

**b) Creás cuenta** en resend.com, verificás tu dominio, obtenés el API Key.

**c) Agregás al `.env.local`:**
```env
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_TO_EMAIL=tuemail@tudominio.com
```

**d) En `app/api/contact/route.ts`** reemplazás el `console.log` por:
```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from:    'Web <noreply@tudominio.com>',
  to:      process.env.CONTACT_TO_EMAIL!,
  subject: `[${body.type.toUpperCase()}] Mensaje de ${body.name}`,
  html: `
    <p><strong>Nombre:</strong> ${body.name}</p>
    <p><strong>Email:</strong> ${body.email}</p>
    <p><strong>Tipo:</strong> ${body.type}</p>
    <p><strong>Mensaje:</strong><br>${body.message}</p>
  `,
})
```

---

## 6. Botón scroll-to-top (cohete)

El botón aparece automáticamente cuando el usuario scrollea más de 500px.
Al hacer click, lanza una animación de cohete con llama y vuelve al tope.

No necesita configuración. El texto "ARRIBA" / "GO UP" cambia según el idioma
activo (viene del sistema i18n en `lib/i18n.ts`, campo `scrollToTop`).

---

## 7. Despliegue en producción

La forma más simple es **Vercel**:

1. Subís el proyecto a GitHub
2. Entrás a vercel.com → conectás el repo
3. En la configuración del proyecto, agregás las variables de entorno:
   - `INSTAGRAM_ACCESS_TOKEN`
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL`
4. Deploy automático con cada push a `main`

---

## Resumen rápido

| Qué quiero cambiar | Dónde |
|---|---|
| Nombre del DJ, géneros, redes, shows, releases | `lib/config.ts` |
| Textos de la interfaz (ES/EN) | `lib/i18n.ts` |
| Texto de la bio en ambos idiomas | `lib/i18n.ts` → `bio.text` |
| Labels de stats (Años, Shows, Países, Releases) | `lib/i18n.ts` → `bio.statLabels` |
| Foto de bio | `public/images/bio.jpg` + descomentar en `Bio.tsx` |
| Fotos de galería | `public/images/gallery/` + actualizar config + `Multimedia.tsx` |
| Video de YouTube | `featuredVideoId` en `lib/config.ts` |
| Instagram | `.env.local` → `INSTAGRAM_ACCESS_TOKEN` |
| Envío de emails del formulario | `.env.local` → `RESEND_API_KEY` + editar `api/contact/route.ts` |
| Agregar un idioma nuevo | `lib/i18n.ts` + `Navbar.tsx` (FLAGS y LANGS) |
| Dominio y hosting | Vercel |
