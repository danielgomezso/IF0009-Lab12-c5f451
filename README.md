# TechConf - Laboratorio 12

Expansión de la práctica 11 con inscripción de asistentes

## Ejecución

Requisitos: Java 21 o superior (el pom usa 21), Node.js compatible con Angular 22 y npm.

En una terminal desde la raíz:

```powershell
cd techconf
.\mvnw.cmd spring-boot:run
```

En otra terminal desde la raíz:

```powershell
cd techconf-frontend
npm ci
npm start
```

Abrir http://localhost:4200. El backend usa http://localhost:8080 y permite ese origen de Angular. H2 está en memoria: los registros nuevos desaparecen al reiniciar y `data.sql` carga nuevamente las tres charlas y cinco asistentes iniciales.

## Formulario y validaciones

`inscripcionForm` contiene otro FormGroup llamado `asistente`, con `nombre`, `correo` y `edad`. El HTML utiliza `formGroupName="asistente"`. Se envía solamente el grupo interno porque el endpoint espera esos tres campos directamente.

El validador personalizado `validarEdad` acepta enteros mayores de 18: 18 se rechaza y 19 se acepta. `Validators.required` cubre el campo vacío. En Java se utilizan `@NotNull` y `@Min(19)`. El nombre utiliza `@NotBlank` y `@Size(min = 3)`; el correo, `@NotBlank` y `@Email`.

El formulario de charlas conserva su FormArray dinámico de etiquetas y su validación de fechas. En el servidor se comprueban también las fechas con `@AssertTrue`, la lista con `@NotEmpty` y cada etiqueta con `@NotBlank`.

## API

- `GET /api/charlas`: charlas con etiquetas y asistentes.
- `POST /api/charlas`: crea una charla válida.
- `POST /api/charlas/{id}/asistentes`: inscribe a una persona en la charla indicada.

Ejemplo de cuerpo para la inscripción:

```json
{
  "nombre": "Ana Rojas",
  "correo": "ana@example.com",
  "edad": 19
}
```

## Proceso de depuración realizado

1. Se implementó la relación bidireccional: `Charla.asistentes` usa `@OneToMany` y `Asistente.charla` usa `@ManyToOne` con `@JoinColumn(name = "charla_id")`.
2. Se conservó una copia temporal del archivo correcto y se retiró únicamente `@JsonIgnore` del campo `Asistente.charla`.
3. Se inició una instancia de prueba desde la raíz con `mvn -f techconf/pom.xml spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"`. El puerto 8081 se usó solo para esta reproducción.
4. Se hizo un GET a `http://localhost:8081/api/charlas`. La respuesta fue HTTP 500. Luego se abrió esa dirección en el navegador y se guardó la captura real en `docs/error_recursion.png`.
5. Se revisó el log. El mensaje observado fue `HttpMessageNotWritableException: Could not write JSON: Document nesting depth (501) exceeds the maximum allowed (500, from StreamWriteConstraints.getMaxNestingDepth())`. La foto está en `docs/error_recursion.log`.
6. La causa fue el ciclo `charla -> asistentes -> charla -> asistentes`. En esta versión Jackson interrumpe la serialización por su límite de profundidad, por lo que no fue necesario llegar a un StackOverflowError. No fue un problema de Content-Type.
7. Se restauró `@JsonIgnore` sobre `Asistente.charla`, se detuvo la instancia de prueba y se volvió a iniciar con el archivo corregido.
8. El mismo GET respondió correctamente con tres charlas y cinco asistentes. Los asistentes ya no incluyen una propiedad `charla` que vuelva a abrir el ciclo. También se verificó la inscripción con POST y la consulta posterior.

### Directivas utilizadas

`@JsonIgnore` pertenece a `com.fasterxml.jackson.annotation` y excluye `Asistente.charla` del JSON sin eliminar la relación JPA ni su clave foránea. La lista `Charla.asistentes` se sigue serializando. También se aplica al método `isRangoFechasValido` para que la comprobación interna de fechas no aparezca como una propiedad del JSON.

No se utilizaron `@JsonManagedReference`, `@JsonBackReference` ni se aumentó el límite de anidación: ignorar la referencia de regreso resuelve el ciclo de forma sencilla.
