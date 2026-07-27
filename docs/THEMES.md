# Sistema de temas

## Temas disponibles

Configuración ofrece Medianoche, Grafito, Bosque, Claro y Personalizado. Las definiciones viven en `features/settings/domain/themes.ts`; la conversión a CSS vive en UI porque utiliza `CSSProperties`.

## Contrato de colores

Cada tema define fondo, panel, panel alterno, borde, texto, texto secundario, primario, acento, éxito, advertencia y peligro. `themeStyle` publica variables CSS para toda la aplicación.

Los controles usan específicamente `--input` y `--input-text`; nunca deben volver a introducir un fondo oscuro literal. El tema Claro también establece `colorScheme: light` para que selects y controles nativos conserven contraste. Los demás usan `dark`.

## Tema personalizado

El usuario puede editar cada color del contrato. Los valores se guardan en `preferences.customTheme`; seleccionar otro tema no los borra.

## Prueba de regresión

`themeStyle.test.ts` verifica que Claro publique esquema, fondo y texto de inputs. Cualquier color nuevo debe agregarse al contrato, al selector personalizado, a `themeStyle` y a esta documentación.
