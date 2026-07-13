import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CitaService } from '../../../core/services/cita.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { Usuario } from '../../../core/models/usuario.model';
import { Profesional } from '../../../core/models/profesional.model';
import { Servicio } from '../../../core/models/servicio.model';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './cita-form.html',
  styleUrl: './cita-form.css',
})
export class CitaForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly citaService = inject(CitaService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly servicioService = inject(ServicioService);

  readonly modo = signal<'crear' | 'detalle'>('crear');
  readonly clientes = signal<Usuario[]>([]);
  readonly profesionales = signal<Profesional[]>([]);
  readonly servicios = signal<Servicio[]>([]);
  readonly serviciosFiltrados = signal<Servicio[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  citaId: number | null = null;

  readonly form = this.fb.group({
    clienteId: [null as number | null, Validators.required],
    profesionalId: [null as number | null, Validators.required],
    servicioId: [null as number | null, Validators.required],
    fechaCita: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    modalidad: ['PRESENCIAL', Validators.required],
    comentarioCliente: ['', Validators.required],
    estado: [{ value: '', disabled: true }],
  });

  ngOnInit(): void {
    this.cargarDatos();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modo.set('detalle');
      this.citaId = +id;
      this.form.disable();
    }
  }

  cargarDatos() {
    this.usuarioService.listar().subscribe({
      next: (res) => this.clientes.set(res.data.filter((u: any) => u.role === 'CLIENTE')),
      error: (err) => console.error(err),
    });
    this.profesionalService.listar().subscribe({
      next: (res) => this.profesionales.set(res.data.filter(p => p.disponible)),
      error: (err) => console.error(err),
    });
    this.servicioService.listar().subscribe({
      next: (res) => {
        this.servicios.set(res.data.filter((s: any) => s.estado));
        if (this.citaId) {
          this.cargarCita(this.citaId);
        }
      },
      error: (err) => console.error(err),
    });
  }

  onProfesionalChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    this.form.patchValue({ servicioId: null });
    this.serviciosFiltrados.set(
      this.servicios().filter(s => s.profesionalId === id)
    );
  }

  cargarCita(id: number) {
    this.citaService.obtenerPorId(id).subscribe({
      next: (res) => {
        const c = res.data;
        this.form.patchValue({
          clienteId: c.clienteId,
          profesionalId: c.profesionalId,
          servicioId: c.servicioId,
          fechaCita: c.fechaCita.split('T')[0],
          horaInicio: c.horaInicio,
          horaFin: c.horaFin,
          modalidad: c.modalidad,
          comentarioCliente: c.comentarioCliente ?? '',
          estado: c.estado,
        });
        this.serviciosFiltrados.set(
          this.servicios().filter(s => s.profesionalId === c.profesionalId)
        );
      },
      error: (err) => console.error(err),
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    const values = this.form.value;
    const data = {
      clienteId: Number(values.clienteId),
      profesionalId: Number(values.profesionalId),
      servicioId: Number(values.servicioId),
      fechaCita: values.fechaCita,
      horaInicio: values.horaInicio,
      horaFin: values.horaFin,
      modalidad: values.modalidad,
      comentarioCliente: values.comentarioCliente,
    };

    this.citaService.crear(data).subscribe({
      next: () => this.router.navigate(['/admin/citas']),
      error: (err) => {
        this.error.set('Ocurrió un error al guardar. Revisá los datos.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  volver() {
    this.router.navigate(['/admin/citas']);
  }
}