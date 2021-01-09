import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import Departament from './Departament';
import Subject from './Subject';

@Entity('teachers')
class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Departament, departament => departament.id)
  @JoinColumn({ name: 'departament_id'})
  departament: Departament;

  @OneToMany(() => Subject, subject => subject.teacher)
  subjects: Subject[];

  @Exclude()
  @Column()
  departament_id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  matriculation: string;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}

export default Teacher;