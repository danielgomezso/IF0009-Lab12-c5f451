import 'zone.js';
import { provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';

import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { App } from './app';



describe('App', () => {

  it('muestra la agenda', async () => {

    await TestBed.configureTestingModule({

      imports: [App],

      providers: [provideZoneChangeDetection(), provideHttpClient(), provideHttpClientTesting()]

    }).compileComponents();

    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const http = TestBed.inject(HttpTestingController);

    http.expectOne('http://localhost:8080/api/charlas').flush([]);

    expect(fixture.nativeElement.textContent).toContain('Agenda de TechConf');

    http.verify();

  });

});

