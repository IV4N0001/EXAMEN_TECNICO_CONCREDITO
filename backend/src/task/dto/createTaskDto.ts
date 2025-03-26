import { IsNotEmpty, IsString } from "class-validator"

export class CreateTaskDto {
    @IsNotEmpty({ message: 'Ingrese el nombre de la tarea'})
    @IsString()
    title: string
}