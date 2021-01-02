import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Student from "./Student";
import Subject from "./Subject";

import ConceptSubjectType from './enums/ConceptSubjectType';

@Entity('students_subjects')
class StudentToSubject {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  ab1: number;

  @Column('float')
  ab2: number;
  
  @Column('float')
  revaluation: number;

  @Column('float')
  final_grade: number;

  @Column('int')
  concept: ConceptSubjectType;

  @ManyToOne(() => Subject, subject => subject.studentToSubject)
  subject: Subject;

  @ManyToOne(() => Student, student => student.studentToSubject)
  student: Student;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default StudentToSubject;