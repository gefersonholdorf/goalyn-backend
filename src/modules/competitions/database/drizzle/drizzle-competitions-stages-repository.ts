import { type DBClient } from "@/db";
import { competitionStages } from "@/db/schema/competitions";
import type { CompetitionStagesInsert, CompetitionsStagesRepository, GetCompetitionStagesByIdDetails } from "../repositories/competitions-stages-repository";
import { eq } from "drizzle-orm";

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

    async findByCompetitionId(competitionId: string): Promise<GetCompetitionStagesByIdDetails[]> {
        const result = await this.db.select().from(competitionStages).where(eq(competitionStages.competitionId, competitionId))

        return result
    }
}