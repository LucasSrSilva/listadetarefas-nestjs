import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Tarefa } from "../entities/tarefa.entity";
import { TarefaService } from "../services/tarefa.service";

@ApiTags("Tarefas")
@UseGuards(JwtAuthGuard)
@Controller("/tarefas")
@ApiBearerAuth()
export class TarefaController {

    constructor(private readonly TarefaService: TarefaService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Tarefa[]> {
        return this.TarefaService.findAll();
    }

    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    findById(@Param("id", ParseIntPipe) id: number): Promise<Tarefa> {
        return this.TarefaService.findById(id);
    }

    @Get("/titulo/:titulo")
    @HttpCode(HttpStatus.OK)
    findByTitulo(@Param("titulo") titulo: string): Promise<Tarefa[]> {
        return this.TarefaService.findByTitulo(titulo)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() Tarefa: Tarefa): Promise<Tarefa> {
        return this.TarefaService.create(Tarefa);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() Tarefa: Tarefa): Promise<Tarefa> {
        return this.TarefaService.update(Tarefa);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.TarefaService.delete(id);
    }
}