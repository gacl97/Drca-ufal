import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';

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

  @Exclude()
  @Column()
  secretariat_id: string;

  @Exclude()
  @Column()
  teacher_id: string;
  
  @OneToMany(() => StudentToSubject, studentToSubject => studentToSubject.subject)
  studentToSubject: StudentToSubject[];

  @ManyToMany(() => Subject, subject1 => subject1.pre_requisits, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinTable()
  pre_requisits: Subject[];

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
  
  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}

export default Subject;