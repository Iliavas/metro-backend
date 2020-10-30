import {Logger} from 'dvk-log';

const logger = new Logger({
    debugCb: async (x: any) => {},
    logCb: async (x) => {},
    errorCb: async () => {},
    successCb: async () => {}
})

export default logger;