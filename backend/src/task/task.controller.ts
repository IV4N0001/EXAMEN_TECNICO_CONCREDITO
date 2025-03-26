import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/createTaskDto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTaskDto } from './dto/updateTaskDto';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @UseGuards(AuthGuard('jwt')) // Protege la ruta con JWT
    @Get()
    getTasksByUser(@Req() req) {
        return this.taskService.getTasksByUser(req.user.id); // req.user viene del JWT
    }

    @UseGuards(AuthGuard('jwt')) 
    @Post()
    createTask(@Body() newTask: CreateTaskDto, @Req() req) {
        return this.taskService.createTask(newTask, req.user.id); 
    }

    @UseGuards(AuthGuard('jwt')) 
    @Patch('id/:id')
    updateTask(@Body() newTask: UpdateTaskDto, @Param('id', ParseIntPipe) taskId: number, @Req() req) {
        return this.taskService.updateTask(newTask, taskId, req.user.id); 
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('id/:id')
    deleteTask(@Param('id', ParseIntPipe) taskId: number, @Req() req) {
        return this.taskService.deleteTask(taskId, req.user.id); // req.user viene del JWT

    }
}
