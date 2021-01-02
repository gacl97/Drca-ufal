import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import SecretariatType from './enums/SecretariatType';

import Departament from './Departament';
import Subject from './Subject';

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

  @Column()
  departament_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Secretariat;