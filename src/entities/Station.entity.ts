import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StationTypes } from '../intefaces/IStation';
import ITransfer from '../intefaces/ITransfer';
import LineEntity from './Line.entity';

@Entity()
export default class StationEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	info: string;

	@Column()
	stationNumber: number;

	@Column()
	dataSetId: string;

	@ManyToOne(() => LineEntity, (l) => l.stations, { eager: true })
	line: LineEntity;

	
	@Column({type: 'json', default: []})
	transfers: ITransfer[];

	@ManyToMany(() => StationEntity)
	@JoinTable()
	transfersRel: StationEntity[];

	@Column()
	stationName: string;

	@Column({ type: 'varchar' })
	stationType: StationTypes;
}
