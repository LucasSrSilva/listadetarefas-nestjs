import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Tarefa } from "../entities/tarefa.entity";

@Injectable()
export class TarefaService {

    constructor(
        @InjectRepository(Tarefa)
        private TarefaRepository: Repository<Tarefa>
    ) { }

    async findAll(): Promise<Tarefa[]> {
        return await this.TarefaRepository.find({
            relations: [
                'usuario'
            ]
        })
    }

    async findById(id: number): Promise<Tarefa> {
        let buscaTarefa = await this.TarefaRepository.findOne({
            where: {
                id
            },
            relations: [
                'usuario'
            ]
        });

        if (!buscaTarefa) {
            throw new HttpException("Tarefa não foi encontrada!", HttpStatus.NOT_FOUND);

        };
        return buscaTarefa;
    }

    async findByTitulo(titulo: string): Promise<Tarefa[]> {
        return await this.TarefaRepository.find({
            where: {
                titulo: ILike(`%${titulo}%`)
            },
            relations: [
                'usuario'
            ]
        })
    }

    async create(Tarefa: Tarefa): Promise<Tarefa> {
        return await this.TarefaRepository.save(Tarefa);
    }

    async update(Tarefa: Tarefa): Promise<Tarefa> {

        let buscaTarefa = await this.findById(Tarefa.id);

        if (!buscaTarefa || !Tarefa.id) {
            throw new HttpException("A Tarefa não foi encontrada!", HttpStatus.NOT_FOUND);
        }

        return await this.TarefaRepository.save(Tarefa);
    }

    async delete(id: number): Promise<DeleteResult> {
        let buscaTarefa = await this.findById(id);

        if (!buscaTarefa) {
            throw new HttpException("Tarefa não foi encontrada!", HttpStatus.NOT_FOUND);

        };
        return await this.TarefaRepository.delete(id);
    }
}