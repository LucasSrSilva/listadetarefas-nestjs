import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';


@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) { }

    async findByUsuario(usuario: string): Promise<Usuario | undefined> {
        return await this.usuarioRepository.findOne({
            where: {
                email: usuario
            }
        })
    }

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find(
            {
                relations: {
                    tarefa: true
                }
            }
        );

    }

    async findById(id: number): Promise<Usuario> {

        let usuario = await this.usuarioRepository.findOne({
            where: {
                id
            },
            relations: {
                tarefa: true
            }
        });

        if (!usuario)
            throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);

        return usuario;

    }

    async create(usuario: Usuario, file: Express.Multer.File): Promise<Usuario> {

        let buscaUsuario = await this.findByUsuario(usuario.email);

        if (!buscaUsuario) {
            if (file) {
                if (!existsSync('./src/usuario/uploads')) {
                    mkdirSync('./src/usuario/uploads');
                }
                console.log(file.path)
                usuario.foto = file.filename
            }

            usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
            return await this.usuarioRepository.save(usuario);
        }

        throw new HttpException("O Usuario ja existe!", HttpStatus.BAD_REQUEST);

    }

    async update(usuario: Usuario): Promise<Usuario> {

        let updateUsuario: Usuario = await this.findById(usuario.id);
        let buscaUsuario = await this.findByUsuario(usuario.email);

        if (!updateUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        if (buscaUsuario && buscaUsuario.id !== usuario.id)
            throw new HttpException('Usuário (e-mail) já Cadastrado!', HttpStatus.BAD_REQUEST);

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
        return await this.usuarioRepository.save(usuario);

    }

}