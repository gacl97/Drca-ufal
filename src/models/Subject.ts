import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import SubjectType from './enums/SubjectType';
import Secretariat from './Secretariat';
import StudentToSubject from './StudentToSubject';

import Teacher from './Teacher';

@Entity('subjects')
class Subject {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Teacher, teacher => teacher.id)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToOne(() => Secretariat, secretariat => secretariat.id)
  @JoinColumn({ name: 'secretariat_id' })
  secretariat: Secretariat;

  @Column()
  secretariat_id: string;

  @Column()
  teacher_id: string;
  
  @OneToMany(() => StudentToSubject, studentToSubject => studentToSubject.subject)
  studentToSubject: StudentToSubject[];

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column('int')
  credits: number;

  @Column()
  minimum_credits: number;

  @Column('int')
  subject_type: SubjectType;
 
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Subject;