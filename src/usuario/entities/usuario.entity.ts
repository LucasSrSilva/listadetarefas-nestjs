import { ApiConsumes, ApiProperty } from "@nestjs/swagger"
import { Transform, TransformFnParams } from "class-transformer"
import { IsNotEmpty, IsEmail, MinLength } from "class-validator"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Tarefa } from "../../tarefa/entities/tarefa.entity"


@Entity({name: "tb_usuarios"})
export class Usuario {

    
    @PrimaryGeneratedColumn() 
    public id: number

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 255, nullable: false}) 
    @ApiProperty()
    public nome: string

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 255, nullable: false}) 
    @ApiProperty()
    public sobrenome: string

    @IsEmail()
    @IsNotEmpty()
    @Column({length: 255, nullable: false })
    @ApiProperty({example: "email@email.com"})
    public email: string

    @Column({nullable: true})
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
      })
    foto: string

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MinLength(8)
    @IsNotEmpty()
    @Column({length: 255, nullable: false }) 
    @ApiProperty()
    public senha: string

    
    @OneToMany(() => Tarefa, tarefa => tarefa.usuario)
    tarefa: Tarefa[]

}