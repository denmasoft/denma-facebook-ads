import "reflect-metadata";
import * as schedule from "node-schedule";
import {CronJob}  from 'cron';
import * as cluster from "cluster";
import {cpus} from "os"; 
import { FacebookAds } from './facebookAds';
import * as moment from 'moment-timezone';
const numCPUs = cpus().length;
export class Worker{
    private _date: string;
    constructor(_date){
        this._date = _date;
    }
    public async run(_date){
        let facebookAds = new FacebookAds();
        await facebookAds.Report(_date);
    }
}
if (cluster.isMaster) {
    console.log(`This machine has ${numCPUs} CPUs.`);
    for (let i = 0; i < 1; i++) {
        cluster.fork();
    } 
    cluster.on("online", (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    }); 
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
        console.log("Starting a new worker...");
        cluster.fork();
    });
} else {
    var job1 = new CronJob({
        cronTime: '00 */5 * * * *',
        onTick: async function() {
            job1.stop();
            let _dt = moment().tz("America/New_York");
            let _date = _dt.format('YYYY-MM-DD');//new Date().toISOString().split('T')[0];
            let worker = new Worker(_date);
            await worker.run(_date);
            job1.start();
        },
        start: false,
        timeZone: 'America/New_York'
  });
  job1.start();
  new CronJob('00 00 03 * * 1-7', async function() {
        job1.stop();
        let _dt = moment().subtract(1, 'day').tz("America/New_York");
        let _date = _dt.format('YYYY-MM-DD');
        let worker = new Worker(_date);
        await worker.run(_date);
        job1.start();
    }, null, true, 'America/New_York');
}