import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import Departament from './Departament';
import StudyShiftType from './enums/StudyShiftType';
import StudentToSubject from './StudentToSubject';

@Entity('students')
class Student {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Departament, departament => departament.id)
  @JoinColumn({ name: 'departament_id'})
  departament: Departament;

  @Column()
  departament_id: string;

  @OneToMany(() => StudentToSubject, studentToSubject => studentToSubject.student)
  studentToSubject: StudentToSubject[];

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  matriculation: string;

  @Column('int')
  study_shift: StudyShiftType;

  @Column('int')
  current_credits: StudyShiftType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Student;