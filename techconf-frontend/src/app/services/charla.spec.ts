import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CharlaService } from './charla';

describe('CharlaService', () => {
  it('envía el asistente a la charla seleccionada', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const service = TestBed.inject(CharlaService);
    const http = TestBed.inject(HttpTestingController);
    const asistente = { nombre: 'Ana Rojas', correo: 'ana@example.com', edad: 19 };
    service.inscribirAsistente(2, asistente).subscribe();
    const request = http.expectOne('http://localhost:8080/api/charlas/2/asistentes');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(asistente);
    request.flush({ ...asistente, id: 6 });
    http.verify();
  });
});
