import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AppController } from './app.controller';
import { ProdService } from './data/services/prod.service';
import { TarefaModule } from './tarefa/tarefa.module';
import { ConfigModule } from '@nestjs/config';
import { DevService } from './data/services/dev.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: ProdService,
      imports: [ConfigModule],
    }),
    TarefaModule,
    AuthModule,
    UsuarioModule, 
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
