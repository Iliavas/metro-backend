export enum StationTypes {
	subway = 'subway',
	mcc = 'mcc',
}

export default interface IStation {
    stationType: StationTypes;
    stationName: string;
    lineName: string;
    dataSetId: string;
}
