# Backlog Quest v2.2

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

La carpeta `dist` queda lista para GitHub Pages o cualquier hosting estático.

## Copias y agregado rápido

En Biblioteca, abre un juego y entra en **Copias**.

- El encabezado conserva únicamente `+ Agregar copia`.
- **Agregado rápido** se construye automáticamente usando combinaciones únicas de biblioteca y propiedad ya guardadas.
- Propiedad `Propio` no aparece en el texto del botón.
- Accesos como Game Pass, biblioteca familiar o regalos sí aparecen.
- Al guardar un juego, sus combinaciones pasan al inicio de los agregados rápidos.
- Se muestran hasta ocho combinaciones; `Ver más` abre todas.
- Desde el modal puedes configurar una combinación nueva y agregarla al juego.

## Dispositivos

Los dispositivos se administran en **Configuración → Dispositivos**.

- Copias permiten seleccionar uno o varios dispositivos guardados.
- Partidas permiten elegir un dispositivo compatible con la copia seleccionada.
- Misiones y cierres usan el mismo catálogo.
- Los vínculos se guardan mediante IDs internos, por lo que renombrar un dispositivo no rompe el historial.
- Un dispositivo vinculado no puede eliminarse hasta reasignar sus copias, partidas o misiones.

## Datos

El archivo `src/data/backlog.json` contiene el estado inicial anónimo. La aplicación sigue importando respaldos v1 y v2 anteriores y los normaliza al abrirlos; los datos personales se conservan en `localStorage` o en los respaldos que exportes.
