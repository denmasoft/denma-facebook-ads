"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let Adset = class Adset {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Adset.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", precision: 20, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "account_id", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", precision: 20, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "ad_id", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", precision: 20, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "campaign_id", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", precision: 20, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "adset_id", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Adset.prototype, "account_name", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Adset.prototype, "ad_name", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Adset.prototype, "adset_name", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Adset.prototype, "campaign_name", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Adset.prototype, "date_start", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 5, nullable: true }),
    __metadata("design:type", String)
], Adset.prototype, "account_currency", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Adset.prototype, "buying_type", void 0);
__decorate([
    typeorm_1.Column({ type: "float", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "clicks", void 0);
__decorate([
    typeorm_1.Column({ type: "float", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "spend", void 0);
__decorate([
    typeorm_1.Column({ type: "float", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "cpc", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", precision: 20, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "impressions", void 0);
__decorate([
    typeorm_1.Column({ type: "float", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "frequency", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint", precision: 20, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "unique_clicks", void 0);
__decorate([
    typeorm_1.Column({ type: "float", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "cost_per_inline_link_click", void 0);
__decorate([
    typeorm_1.Column({ type: "float", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Adset.prototype, "cost_per_inline_post_engagement", void 0);
Adset = __decorate([
    typeorm_1.Entity()
], Adset);
exports.Adset = Adset;
//# sourceMappingURL=Adset.js.map