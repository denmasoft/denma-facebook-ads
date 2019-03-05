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
const appRoot = require("app-root-path");
const config = require(appRoot + '/config.json');
const fs = require("fs");
var FB = require('fb').default;
FB.options({ version: 'v3.0' });
const adsSdk = require('facebook-nodejs-business-sdk');
const typeorm_1 = require("typeorm");
class FacebookAds {
    constructor() {
    }
    _getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let options = {
                    client_id: config.facebook.client_id,
                    client_secret: config.facebook.client_secret,
                    grant_type: 'client_credentials'
                };
                FB.api('oauth/access_token', options, (res) => {
                    if (!res || res.error) {
                        console.log(!res ? 'error occurred' : res.error);
                        return;
                    }
                    resolve(res);
                });
            });
        });
    }
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let $oauth = yield this._getAccessToken();
            return $oauth;
        });
    }
    _extendAccessToken($access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let options = {
                    client_id: config.facebook.client_id,
                    client_secret: config.facebook.client_secret,
                    grant_type: 'fb_exchange_token',
                    fb_exchange_token: $access_token
                };
                FB.api('oauth/access_token', options, (res) => {
                    if (!res || res.error) {
                        console.log(!res ? 'error occurred' : res.error);
                        return;
                    }
                    resolve(res);
                });
            });
        });
    }
    updateAccessToken($access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            let cdata = fs.readFileSync(appRoot + '/config.json', 'utf8');
            let _config = JSON.parse(cdata);
            _config.access_token = $access_token;
            let _data = JSON.stringify(_config);
            fs.writeFileSync(appRoot + '/config.json', _data);
        });
    }
    extendAccessToken($access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            let oauth = yield this._extendAccessToken($access_token);
            yield this.updateAccessToken(oauth['access_token']);
        });
    }
    _init(access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const api = adsSdk.FacebookAdsApi.init(access_token);
        });
    }
    _exchangeCodeForToken($code) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                FB.api('oauth/access_token', {
                    client_id: config.facebook.client_id,
                    client_secret: config.facebook.client_secret,
                    redirect_uri: config.facebook.redirect_uri,
                    code: $code
                }, function (res) {
                    if (!res || res.error) {
                        console.log(!res ? 'error occurred' : res.error);
                        return;
                    }
                    resolve(res);
                });
            });
        });
    }
    exchangeCodeForToken($code) {
        return __awaiter(this, void 0, void 0, function* () {
            let $oauth = yield this._exchangeCodeForToken($code);
            return $oauth;
        });
    }
    _getMyAdsAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                FB.api('/me/adaccounts', (res) => {
                    if (res && res.error) {
                        if (res.error.code === 'ETIMEDOUT') {
                            console.log('request timeout');
                        }
                        else {
                            console.log('error', res.error);
                        }
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        });
    }
    getMyAdsAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.extendAccessToken(config.facebook.access_token);
            FB.setAccessToken(config.facebook.access_token);
            let $adsAccounts = yield this._getMyAdsAccounts();
            return $adsAccounts['data'];
        });
    }
    getInsights($obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const campaignAdsInsightsParams = Object.assign({ date_preset: 'last_year' }, {});
            const insightsFields = ['impressions', 'frequency', 'unique_clicks', 'actions', 'spend', 'cpc'];
            let campaigsAdsInsightsFields = insightsFields.concat('campaign_id', 'campaign_name', 'account_id');
            let insights = yield $obj.getInsights(campaigsAdsInsightsFields, campaignAdsInsightsParams);
            while (insights.hasNext()) {
                let _insights = yield insights.next();
                insights.concat(_insights);
            }
            return insights;
        });
    }
    delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    _getDBConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield typeorm_1.getConnection();
                if (!connection.isConnected) {
                    yield connection.connect();
                }
            }
            catch (e) {
                connection = yield typeorm_1.createConnection();
            }
            return connection;
        });
    }
    camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index == 0 ? letter.toUpperCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }
    getInsightsAsync(account, level, since, until) {
        return __awaiter(this, void 0, void 0, function* () {
            let _account = new adsSdk.AdAccount(account);
            let params = {
                'level': level,
                'time_range': { 'since': since, 'until': until },
                'breakdowns': 'hourly_stats_aggregated_by_audience_time_zone',
                'time_increment': 1,
                'sort': 'date_start_ascending'
            };
            let fields = ['date_start', 'account_currency', 'account_id', 'account_name', 'clicks', 'cost_per_inline_link_click', 'cost_per_inline_post_engagement', 'impressions', 'frequency', 'unique_clicks', 'spend', 'cpc'];
            if (level == 'adset' || level == 'ad' || level == 'campaign') {
                fields = ['date_start', 'account_currency', 'account_id', 'account_name', 'ad_id', 'ad_name', 'adset_id', 'adset_name', 'buying_type', 'campaign_id', 'campaign_name', 'clicks', 'cost_per_inline_link_click', 'cost_per_inline_post_engagement', 'impressions', 'frequency', 'unique_clicks', 'spend', 'cpc'];
            }
            let async_job = null;
            try {
                async_job = yield _account.getInsightsAsync(fields, params);
                let reportId = async_job.report_run_id;
                async_job.id = reportId;
                yield async_job.read();
                while (async_job.async_status != 'Job Completed') {
                    yield this.delay(3500);
                    yield async_job.read();
                }
                return async_job;
            }
            catch (error) {
                throw new Error(JSON.stringify({ 'code': 'FB', 'info': error, 'call': 'getInsightsAsync' }));
            }
            return async_job;
        });
    }
    _getInsights(async_job) {
        return __awaiter(this, void 0, void 0, function* () {
            let accountInsights = [];
            try {
                console.log(async_job.async_status);
                let insights = yield async_job.getInsights();
                for (let n = 0; n < insights.length; n++) {
                    accountInsights.push(insights[n]);
                }
                yield this.delay(3500);
                while (insights.hasNext()) {
                    yield this.delay(3500);
                    let _insights = yield insights.next();
                    for (let n = 0; n < _insights.length; n++) {
                        accountInsights.push(_insights[n]);
                    }
                }
                return accountInsights;
            }
            catch (error) {
                throw new Error(JSON.stringify({ 'code': 'FB', 'info': error, 'call': '_getInsights' }));
            }
        });
    }
    bulkPersist(entity, insights, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection.createQueryBuilder().insert().into(entity).values(insights).execute();
            }
            catch (error) {
                throw new Error(JSON.stringify({ 'code': 'DB', 'info': error, 'call': 'bulkPersist' }));
            }
        });
    }
    bulkDelete(entity, since, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection.createQueryBuilder().delete().from(entity).where("date_start = :_start", { _start: since }).execute();
            }
            catch (error) {
                throw new Error(JSON.stringify({ 'code': 'DB', 'info': error, 'call': 'bulkDelete' }));
            }
        });
    }
    persist(entity, insights, _date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (insights.length > 0) {
                    let connection = yield this._getDBConnection();
                    yield this.bulkDelete(entity, _date, connection);
                    yield this.bulkPersist(entity, insights, connection);
                    yield connection.close();
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getAccountReport(account, level, since, until) {
        return __awaiter(this, void 0, void 0, function* () {
            let insights = [];
            try {
                let async_job = yield this.getInsightsAsync(account, level, since, until);
                insights = yield this._getInsights(async_job);
                return insights;
            }
            catch (e) {
                console.log(e.message);
                yield this.delay(60000 * 15);
                insights = yield this.getAccountReport(account, level, since, until);
                return insights;
            }
        });
    }
    Report(_date) {
        return __awaiter(this, void 0, void 0, function* () {
            let accounts = yield this.getMyAdsAccounts();
            yield this._init(config.facebook.access_token);
            for (let index = 0; index < accounts.length; index++) {
                const element = accounts[index];
                yield this.saveAccountReport(element.id, _date);
                yield this.saveCampaignReport(element.id, _date);
                yield this.saveAdReport(element.id, _date);
            }
            return 'Job Completed';
        });
    }
    testCron(_date, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(_date + '----' + msg);
        });
    }
    saveAccountReport(accid, _date) {
        return __awaiter(this, void 0, void 0, function* () {
            let insights = yield this.getAccountReport(accid, 'account', _date, _date);
            yield this.persist('Account', insights, _date);
            console.log('Total Insights for account ' + accid + ' during ' + _date + ': ' + insights.length);
            yield this.delay(5000);
        });
    }
    saveCampaignReport(accid, _date) {
        return __awaiter(this, void 0, void 0, function* () {
            let insights = yield this.getAccountReport(accid, 'campaign', _date, _date);
            yield this.persist('Campaign', insights, _date);
            console.log('Total Campaigns for account ' + accid + ' during ' + _date + ': ' + insights.length);
            yield this.delay(5000);
        });
    }
    saveAdReport(accid, _date) {
        return __awaiter(this, void 0, void 0, function* () {
            let insights = yield this.getAccountReport(accid, 'ad', _date, _date);
            yield this.persist('Ad', insights, _date);
            console.log('Total Ads for account ' + accid + ' during ' + _date + ': ' + insights.length);
            yield this.delay(5000);
        });
    }
}
exports.FacebookAds = FacebookAds;
//# sourceMappingURL=facebookAds.js.map