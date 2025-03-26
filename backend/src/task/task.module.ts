import { Module } from "@nestjs/common";
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { User } from "src/user/user.entity";
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store'

@Module({
    imports: [
        TypeOrmModule.forFeature([Task, User]),
        CacheModule.register({
            store: redisStore,
            socket: {
              host: 'localhost',
              port: 6379
            },
          })
    ],
    providers: [TaskService],
    controllers: [TaskController],
    exports: [TaskService]
})

export class TaskModule {}