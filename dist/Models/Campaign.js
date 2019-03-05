"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Campaign {
    constructor() {
        this.account_id = 0;
        this.campaign_id = 0;
        this.campaign_name = '';
    }
    get AccountId() {
        return this.account_id;
    }
    set accountId(account_id) {
        this.account_id = account_id;
    }
    get Id() {
        return this.campaign_id;
    }
    set Id(campaign_id) {
        this.campaign_id = campaign_id;
    }
    get Name() {
        return this.campaign_name;
    }
    set Name(campaign_name) {
        this.campaign_name = campaign_name;
    }
    get Insights() {
        return this.insights;
    }
    set Insights(insights) {
        this.insights = insights;
    }
}
exports.Campaign = Campaign;
//# sourceMappingURL=Campaign.js.map