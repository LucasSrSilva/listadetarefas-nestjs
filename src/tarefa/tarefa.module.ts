import { TypeOrmModule } from "@nestjs/typeorm";
import { TarefaController } from "./controllers/tarefa.controller";
import { Tarefa } from "./entities/tarefa.entity";
import { TarefaService } from "./services/tarefa.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Tarefa])],
    providers: [TarefaService],
    controllers: [TarefaController],
    exports: [TypeOrmModule]
})

export class TarefaModule { }