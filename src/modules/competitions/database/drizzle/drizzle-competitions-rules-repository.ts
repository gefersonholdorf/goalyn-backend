import { type DB } from "@/db";
import { competitionRules } from "@/db/schema/competitions";
import { eq } from "drizzle-orm";
import type { CompetitionRules, CompetitionRulesInsert, CompetitionsRulesRepository } from "../repositories/competitions-rules-repository";

export class DrizzleCompetitionsRulesRepository implements CompetitionsRulesRepository {

    constructor(
        private readonly db: DB
    ) {}

    async create(data: CompetitionRulesInsert): Promise<{ competitionRulesId: string }> {
        const result = await this.db.insert(competitionRules).values(data).returning({ id: competitionRules.id });
        return {
            competitionRulesId: result[0].id
        }
    }
    async findById(id: string): Promise<CompetitionRules | null> {
        const competition = await this.db.select().from(competitionRules).where(eq(competitionRules.id, id)).limit(1);
        return competition[0] || null;
    }
}