import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import SecretariatType from './enums/SecretariatType';

import Departament from './Departament';
import Subject from './Subject';
import Student from './Student';

@Entity('secretariats')
class Secretariat {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  type: SecretariatType;

  @ManyToOne(() => Departament, departament => departament.id)
  @JoinColumn({ name: 'departament_id' })
  departament: Departament;

  @OneToMany(() => Subject, subject => subject.secretariat)
  subjects: Subject[];

  @OneToMany(() => Student, student => student.secretariat)
  students: Student[];

  @Exclude()
  @Column()
  departament_id: string;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}

export default Secretariat;