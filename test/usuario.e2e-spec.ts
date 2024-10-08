import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  let token:any;
  let usuarioId: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [__dirname + "./../src/**/entities/*.entity.ts"],
          synchronize: true,
          dropSchema: true
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("01 - Deve Cadastrar um novo Usuário", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        sobrenome: 'root',
        email: 'root@root.com',
        senha: 'rootroot'
      })
      .expect(201)

    usuarioId = resposta.body.id;

  });

  it("02 - Não Deve Cadastrar um Usuário Duplicado", async () => {
    await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        sobrenome: 'root',
        email: 'root@root.com',
        senha: 'rootroot'
      })
      .expect(400)

  });

  it("03 - Deve Autenticar o Usuário (Login)", async () => {
    const resposta = await request(app.getHttpServer())
    .post("/usuarios/logar")
    .send({
      email: 'root@root.com',
      senha: 'rootroot'
    })
    .expect(200)

    token = resposta.body.token;

  })

  it("04 - Deve Listar todos os Usuários", async () => {
    return request(app.getHttpServer())
    .get('/usuarios/all')
    .set('Authorization', `${token}`)
    .send({})
    .expect(200)
  })

  it("05 - Deve Atualizar um Usuário", async () => {
    return request(app.getHttpServer())
    .put('/usuarios/atualizar')
    .set('Authorization', `${token}`)
    .send({
      id: usuarioId,
      nome: 'Root Atualizado',
      email: 'root@root.com',
      senha: 'rootroot'
    })
    .expect(200)
    .then( resposta => {
      expect("Root Atualizado").toEqual(resposta.body.nome);
    })

  })

  it("06 - Deve listar apenas um usuário pelo Id", async () => {
    return request(app.getHttpServer())
    .get(`/usuarios/${usuarioId}`)
    .set('Authorization', `${token}`)
    .send({})
    .expect(200)
  })
});