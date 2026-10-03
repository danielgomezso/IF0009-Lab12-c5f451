import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, FormArray, AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { CharlaService, Charla } from '../../services/charla';

export const validarEdad: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  const edad = control.value;

  if (edad === null || edad === '') return null;

  return Number.isInteger(edad) && edad > 18 ? null : { edadInvalida: true };

};

export const validarRangoFechas: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  const inicio = control.get('fechaInicio')?.value;

  const fin = control.get('fechaFin')?.value;

  if (inicio && fin) {

    const dInicio = new Date(inicio);

    const dFin = new Date(fin);

    if (dFin < dInicio) {

      return { fechasInvalidas: true };

    }

  }

  return null;

};

@Component({

  selector: 'app-charla-registro',

  changeDetection: ChangeDetectionStrategy.Default,

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './charla-registro.html',

  styleUrl: './charla-registro.css'

})

export class CharlaRegistroComponent implements OnInit {

  private charlaService = inject(CharlaService);

  private fb = inject(FormBuilder);

  charlas: Charla[] = [];

  charlaSeleccionada: Charla | null = null;

  mensajeError = '';
  mensajeExito = '';

  inscribiendo = false;

  guardandoCharla = false;

  inscripcionForm = this.fb.nonNullable.group({

    asistente: this.fb.nonNullable.group({

      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/\S/)]],

      correo: ['', [Validators.required, Validators.email]],

      edad: [0, [Validators.required, validarEdad]]

    })

  });

  get asistenteForm() {

    return this.inscripcionForm.controls.asistente;

  }

  abrirInscripcion(charla: Charla) {

    this.charlaSeleccionada = charla;

    this.inscripcionForm.reset();

    this.mensajeExito = '';

    this.mensajeError = '';

  }

  inscribirAsistente() {

    if (this.inscripcionForm.invalid || this.inscribiendo) {

      this.inscripcionForm.markAllAsTouched();

      return;

    }

    const charla = this.charlaSeleccionada;

    if (!charla?.id) return;

    this.inscribiendo = true;

    this.mensajeError = '';

    this.charlaService.inscribirAsistente(charla.id, this.asistenteForm.getRawValue()).subscribe({

      next: (asistente) => {

        charla.asistentes = [...(charla.asistentes ?? []), asistente];

        this.charlaSeleccionada = null;

        this.inscribiendo = false;

        this.mensajeExito = 'Asistente inscrito exitosamente.';

      },

      error: () => {

        this.inscribiendo = false;

        this.mensajeError = 'No se pudo inscribir al asistente. Revisa los datos y el servidor.';

      }

    });

  }

  registroForm = this.fb.group({

    titulo: ['', [Validators.required, Validators.minLength(5)]],

    expositor: ['', [Validators.required]],

    nivel: ['Principiante', [Validators.required]],

    emailContacto: ['', [Validators.required, Validators.email]],

    fechaInicio: ['', [Validators.required]],

    fechaFin: ['', [Validators.required]],

    etiquetas: this.fb.array([

      this.fb.control('', Validators.required)

    ])

  }, { validators: validarRangoFechas });

  ngOnInit(): void {

    this.cargarCharlas();

  }

  cargarCharlas() {

    this.charlaService.getCharlas().subscribe({

      next: (data) => this.charlas = data,

      error: () => this.mensajeError = 'No se pudo cargar la agenda. Verifica que el servidor esté iniciado.'

    });

  }

  get etiquetasArray() {

    return this.registroForm.get('etiquetas') as FormArray;

  }

  agregarEtiqueta() {

    this.etiquetasArray.push(this.fb.control('', Validators.required));

  }

  removerEtiqueta(index: number) {

    if (this.etiquetasArray.length > 1) {

      this.etiquetasArray.removeAt(index);

    }

  }

  onSubmit(): void {

    if (this.registroForm.invalid || this.guardandoCharla) {

      this.registroForm.markAllAsTouched();

      return;

    }

    this.guardandoCharla = true;

    this.mensajeError = '';

    const nuevaCharla: Charla = this.registroForm.value as Charla;

    this.charlaService.registrarCharla(nuevaCharla).subscribe({

      next: (res) => {
        this.guardandoCharla = false;

        this.mensajeExito = '¡Charla registrada exitosamente!';

        this.charlas.push(res);

        this.registroForm.reset({ nivel: 'Principiante' });

        this.etiquetasArray.clear();

        this.agregarEtiqueta();

      },

      error: () => {

        this.guardandoCharla = false;

        this.mensajeError = 'No se pudo registrar la charla. Revisa los datos y el servidor.';

      }

    });

  }

  get tituloCtrl() { return this.registroForm.get('titulo'); }

  get expositorCtrl() { return this.registroForm.get('expositor'); }

  get emailCtrl() { return this.registroForm.get('emailContacto'); }

}

