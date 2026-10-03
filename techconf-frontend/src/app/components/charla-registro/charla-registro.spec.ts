import 'zone.js';
import { provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FormControl } from '@angular/forms';

import { provideHttpClient } from '@angular/common/http';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CharlaRegistroComponent, validarEdad } from './charla-registro';

import { Charla } from '../../services/charla';



describe('Inscripción de asistentes', () => {

  it('rechaza menores, 18 años y decimales; acepta 19', () => {

    for (const edad of [17, 18, 19.5]) {

      expect(validarEdad(new FormControl(edad))).toEqual({ edadInvalida: true });

    }

    expect(validarEdad(new FormControl(19))).toBeNull();

  });



  it('valida el grupo anidado y actualiza la tarjeta al inscribir', () => {

    TestBed.configureTestingModule({

      imports: [CharlaRegistroComponent],

      providers: [provideZoneChangeDetection(), provideHttpClient(), provideHttpClientTesting()]

    });

    const fixture = TestBed.createComponent(CharlaRegistroComponent);

    const component = fixture.componentInstance;

    const http = TestBed.inject(HttpTestingController);

    const charla: Charla = {

      id: 1, titulo: 'Angular', expositor: 'Ana', nivel: 'Principiante',

      emailContacto: 'ana@example.com', fechaInicio: '2026-11-01',

      fechaFin: '2026-11-02', etiquetas: ['Angular'], asistentes: []

    };

    fixture.detectChanges();

    http.expectOne('http://localhost:8080/api/charlas').flush([charla]);

    component.abrirInscripcion(component.charlas[0]);

    component.asistenteForm.setValue({ nombre: 'Ab', correo: 'incorrecto', edad: 18 });

    expect(component.inscripcionForm.invalid).toBe(true);

    component.inscribirAsistente();

    http.expectNone('http://localhost:8080/api/charlas/1/asistentes');

    const asistente = { nombre: 'Ana Rojas', correo: 'ana@example.com', edad: 19 };

    component.asistenteForm.setValue(asistente);

    expect(component.inscripcionForm.valid).toBe(true);

    component.inscribirAsistente();

    http.expectOne('http://localhost:8080/api/charlas/1/asistentes').flush({ ...asistente, id: 6 });

    fixture.detectChanges();

    expect(component.charlas[0].asistentes?.length).toBe(1);

    expect(fixture.nativeElement.textContent).toContain('Ana Rojas');

    expect(component.charlaSeleccionada).toBeNull();

    http.verify();

  });

});

