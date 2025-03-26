import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({})
    title: string;

    @Column({ default: false })
    completed: boolean;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date; // Fecha de creación de la tarea

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt: Date | null; // Fecha de completado (puede ser nulo)

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    user: User;
}