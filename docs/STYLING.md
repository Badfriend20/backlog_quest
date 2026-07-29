# Arquitectura de estilos

Desde la versión 2.5.0, Backlog Quest usa la API de `styled-components` como unidad real de
encapsulación, no como un mecanismo para inyectar antiguas hojas globales.

## Propiedad

- `shared/ui/tokens/GlobalStyles.ts` contiene solamente variables, reset y valores base de
  elementos HTML.
- Los componentes reutilizables declaran sus elementos con `styled.button`, `styled.article`,
  `styled.dialog`, `styled(Component)` o fragmentos `css` compartidos.
- Cada feature mantiene un scope renderizado (`BacklogScope`, `GamesScope`, etc.) para partes
  estrictamente internas que todavía se expresan mediante clases semánticas. Está prohibido usar
  `createGlobalStyle` en esos scopes.
- Un componente autónomo monta su scope cuando lo necesita; no depende de haber visitado otra vista.
- Los temas llegan desde preferencias como variables CSS. Los componentes consumen esas variables
  sin duplicar la lógica de temas.

## Sistema compartido

`shared/ui` se divide por profundidad:

- `atoms`: botones, chips y ayudas pequeñas;
- `layout`: tarjetas, rejillas, acciones, formularios, estados vacíos y resúmenes;
- `organisms`: modales y composiciones reutilizadas por varias features;
- `tokens`: reset y tokens globales, nunca estilos de una feature.

Las variantes de acción se expresan con `Button`: `primary`, `ghost`, `danger`, `warning` y `text`;
`size="compact"` y `fullWidth` son opciones de presentación. No se recrean mediante clases.

## Extracción y duplicación

Una regla pertenece a una feature cuando todos sus consumidores están en esa feature. Solo se mueve
a `shared` después de comprobar consumidores reales en más de una feature y una semántica estable.

Los wrappers estructurales son válidos cuando agrupan contenido o expresan layout. No se crea un
wrapper que solo cambie el nombre de otro componente sin ocultar una decisión visual.

La segunda aparición confirmada de una misma pieza visual obliga a extraerla: localmente si ambos
consumidores pertenecen a una feature, o a `shared/ui` si cruza features con la misma semántica. Se
pueden repetir dos o tres declaraciones de layout cuando abstraerlas mezclaría conceptos distintos;
no se duplica markup con interacción, estados o variantes.

## Responsivo

Los media queries viven junto al componente o scope al que modifican. El cambio entre sidebar y
encabezado móvil pertenece a `BacklogStyles`. Los breakpoints de referencia son 320, 390, 760, 761,
900 y 1280 píxeles.

## Temas

Configuración ofrece Medianoche, Grafito, Bosque, Claro y Personalizado. Las definiciones viven en
`features/settings/domain/themes.ts`; la conversión a CSS vive en UI porque utiliza
`CSSProperties`.

Cada tema define fondo, panel, panel alterno, borde, texto, texto secundario, primario, acento,
éxito, advertencia y peligro. `themeStyle` publica las variables CSS que consume la aplicación.
Los controles usan específicamente `--input` y `--input-text`; no deben introducir un fondo oscuro
literal. El tema Claro establece `colorScheme: light` para que los controles nativos conserven
contraste; los demás usan `dark`.

El usuario puede editar cada color del contrato. Los valores se guardan en
`preferences.customTheme` y seleccionar otro tema no los borra. `themeStyle.test.ts` verifica que
Claro publique el esquema, el fondo y el texto de los inputs. Cualquier color nuevo debe agregarse
al contrato, al selector personalizado y a esa prueba.

## Reglas verificables

- No se admiten archivos `.css` dentro de `src`.
- `src/app/composition/main.tsx` monta `GlobalStyles`.
- `createGlobalStyle` solo puede aparecer en `shared/ui/tokens/GlobalStyles.ts`.
- No se crean clases `primary-button`, `ghost-button` o `danger-button`; se usa `Button`.
- Una feature no importa el archivo de estilos interno de otra feature.
- `npm run check:architecture` comprueba estas restricciones.
- `npm run validate` comprueba formato, lint, pruebas, arquitectura y build.

## Cómo agregar estilos

1. Declara el elemento con `styled.tag` junto al componente propietario.
2. Si el patrón ya existe, reutiliza un átomo, layout u organismo de `shared/ui`.
3. Usa el scope de feature solo para markup estrictamente local; nunca agregues CSS global.
4. Conserva estados visuales mediante transient props (`$active`, `$warning`), atributos o clases
   semánticas locales. No uses estilos inline salvo variables dinámicas del tema.
5. Ejecuta `npm run validate`.
6. Revisa al menos un ancho móvil y uno de escritorio cuando cambies layout, overflow o posición.
