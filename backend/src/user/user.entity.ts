import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from 'src/task/task.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    restorePasswordToken: string | null;

    @Column({ type: 'timestamp', nullable: true })
    restorePasswordTokenExpires: Date | null;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}
