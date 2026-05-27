import { type DBClient } from "@/db";
import { competitionStages } from "@/db/schema/competitions";
import type { CompetitionStagesInsert, CompetitionsStagesRepository } from "../repositories/competitions-stages-repository";

export class DrizzleCompetitionsStagesRepository implements CompetitionsStagesRepository {

    constructor(
        private readonly db: DBClient
    ) {}

    async create(data: CompetitionStagesInsert): Promise<{ competitionStagesId: string }> {
        const result = await this.db.insert(competitionStages).values(data).returning({ id: competitionStages.id });
        return {
            competitionStagesId: result[0].id
        }
    }
}