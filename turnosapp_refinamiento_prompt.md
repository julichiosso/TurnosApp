# PROMPT — Refinamiento UX/UI Frontend TurnosApp

## ROL

Sos un ingeniero de software senior con 30 años de experiencia construyendo productos digitales que la gente ama usar. No trabajás con templates ni con lo que "suena bien técnicamente". Trabajás con criterio humano: cada pantalla tiene que sentirse natural, rápida y cómoda para alguien que nunca estudió tecnología. El tallerista tiene las manos sucias de grasa y usa el celular con el pulgar. El cliente llegó enojado porque le chocaron el auto. Ninguno de los dos tiene paciencia. Tu trabajo es que ambos lleguen a donde necesitan en menos de 10 segundos, sin pensar.

**Lo que diferencia tu trabajo de lo que hace una IA genérica:**
- Una sola fuente tipográfica consistente en toda la app — no mezcla de pesos random
- Animaciones con propósito, no decorativas — cada movimiento le dice al usuario algo
- Espaciado consistente — no "más o menos alineado", sino grilla precisa
- Estados vacíos con personalidad, no placeholders genéricos
- Micro-interacciones que dan feedback inmediato sin notificaciones invasivas

---

## FUENTE — CAMBIO GLOBAL OBLIGATORIO

Reemplazar **todas** las fuentes actuales por **`Geist`** (de Vercel, disponible en Google Fonts como alternativa o via `next/font/google`).

Si Geist no está disponible, usar **`DM Sans`**. Bajo ningún concepto mezclar dos fuentes distintas en la misma pantalla.

```typescript
// app/layout.tsx
import { DM_Sans } from 'next/font/google'
const font = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })
```

Aplicar la fuente al `<html>` con `className={font.className}`. Verificar que no haya overrides en ningún componente que cambien la fuente.

**Por qué:** Las fuentes mezcladas son la señal más clara de que algo lo hizo una IA. Una sola fuente bien usada con distintos pesos parece hecha por un humano que sabe lo que hace.

---

## PARTE 1 — VISTA PÚBLICA (lo que ve el cliente)

### Problema detectado en las imágenes: el hero ocupa demasiado espacio y las cards de servicios son muy altas individualmente.

### Hero — Compactar sin perder impacto

Altura máxima del hero: **160px**. Actualmente ocupa demasiado. El cliente quiere reservar, no leer.

```
┌─────────────────────────────────────┐
│         [Logo TM - 48px]            │  ← más chico
│    RESERVÁ TU TURNO                 │  ← 26px, peso 800
│  Chapa · Pintura · Granizo          │  ← 12px, rojo, tracking 0.08em
│  Av. Alberdi 739, San Jorge         │  ← 11px, gris
└─────────────────────────────────────┘
```

### Barra de progreso — Rediseño

Reemplazar los círculos numerados por una barra de progreso lineal más limpia:

```
●━━━━━━━━○━━━━━━━━○━━━━━━━━○
  SERVICIO   FECHA    HORA    DATOS
```

- Línea horizontal de 2px
- Punto activo: círculo rojo relleno 10px
- Punto completado: círculo rojo con check interno 10px  
- Punto futuro: círculo gris 10px
- Labels debajo de cada punto en 10px gris, activo en blanco
- Animación: la línea entre puntos se "llena" de rojo al avanzar (width transition 300ms)

### PASO 1 — Servicios: cards más compactas

Las cards actuales tienen demasiado padding. Reducir:

```
┌─────────────────────────────────────┐
│ Control                    20 min   │
│ Control rápido             $2.000   │
└─────────────────────────────────────┘
```

- Altura: 64px (actualmente ~100px)
- Nombre del servicio: 16px peso 600, izquierda
- Duración y precio: derecha, 13px gris
- Descripción: debajo del nombre, 12px gris muted, una sola línea con ellipsis
- Card seleccionada: borde izquierdo rojo 3px + fondo #1A1A1A
- Sin ícono de punto rojo en la esquina — innecesario

### PASO 2 — Fechas: chips más expresivos

Los chips de fecha están bien en concepto pero el scroll es corto porque solo muestra 5 días. Extender a 14 días scrolleables. Agregar un indicador visual sutil de que hay más (fade al borde derecho).

