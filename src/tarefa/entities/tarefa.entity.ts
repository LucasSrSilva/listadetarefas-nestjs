import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty} from "class-validator";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: "tb_tarefas"})
export class Tarefa{

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 100, nullable: false})
    titulo: string;

    @ApiProperty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 100, nullable: false})
    descricao: string;

    @ApiProperty()
    @UpdateDateColumn()
    data: Date;

    @ApiProperty()
    @ManyToOne(() => Usuario, (usuario) => usuario.tarefa, {
        onDelete: "CASCADE"
    })
    usuario: () => Usuario
}