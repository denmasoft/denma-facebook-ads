"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Insight {
    constructor() {
        this.impressions = 0;
        this.frequency = 0;
        this.unique_clicks = 0;
        this.spend = 0;
        this.cpc = 0;
    }
    get Impressions() {
        return this.impressions;
    }
    set Impressions(impressions) {
        this.impressions = impressions;
    }
    get Frequency() {
        return this.frequency;
    }
    set Frequency(frequency) {
        this.frequency = frequency;
    }
    get Spend() {
        return this.spend;
    }
    set Spend(spend) {
        this.spend = spend;
    }
    get Cpc() {
        return this.cpc;
    }
    set Cpc(cpc) {
        this.cpc = cpc;
    }
}
exports.Insight = Insight;
//# sourceMappingURL=Insight.js.map