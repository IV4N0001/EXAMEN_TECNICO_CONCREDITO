import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/createTaskDto';
import { User } from 'src/user/user.entity';
import { UpdateTaskDto } from './dto/updateTaskDto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TaskService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache, // Inyecta el servicio de caché
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getTasksByUser(userId: number) {
    // Verifica si las tareas están en caché
    const cachedTasks = await this.cacheManager.get(`tasks_user_${userId}`);
    if (cachedTasks) {
      return cachedTasks; // Retorna las tareas desde la caché
    }

    // Si no están en caché, obtén las tareas de la base de datos
    const tasks = await this.taskRepository.find({
      where: { user: { id: userId } },
    });

    // Almacena las tareas en caché por 60 segundos
    await this.cacheManager.set(`tasks_user_${userId}`, tasks, 60);

    return tasks;
  }

  async createTask(task: CreateTaskDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tasks'],
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    // Verificar si el usuario ya tiene una tarea con el mismo título
    const existingTask = await this.taskRepository.findOne({
      where: { title: task.title, user: { id: userId } },
    });

    if (existingTask) {
      throw new HttpException(
        'Ya tienes una tarea con este título',
        HttpStatus.CONFLICT,
      );
    }

    const newTask = this.taskRepository.create({ ...task, user });
    await this.taskRepository.save(newTask);

    // Invalida la caché para el usuario después de crear una nueva tarea
    await this.cacheManager.del(`tasks_user_${userId}`);

    return { message: 'Tarea creada con éxito!' };
  }

  async updateTask(task: UpdateTaskDto, taskId: number, userId: number) {
    // Buscar la tarea existente
    const taskFound = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });

    if (!taskFound) {
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }

    // Verificar si ya existe otra tarea con el mismo título para este usuario
    if (task.title) {
      const existingTask = await this.taskRepository.findOne({
        where: { title: task.title, user: { id: userId } },
      });

      if (existingTask && existingTask.id !== taskId) {
        throw new HttpException(
          'Ya existe una tarea con el mismo título',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Manejar la fecha de completitud (completedAt)
    if (task.completed !== undefined) {
      if (task.completed) {
        // Si la tarea se marca como completada, establecer la fecha actual
        taskFound.completedAt = new Date();
      } else {
        // Si la tarea se desmarca, eliminar la fecha de completitud
        taskFound.completedAt = null;
      }
    }

    // Aplicar los cambios y guardar
    const updatedTask = Object.assign(taskFound, task);
    return await this.taskRepository.save(updatedTask);
  }

  async deleteTask(taskId: number, userId: number) {
    const deleteResult = await this.taskRepository.delete({
      id: taskId,
      user: { id: userId },
    });

    // Si no se eliminó ninguna fila, significa que la tarea no existe o no pertenece al usuario
    if (deleteResult.affected === 0) {
      throw new HttpException(
        'Tarea no encontrada o no tienes permisos',
        HttpStatus.NOT_FOUND,
      );
    }

    return deleteResult;
  }
}