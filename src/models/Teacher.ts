import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Teacher;