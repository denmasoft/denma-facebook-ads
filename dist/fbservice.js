"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const cron_1 = require("cron");
const cluster = require("cluster");
const os_1 = require("os");
const facebookAds_1 = require("./facebookAds");
const moment = require("moment-timezone");
const numCPUs = os_1.cpus().length;
class Worker {
    constructor(_date) {
        this._date = _date;
    }
    run(_date) {
        return __awaiter(this, void 0, void 0, function* () {
            let facebookAds = new facebookAds_1.FacebookAds();
            yield facebookAds.Report(_date);
        });
    }
}
exports.Worker = Worker;
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
}
else {
    var job1 = new cron_1.CronJob({
        cronTime: '00 */5 * * * *',
        onTick: function () {
            return __awaiter(this, void 0, void 0, function* () {
                job1.stop();
                let _dt = moment().tz("America/New_York");
                let _date = _dt.format('YYYY-MM-DD'); //new Date().toISOString().split('T')[0];
                let worker = new Worker(_date);
                yield worker.run(_date);
                job1.start();
            });
        },
        start: false,
        timeZone: 'America/New_York'
    });
    job1.start();
    new cron_1.CronJob('00 00 03 * * 1-7', function () {
        return __awaiter(this, void 0, void 0, function* () {
            job1.stop();
            let _dt = moment().subtract(1, 'day').tz("America/New_York");
            let _date = _dt.format('YYYY-MM-DD');
            let worker = new Worker(_date);
            yield worker.run(_date);
            job1.start();
        });
    }, null, true, 'America/New_York');
}
//# sourceMappingURL=fbservice.js.map