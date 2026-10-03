INSERT INTO charla (titulo, expositor, nivel, email_contacto, fecha_inicio, fecha_fin) 
VALUES ('Introduccion a la Inteligencia Artificial', 'Dra. Maria Rojas', 'Principiante', 'maria@ai-tech.com', '2026-11-01', '2026-11-02');

INSERT INTO charla (titulo, expositor, nivel, email_contacto, fecha_inicio, fecha_fin) 
VALUES ('Microservicios con Spring Cloud', 'Ing. Carlos Brenes', 'Avanzado', 'carlos@spring.io', '2026-11-15', '2026-11-17');

INSERT INTO charla (titulo, expositor, nivel, email_contacto, fecha_inicio, fecha_fin) 
VALUES ('Angular 18: Señales y Standalone', 'Licda. Laura Gomez', 'Intermedio', 'laura@angular.dev', '2026-12-05', '2026-12-06');

INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (1, 'IA');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (1, 'Machine Learning');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (2, 'Spring Boot');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (2, 'Backend');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (2, 'Nube');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (3, 'Angular');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (3, 'Frontend');

INSERT INTO asistente (nombre, correo, edad, charla_id) VALUES ('Ana Rojas', 'ana@example.com', 21, 1);
INSERT INTO asistente (nombre, correo, edad, charla_id) VALUES ('Luis Mora', 'luis@example.com', 25, 1);
INSERT INTO asistente (nombre, correo, edad, charla_id) VALUES ('Sofia Vega', 'sofia@example.com', 19, 2);
INSERT INTO asistente (nombre, correo, edad, charla_id) VALUES ('Carlos Solis', 'carlos@example.com', 30, 2);
INSERT INTO asistente (nombre, correo, edad, charla_id) VALUES ('Maria Castro', 'maria@example.com', 22, 3);
