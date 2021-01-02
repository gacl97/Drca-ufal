import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import Secretariat from './Secretariat';
import Teacher from './Teacher';
import Student from './Student';

@Entity('departaments')
class Departament {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Secretariat, secretariat => secretariat.departament)
  secretariats: Secretariat[];

  @OneToMany(() => Teacher, teacher => teacher.departament)
  teachers: Teacher[];

  @OneToMany(() => Student, student => student.departament)
  students: Student[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Departament;