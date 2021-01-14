import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';

import ConceptSubjectType from './enums/ConceptSubjectType';

import Student from "./Student";
import Subject from "./Subject";

@Entity('students_subjects')
class StudentToSubject {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float', { nullable: true})
  ab1: number;

  @Column('float', { nullable: true})
  ab2: number;
  
  @Column('float', { nullable: true})
  revaluation: number;

  @Column('float', { nullable: true})
  final_grade: number;

  @Column('int')
  concept: ConceptSubjectType;

  @ManyToOne(() => Subject, subject => subject.studentToSubject)
  subject: Subject;

  @ManyToOne(() => Student, student => student.studentToSubject, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  student: Student;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}

export default StudentToSubject;