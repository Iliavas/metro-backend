import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import StationEntity from './Station.entity';

@Entity()
export default class LineEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
    lineName: string;

    @Column({nullable: true })
    info: string;

    @OneToMany(() => StationEntity, (s) => s.line)
    @JoinColumn()
    stations: StationEntity[];
}
