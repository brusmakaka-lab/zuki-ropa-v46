# Verificación del respaldo · 2026-11-16

## Código preservado

HEAD de origen: `0e83edf8024eb255f122233fe8f02d50ed5456bd`; 1 commits previos.

Se copiaron los archivos actuales, incluidos cambios sin commit y archivos nuevos del proyecto. Se excluyeron dependencias, compilaciones y archivos privados; el código funcional no fue modificado para conseguir la compilación. README, reglas de exclusión y documentación de respaldo se prepararon en una copia de trabajo independiente.

Se conserva el commit inicial y se añade el código modificado/no rastreado más reciente junto con documentación. En `.env.example` se dejó `JWT_SECRET` vacío para evitar reutilizar un marcador de ejemplo como secreto. Se conservaron recursos de marca; las capturas de auditoría quedaron fuera y algunos documentos históricos pueden referenciarlas.

## Controles ejecutados antes de publicar

Pasaron generación/validación del esquema, lint, tipos, 5 tests unitarios y build con configuración sintética. El build y los fixtures permiten verificar el frontend, pero no resuelven el bloqueo Prisma señalado. No se validaron persistencia, checkout real, autenticación completa ni servicios externos.

La instalación usó `npm ci --ignore-scripts` con el lockfile y luego generación explícita del cliente Prisma. Los valores de prueba se limitaron al proceso; no se copiaron secretos productivos.

## Publicación y recuperación

El procedimiento de publicación exige revisar con Gitleaks los archivos seleccionados y todos los commits, comprobar el número de commits revisados, publicar en un repositorio público nuevo sin forzar historial y comparar el árbol remoto completo (rutas, modos y hashes Git).

Después se clona desde GitHub en una carpeta nueva, se instala desde el lockfile, se repiten los controles y se cotejan los hashes. El resultado final, commits y evidencia de recuperación se registran en el inventario local del propietario; este documento describe los controles previos y el procedimiento exigido, no anticipa sus resultados.

## Qué no certifica

No es una auditoría exhaustiva de seguridad ni una prueba de compras reales, cobros, entrega de mensajes o disponibilidad del proveedor. No se importaron bases personales. Los archivos privados y medios externos no quedan respaldados por esta publicación. No se eliminó ni movió ningún proyecto original.
