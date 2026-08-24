import { prisma } from '../config/prisma';
import { AppError } from '../utils/app-error';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authService = {

    async registrar(data: {
        nombre: string;
        apellidos: string;
        email: string;
        password: string;
        telefono?: string;
    }) {

        const existente = await prisma.usuario.findUnique({
            where: {
                email: data.email
            }
        });

        if (existente) {
            throw AppError.conflict(
                'Ya existe un usuario con ese correo'
            );
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
                password: passwordHash,
                telefono: data.telefono,
                role: 'CLIENTE',
                estado: true
            },
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
                role: true,
                estado: true,
                createdAt: true
            }
        });

        return usuario;
    },

    async login(data: {
        email: string;
        password: string;
    }) {

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: data.email
            }
        });

        if (!usuario) {
            throw AppError.unauthorized(
                'Correo o contraseña incorrectos'
            );
        }

        const passwordCorrecta = await bcrypt.compare(
            data.password,
            usuario.password
        );

        if (!passwordCorrecta) {
            throw AppError.unauthorized(
                'Correo o contraseña incorrectos'
            );
        }

        if (!usuario.estado) {
            throw AppError.forbidden(
                'El usuario está desactivado'
            );
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw AppError.internalServer(
                'JWT_SECRET no configurado'
            );
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                role: usuario.role
            },
            secret,
            {
                expiresIn: '2h'
            }
        );

        return {
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                email: usuario.email,
                telefono: usuario.telefono,
                role: usuario.role,
                estado: usuario.estado,
                createdAt: usuario.createdAt
            }
        };
    },

    async obtenerUsuarioActivo(id: number) {

        const usuario = await prisma.usuario.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
                role: true,
                estado: true,
                createdAt: true
            }
        });

        if (!usuario) {
            throw AppError.notFound(
                'Usuario no encontrado'
            );
        }

        return usuario;
    }
};