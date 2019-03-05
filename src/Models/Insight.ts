export class Insight{
    private impressions:number = 0;
    private frequency: number = 0;
    private unique_clicks: number = 0;
    private spend: number = 0;
    private cpc: number = 0;
    get Impressions():number {
        return this.impressions;
    }
    set Impressions(impressions:number) {
        this.impressions = impressions;
    }
    get Frequency():number {
        return this.frequency;
    }
    set Frequency(frequency:number) {
        this.frequency = frequency;
    }
    get Spend():number {
        return this.spend;
    }
    set Spend(spend:number) {
        this.spend = spend;
    }
    get Cpc():number {
        return this.cpc;
    }
    set Cpc(cpc:number) {
        this.cpc = cpc;
    }
}
