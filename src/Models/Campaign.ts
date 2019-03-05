import {Insight} from './Insight';
export class Campaign{
    private account_id:number = 0;
    private campaign_id:number = 0;
    private campaign_name: string = '';
    private insights: Insight[];
    get AccountId():number {
        return this.account_id;
    }
    set accountId(account_id:number) {
        this.account_id = account_id;
    }
    get Id():number {
        return this.campaign_id;
    }
    set Id(campaign_id:number) {
        this.campaign_id = campaign_id;
    }
    get Name():string {
        return this.campaign_name;
    }
    set Name(campaign_name:string) {
        this.campaign_name = campaign_name;
    }
    get Insights():Insight[] {
        return this.insights;
    }
    set Insights(insights:Insight[]) {
        this.insights = insights;
    }
}