import * as appRoot from 'app-root-path';
const config = require(appRoot + '/config.json');
import * as fs from 'fs';
var FB = require('fb').default;
FB.options({version: 'v3.0'});
const adsSdk = require('facebook-nodejs-business-sdk');
import {AdReportRun,AdsInsightsLevelValues} from 'facebook-nodejs-ads-sdk';
import { Insight } from './Models/Insight';
import {getManager} from "typeorm";
import {getConnection,createConnection} from "typeorm";
import { Account } from './entity/Account';
import { Campaign } from './entity/Campaign';
import { Ad } from './entity/Ad';
import { Adset } from './entity/Adset';
export class FacebookAds{
    constructor(){
    }
    private async _getAccessToken():Promise<any>{
        return new Promise((resolve, reject)=>{
            let options = {
                client_id: config.facebook.client_id,
                client_secret: config.facebook.client_secret,
                grant_type: 'client_credentials'
            };
            FB.api('oauth/access_token',options,(res)=>{
                if(!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                }
                resolve(res);
            })
        })
    }
    private async getAccessToken():Promise<any>{
        let $oauth = await this._getAccessToken();
        return $oauth;
    }
    private async _extendAccessToken($access_token):Promise<any>{
        return new Promise((resolve, reject)=>{
            let options={
                client_id: config.facebook.client_id,
                client_secret: config.facebook.client_secret,
                grant_type: 'fb_exchange_token',
                fb_exchange_token: $access_token
            };
            FB.api('oauth/access_token', options, (res)=>{
                if(!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                }
                resolve(res);
            });
        })
    }
    private async updateAccessToken($access_token):Promise<void>{
        let cdata = fs.readFileSync(appRoot+'/config.json', 'utf8');
        let _config = JSON.parse(cdata);
        _config.access_token = $access_token;
        let _data = JSON.stringify(_config);  
        fs.writeFileSync(appRoot+'/config.json', _data);
    }
    private async extendAccessToken($access_token): Promise<void>{
        let oauth = await this._extendAccessToken($access_token);
        await this.updateAccessToken(oauth['access_token']);
    }
    private async _init(access_token):Promise<void>{
        const api = adsSdk.FacebookAdsApi.init(access_token);
    }
    private async _exchangeCodeForToken($code):Promise<any>{
        return new Promise((resolve, reject)=>{
            FB.api('oauth/access_token', {
                client_id: config.facebook.client_id,
                client_secret: config.facebook.client_secret,
                redirect_uri: config.facebook.redirect_uri,
                code: $code
            }, function (res) {
                if(!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                }
                resolve(res);
            });
        })
    }
    private async exchangeCodeForToken($code):Promise<any>{
        let $oauth = await this._exchangeCodeForToken($code);
        return $oauth;
    }
    private async _getMyAdsAccounts():Promise<any>{
        return new Promise((resolve, reject)=>{
            FB.api('/me/adaccounts',(res)=>{
                if(res && res.error) {
                    if(res.error.code === 'ETIMEDOUT') {
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
        })
    }
    private async getMyAdsAccounts():Promise<any>{
        await this.extendAccessToken(config.facebook.access_token);
        FB.setAccessToken(config.facebook.access_token);
        let $adsAccounts = await this._getMyAdsAccounts();
        return $adsAccounts['data'];
    }
    private async getInsights($obj):Promise<any>{
        const campaignAdsInsightsParams = Object.assign({date_preset: 'last_year'}, {});
        const insightsFields = ['impressions', 'frequency', 'unique_clicks', 'actions', 'spend', 'cpc'];
        let campaigsAdsInsightsFields = insightsFields.concat('campaign_id','campaign_name','account_id');
        let insights = await $obj.getInsights(campaigsAdsInsightsFields,campaignAdsInsightsParams);
        while (insights.hasNext()) {
            let _insights = await insights.next();
            insights.concat(_insights);
        }
        return insights;
    }
    private async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    private async _getDBConnection(){
        let connection;
        	try {
        	   connection = await getConnection();
        	   if (!connection.isConnected) {
        	     await connection.connect();
        	   }
        	} catch (e) {
        	  connection = await createConnection();
            }
        return connection;    
    }
    private  camelize(str): string {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index == 0 ? letter.toUpperCase() : letter.toUpperCase();
          }).replace(/\s+/g, '');
      }
    private async getInsightsAsync(account, level, since, until): AdReportRun{
        let _account = new adsSdk.AdAccount(account);
        let params = {
          'level': level,
          'time_range':{'since':since,'until':until},
          'breakdowns':'hourly_stats_aggregated_by_audience_time_zone',
          'time_increment':1,
          'sort':'date_start_ascending'
        };
        let fields = ['date_start','account_currency','account_id','account_name', 'clicks', 'cost_per_inline_link_click', 'cost_per_inline_post_engagement','impressions', 'frequency', 'unique_clicks', 'spend', 'cpc'];
        if(level=='adset' || level=='ad' || level=='campaign'){
            fields = ['date_start','account_currency','account_id','account_name','ad_id', 'ad_name', 'adset_id', 'adset_name', 'buying_type', 'campaign_id', 'campaign_name', 'clicks', 'cost_per_inline_link_click', 'cost_per_inline_post_engagement','impressions', 'frequency', 'unique_clicks', 'spend', 'cpc'];
        }
        let async_job = null;
        try {
            async_job = await _account.getInsightsAsync(fields, params);
            let reportId = async_job.report_run_id;
            async_job.id = reportId;
            await async_job.read();
            while (async_job.async_status!='Job Completed') {
              await this.delay(3500);
              await async_job.read();
            }
            return async_job;      
        } catch (error) {
            throw new Error(JSON.stringify({'code':'FB','info':error,'call':'getInsightsAsync'}));
        }
        return async_job;
    }
    private async _getInsights(async_job):Promise<any>{
        let accountInsights = [];
        try {
            console.log(async_job.async_status);
            let insights = await async_job.getInsights();
            for(let n=0;n<insights.length;n++){
                accountInsights.push(insights[n]);
            }
            await this.delay(3500);
            while (insights.hasNext()) {
                await this.delay(3500);
                let _insights = await insights.next();
                for(let n=0;n<_insights.length;n++){
                    accountInsights.push(_insights[n]);
                }
            }
            return accountInsights;
        } catch (error) {
            throw new Error(JSON.stringify({'code':'FB','info':error,'call':'_getInsights'}));
        }
    }
    private async bulkPersist(entity, insights, connection):Promise<void>{
        try {
            await connection.createQueryBuilder().insert().into(entity).values(insights).execute();
        } catch (error) {
            throw new Error(JSON.stringify({'code':'DB','info':error,'call':'bulkPersist'}));
        }
    }
    private async bulkDelete(entity, since, connection):Promise<void>{
        try {
            await connection.createQueryBuilder().delete().from(entity).where("date_start = :_start", { _start: since }).execute();
        } catch (error) {
            throw new Error(JSON.stringify({'code':'DB','info':error,'call':'bulkDelete'}));
        }
    }
    private async persist(entity, insights, _date):Promise<any>{
        try {
            if(insights.length>0){
                let connection = await this._getDBConnection();
                await this.bulkDelete(entity, _date, connection);
                await this.bulkPersist(entity, insights, connection);
                await connection.close();
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    private async getAccountReport(account, level, since, until):Promise<any>{
        let insights=[];
        try{
            let async_job = await this.getInsightsAsync(account, level, since, until);
            insights = await this._getInsights(async_job);
            return insights;
        }catch(e){
            console.log(e.message);
            await this.delay(60000*15);
            insights = await this.getAccountReport(account, level, since, until);
            return insights;
        }
    }
    public async Report(_date):Promise<string>{
        let accounts = await this.getMyAdsAccounts();
        await this._init(config.facebook.access_token);
        for (let index = 0; index < accounts.length; index++) {
            const element = accounts[index];
            await this.saveAccountReport(element.id,_date);
            await this.saveCampaignReport(element.id,_date);
            await this.saveAdReport(element.id,_date);
        }
        return 'Job Completed';
    }
    public async testCron(_date,msg):Promise<any>{
        console.log(_date+'----'+msg);
    }
    private async saveAccountReport(accid, _date):Promise<void>{
        let insights = await this.getAccountReport(accid, 'account', _date, _date);
        await this.persist('Account', insights, _date);
        console.log('Total Insights for account '+accid+' during '+_date+': '+insights.length);
        await this.delay(5000);
    }
    private async saveCampaignReport(accid, _date):Promise<void>{
        let insights = await this.getAccountReport(accid, 'campaign', _date, _date);
        await this.persist('Campaign', insights, _date);
        console.log('Total Campaigns for account '+accid+' during '+_date+': '+insights.length);
        await this.delay(5000);
    }
    private async saveAdReport(accid, _date):Promise<void>{
        let insights = await this.getAccountReport(accid, 'ad', _date, _date);
        await this.persist('Ad', insights, _date);
        console.log('Total Ads for account '+accid+' during '+_date+': '+insights.length);
        await this.delay(5000);
    }
}