import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Ad {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "bigint", precision: 20, nullable: true})
    account_id: number;

    @Column({ type: "bigint", precision: 20, nullable: true})
    ad_id: number;

    @Column({ type: "bigint", precision: 20, nullable: true})
    campaign_id: number;

    @Column({ type: "bigint", precision: 20, nullable: true})
    adset_id: number;

    @Column({ type: "varchar",length:255, nullable: true})
    account_name: string;

    @Column({ type: "varchar",length:255, nullable: true})
    ad_name: string; 

    @Column({ type: "varchar",length:255, nullable: true})
    adset_name: string;

    @Column({ type: "varchar",length:255, nullable: true})
    campaign_name: string;

    @Column({ type: "varchar",length:255, nullable: true})
    date_start: string;

    @Column({ type: "varchar",length:5, nullable: true})
    account_currency: string;

    @Column({ type: "varchar",length:255, nullable: true})
    buying_type: string;

	@Column({ type: "float", precision: 10, scale: 2, nullable: true})
    clicks: number;

    @Column({ type: "float", precision: 10, scale: 2, nullable: true})
    spend: number;

    @Column({ type: "float", precision: 10, scale: 2, nullable: true})
    cpc: number;
    @Column({ type: "bigint", precision: 20, nullable: true})
    impressions: number;

    @Column({ type: "float", precision: 10, scale: 2, nullable: true})
    frequency: number;

    @Column({ type: "bigint", precision: 20, nullable: true})
    unique_clicks: number;

    @Column({ type: "float", precision: 10, scale: 2, nullable: true})
    cost_per_inline_link_click: number;

    @Column({ type: "float", precision: 10, scale: 2, nullable: true})
    cost_per_inline_post_engagement: number;

    @Column({ type: "varchar",length:255, nullable: true})
    hourly_stats_aggregated_by_audience_time_zone: string;
}