Altura de chip: 72px. Ancho: 56px. Más compactos que los actuales.

### PASO 3 — Horarios: OK, solo ajuste visual

Los slots están bien. Único cambio: los slots deben tener una transición de selección más viva — cuando el usuario toca uno, el cambio de color debe ser instantáneo (0ms) pero con un pulso de escala: `scale(0.95)` por 100ms y vuelve a `scale(1)`. Da sensación de "clic físico".

### PASO 4 — Formulario: agrupar campos

El formulario actual tiene mucho espacio entre campos. Agrupar nombre + teléfono en un bloque visual, email + nota en otro:

```
┌─────────────────────────────────────┐
│ Tus datos de contacto               │  ← label de grupo, 11px gris
├─────────────────────────────────────┤
│ 👤 Nombre completo *                │
├─────────────────────────────────────┤
│ 📞 Teléfono *                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Info adicional (opcional)           │  ← label de grupo
├─────────────────────────────────────┤
│ ✉ Email                             │
├─────────────────────────────────────┤
│ 📋 Descripción del trabajo          │
└─────────────────────────────────────┘
```

Sin íconos emoji — usar íconos de lucide-react (User, Phone, Mail, FileText).

### Pantalla de confirmación — Ajuste

Está bien en concepto. Dos cambios:
1. El check animado: actualmente aparece verde. Cambiarlo a rojo (color de marca) con animación de dibujo SVG (strokeDashoffset de 100 a 0 en 600ms).
2. Agregar debajo del resumen: "Te vamos a contactar para confirmar" en gris pequeño. Da confianza.

---

## PARTE 2 — PANEL ADMIN (lo que ve el tallerista)

### Problema principal: Horarios Laborales tiene un bug crítico y mala UX.

---

### DASHBOARD — Compactar y dar vida

**Stats 2x2:** Están bien. Agregar micro-animación: cuando carga, los números suben desde 0 hasta el valor real en 800ms con easing. Hace que se sienta "vivo".

**Turnos de hoy:** Las cards están bien. Agregar:
- Al tocar el badge de estado, antes de abrir el bottom sheet, la card hace un pequeño `scale(0.98)` y vuelve — feedback táctil visual
- Si el turno es dentro de la próxima hora: borde izquierdo de la card en amarillo (urgencia)
- Si ya pasó la hora: nombre en gris muted (pasado)

---

### HORARIOS LABORALES — Rediseño completo (bug crítico + UX)

**Bugs detectados en las imágenes:**
1. Se puede guardar sin haber seleccionado nada — falta validación
2. Hay que scrollear mucho para llegar al botón guardar
3. Los toggles no muestran el horario del día debajo cuando están activos

**Nuevo diseño — Grid 2 columnas:**

En vez de 7 cards apiladas verticalmente, mostrarlas en grid 2x4 (último día centrado):

```
┌──────────────┐ ┌──────────────┐
│ LUN    [ON]  │ │ MAR    [ON]  │
│ 9:00 - 18:00 │ │ 9:00 - 18:00 │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ MIÉ    [ON]  │ │ JUE    [ON]  │
│ 9:00 - 18:00 │ │ 9:00 - 18:00 │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ VIE    [ON]  │ │ SÁB   [OFF]  │
│ 9:00 - 18:00 │ │ No disponible│
└──────────────┘ └──────────────┘
        ┌──────────────┐
        │ DOM   [OFF]  │
        │ No disponible│
        └──────────────┘
```

Cada card: 
- Header con nombre del día abreviado + toggle
- Cuando toggle ON: muestra "9:00 - 18:00" y al tocar la card (no el toggle) abre bottom sheet para editar
- Cuando toggle OFF: fondo más oscuro, texto "No disponible" en gris, no se puede tocar para editar

**Bottom sheet de edición de un día:**
- Título: "Configurar Lunes"
- Time input nativo para hora inicio
- Time input nativo para hora fin  
- Selector de intervalo: botones tipo chip (15 / 20 / 30 / 45 / 60 min) — no select dropdown
- Botón "Guardar" rojo al final
- Validación: hora fin debe ser mayor a hora inicio, si no → error inline rojo

