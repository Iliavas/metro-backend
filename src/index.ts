import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { createConnection } from 'typeorm';
import LineEntity from './entities/Line.entity';
import StationEntity from './entities/Station.entity';
import IStation from './intefaces/IStation';
import ITransfer from './intefaces/ITransfer';
import logger from './utils/logger';

import {JSDOM} from 'jsdom';

createConnection().then(async () => {
	logger.success('Db inited');

    // await loadStationsToDb();
    // await loadTransfersToDb();

    // await loadTransfersRelToDb();
	await exportStations();

	// await modifySvg();
	logger.success('data uploaded');
});

async function modifySvg() {
	const svg = readFileSync(resolve(__dirname, '../map.svg'));

	const dom = await JSDOM.fromFile(resolve(__dirname, '../map.svg'));

	const nodes = dom.window.document.querySelectorAll<HTMLDivElement>(`[id^='white-base']`);

	nodes.forEach(node => {
		node.parentElement?.removeChild(node);
	})


	writeFileSync(resolve(__dirname, '../map.svg'), dom.serialize());
}

async function exportStations() {
	const stations = await StationEntity.find({
		relations: ['line', 'transfersRel']
	});

	writeFileSync(resolve(__dirname, '../result.json'), JSON.stringify(stations));
}

async function loadTransfersRelToDb() {
    const json = <string>(<unknown>readFileSync(resolve(__dirname, '../transfers.json')));
    const data = <ITransfer[]>JSON.parse(json);
    
    for (const transfer of data) {
        const station = await StationEntity.findOne({
            where: {
                dataSetId: transfer.from
            }
        });

        if (station) {
            const transferStation = await StationEntity.findOne({
                where: {
                    dataSetId: transfer.to
                }
            })

            if (!station.transfersRel) {
                station.transfersRel = [];
            }

            if(transferStation) {
                station.transfersRel.push(transferStation);
            }

            await station.save();
        }
    }

    logger.success('transfers uploaded')
}

async function loadTransfersToDb() {
    const json = <string>(<unknown>readFileSync(resolve(__dirname, '../transfers.json')));
    const data = <ITransfer[]>JSON.parse(json);
    
    for (const transfer of data) {
        const station = await StationEntity.findOne({
            where: {
                dataSetId: transfer.from
            }
        });

        if (station) {
            station.transfers.push(transfer);
            await station.save();
        }
    }

    logger.success('transfers uploaded')
}

async function loadStationsToDb() {
	const json = <string>(<unknown>readFileSync(resolve(__dirname, '../csvjson.json')));
	const data = <IStation[]>JSON.parse(json);

	console.log(data);

	for (const stationData of data) {
		let line = await LineEntity.findOne({
			where: {
				lineName: stationData.lineName,
			},
		});

		if (!line) {
			line = new LineEntity();
			line.lineName = stationData.lineName;
			await line.save();
		}

		if (
			await StationEntity.findOne({
				where: {
					stationName: stationData.stationName,
					dataSetId: stationData.dataSetId,
					line: line,
				},
			})
		) {
			console.log(
				await StationEntity.findOne({
					where: {
						stationName: stationData.stationName,
						dataSetId: stationData.dataSetId,
						line: line,
					},
				})
			);
			continue;
		}

		const station = new StationEntity();

		station.dataSetId = stationData.dataSetId;
		station.line = line;
		station.stationNumber = 1;
		station.stationName = stationData.stationName;
		station.stationType = stationData.stationType;

		await station.save();
	}
}

