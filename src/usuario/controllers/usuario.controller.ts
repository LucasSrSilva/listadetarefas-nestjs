import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Usuario } from "../entities/usuario.entity";
import { UsuarioService } from "../services/usuario.service";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';

@ApiTags("Usuario")
@Controller("/usuarios")
@ApiBearerAuth()
export class UsuarioController{

    constructor(private readonly usuarioService: UsuarioService){ }
    
    @UseGuards(JwtAuthGuard)
    @Get('/all')
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Usuario[]>{
        return this.usuarioService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Usuario>{
        return this.usuarioService.findById(id)
    }

    @Post('/cadastrar')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('foto', {
        storage: diskStorage({
            destination: './src/usuario/uploads',
            filename: (req, file, callback) => {
                const uniqueName = `${uuidv4()}-${file.originalname}`;
      callback(null, uniqueName);
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Cadastra um novo usuário com upload de foto' })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() usuario: Usuario,
    ): Promise<Usuario>{
        return this.usuarioService.create(usuario, file)
    }

    @UseGuards(JwtAuthGuard)
    @Put('/atualizar')
    @HttpCode(HttpStatus.OK)
    async update(@Body() usuario: Usuario): Promise<Usuario>{
        return this.usuarioService.update(usuario)
    }

}