**Guardar por día, no global:**
Eliminar el botón "Guardar Configuración" global al final de la página. Cada día se guarda individualmente desde su bottom sheet. Cuando se guarda, la card del día muestra un check verde por 2 segundos y vuelve a normal.

**Validación del toggle:**
Cuando el usuario activa el toggle de un día que nunca tuvo horario configurado → abrir automáticamente el bottom sheet de ese día para que configure el horario. No guardarlo con valores vacíos.

---

### SERVICIOS — Ajuste menor

Las cards están bien. Dos cambios:
1. El botón de desactivar (X rojo) pide confirmación con un bottom sheet mínimo: "¿Desactivar Control?" + dos botones. No desactivar directamente.
2. Al agregar un servicio nuevo, el campo de precio debe tener prefijo "$" visible dentro del input, no como placeholder.

---

### BLOQUEOS — Rediseño del estado vacío

La pantalla actual con "SIN BLOQUEOS ACTIVOS" está bien. Solo cambiar el ícono de prohibición por un ícono de calendario con check — transmite disponibilidad, no restricción. El mensaje: "Todos los días disponibles" — positivo.

---

### BOTTOM SHEET — Animación mejorada

El bottom sheet actual funciona. Mejorar la animación:

```typescript
// Configuración de spring para Framer Motion
transition={{ 
  type: "spring", 
  damping: 30,      // no rebota demasiado
  stiffness: 400,   // entra rápido
  mass: 0.8 
}}
```

El overlay de fondo: aparece con `opacity: 0 → 0.6` en 200ms. Al cerrar, el sheet baja y el overlay desaparece simultáneamente.

Handle bar arriba del sheet: 32px ancho, 4px alto, borde redondeado, gris oscuro. El usuario puede deslizar hacia abajo para cerrar (implementar drag gesture con Framer Motion `drag="y"`).

---

## REGLAS GENERALES DE REFINAMIENTO

1. **Una sola fuente** — DM Sans en todos los pesos necesarios, nada más
2. **Sin emojis en ningún lado** — reemplazar por íconos de lucide-react
3. **Animaciones con propósito:**
   - Carga de datos: fade in + translateY(8px → 0) en 200ms
   - Cambio de paso en wizard: slide horizontal suave
   - Números en stats: count up animation
   - Cards de turno: stagger de 60ms entre una y otra al cargar
4. **Feedback táctil visual en todo elemento interactivo:**
   - Botones: `active:scale-95` con transition 100ms
   - Cards tocables: `active:opacity-80`
   - Nada queda "mudo" al tocarlo
5. **Consistencia de espaciado:**
   - Padding horizontal de pantalla: 16px en mobile, 24px en desktop
   - Gap entre cards: 10px
   - Gap entre secciones: 24px
6. **Colores de estado siempre consistentes:**
   - Pendiente: #D97706 (amarillo ámbar)
   - Confirmado: #059669 (verde)
   - Cancelado: #DC2626 (rojo)
   - Completado: #6B7280 (gris)

---

## ORDEN DE IMPLEMENTACIÓN

Hacé los cambios en este orden. Testear en 375px antes de pasar al siguiente:

1. **Fuente global** — DM Sans en todo, verificar que no quede ningún override
2. **Horarios laborales** — bug crítico + rediseño grid 2 columnas + validación
3. **Hero y barra de progreso** — compactar + nueva barra lineal
4. **Cards de servicios** — reducir altura + agrupar formulario paso 4
5. **Animaciones globales** — count up en stats, stagger en cards, spring en bottom sheets
6. **Feedback táctil** — active states en todo elemento interactivo
7. **Íconos** — reemplazar cualquier emoji por lucide-react

**TEST FINAL:**
- Abrir en 375px cada pantalla
- Verificar que la fuente sea la misma en toda la app
- En horarios: activar toggle de día sin horario → se abre bottom sheet automáticamente
- En horarios: intentar guardar con hora fin menor a hora inicio → error visible
- Confirmar que no hay emojis en ninguna pantalla
- Cada botón y card debe dar feedback visual al tocarlo
