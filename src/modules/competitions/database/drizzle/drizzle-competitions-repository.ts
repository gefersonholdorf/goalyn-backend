import { type DBClient } from "@/db";
import { competitions } from "@/db/schema/competitions";
import { eq } from "drizzle-orm";
import type { Competition, CompetitionInsert, CompetitionsRepository } from "../repositories/competitions-repository";
import { seasons } from "@/db/schema/seasons";

export class DrizzleCompetitionsRepository implements CompetitionsRepository {

    constructor(
        private readonly db: DBClient
    ) {}

    async create(data: CompetitionInsert): Promise<{ competitionId: string }> {
        const result = await this.db.insert(competitions).values(data).returning({ id: competitions.id });
        return {
            competitionId: result[0].id
        }
    }
    async findById(id: string): Promise<Competition | null> {
        const competitionDetails = await this.db.select()
                                            .from(competitions)
                                            .innerJoin(seasons, eq(seasons.id, competitions.seasonId))
                                            .where(eq(competitions.id, id))
                                            .limit(1);

        if (!competitionDetails[0]) {
            return null
        }

        return {
            competition: competitionDetails[0].competitions,
            season: competitionDetails[0].seasons,
        }
    }
}