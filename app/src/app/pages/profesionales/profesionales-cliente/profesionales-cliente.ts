import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Profesional } from '../../../core/models/profesional.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
    selector: 'app-profesionales-cliente',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './profesionales-cliente.html',
    styleUrl: './profesionales-cliente.css',
})
export class ProfesionalesCliente implements OnInit {
    private readonly profesionalService = inject(ProfesionalService);
    private readonly especialidadService = inject(EspecialidadService);
    private readonly categoriaService = inject(CategoriaService);
    private readonly router = inject(Router);

    readonly profesionales = signal<Profesional[]>([]);
    readonly especialidades = signal<Especialidad[]>([]);
    readonly categorias = signal<Categoria[]>([]);
    readonly loading = signal(true);

    readonly selectedModalidad = signal<'VIRTUAL' | 'PRESENCIAL' | 'MIXTA' | 'TODOS'>('TODOS');
    readonly selectedEspecialidad = signal<number | 'TODOS'>('TODOS');
    readonly selectedCategoria = signal<number | 'TODOS'>('TODOS');
    readonly precioMax = signal<number | null>(null);
    readonly profesionalesAbiertos = signal<Set<number>>(new Set());
    readonly soloDisponibles = signal(true);

    readonly modalidadOptions = [
        { label: 'Todos', value: 'TODOS' as const },
        { label: 'Virtual', value: 'VIRTUAL' as const },
        { label: 'Presencial', value: 'PRESENCIAL' as const },
        { label: 'Mixta', value: 'MIXTA' as const },
    ];

    readonly profesionalesFiltrados = computed(() => {
    return this.profesionales().filter(p => {
        if (this.soloDisponibles() && !p.disponible) return false;
        const coincideModalidad = this.selectedModalidad() === 'TODOS' || p.modalidad === this.selectedModalidad();
        const coincideEspecialidad = this.selectedEspecialidad() === 'TODOS' ||
            p.especialidades?.some(e => e.especialidad.id === this.selectedEspecialidad());
        const servicios = p.servicios ?? [];
        const coincideCategoria = this.selectedCategoria() === 'TODOS' ||
            servicios.some(s => s.categoriaId === this.selectedCategoria());
        const coincidePrecio = this.precioMax() === null ||
            servicios.some(s => Number(s.precio) <= this.precioMax()!);
        return coincideModalidad && coincideEspecialidad && coincideCategoria && coincidePrecio;
    });
});

    ngOnInit() {
        this.cargarDatos();
    }

    cargarDatos() {
        this.profesionalService.listar().subscribe({
            next: (res) => { this.profesionales.set(res.data); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
        this.especialidadService.listar().subscribe({
            next: (res) => this.especialidades.set(res.data),
        });
        this.categoriaService.listar().subscribe({
            next: (res) => this.categorias.set(res.data),
        });
    }

    canAgendar(profesionalDisponible: boolean, servicioActivo: boolean) {
        return profesionalDisponible && servicioActivo;
    }

    solicitarCita(profesionalId: number, servicioId: number, profesionalDisponible: boolean, servicioActivo: boolean) {
        if (!this.canAgendar(profesionalDisponible, servicioActivo)) {
            return;
        }

        this.router.navigate(['/cliente/citas/nueva'], {
            queryParams: { profesionalId, servicioId }
        });
    }

    getImageUrl(imagen: string) {
        return this.profesionalService.getImageUrl(imagen);
    }

    setModalidad(value: any) { this.selectedModalidad.set(value); }
    setEspecialidad(value: any) { this.selectedEspecialidad.set(value); }
    setCategoria(value: any) { this.selectedCategoria.set(value); }
    onPrecioMax(value: string) { this.precioMax.set(value ? Number(value) : null); }
    toggleDisponibles() { this.soloDisponibles.update(v => !v); }
    isServiciosAbierto(id: number) {
        return this.profesionalesAbiertos().has(id);
    }

    toggleServicios(id: number) {
        this.profesionalesAbiertos.update(actual => {
            const nuevosAbiertos = new Set(actual);
            if (nuevosAbiertos.has(id)) {
                nuevosAbiertos.delete(id);
            } else {
                nuevosAbiertos.add(id);
            }
            return nuevosAbiertos;
        });
    }
}