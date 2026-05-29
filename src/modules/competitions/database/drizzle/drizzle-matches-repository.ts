import { type DBClient } from "@/db";
import { matches } from "@/db/schema/matchs";
import type { CompetitionDetails, Match, MatchesInsert, MatchesRepository } from "../repositories/matches-repository";
import { and, eq } from "drizzle-orm";

export class DrizzleMatchesRepository implements MatchesRepository {

    constructor(
        private readonly db: DBClient
    ) {}

    async createMany(data: MatchesInsert[]): Promise<void> {
        await this.db.insert(matches).values(data);
    }

    async findFinishedByCompetitionId(data: CompetitionDetails): Promise<Match[]> {
        const { seasonId, competitionId, stageId } = data
        const result = await this.db.select()
                                .from(matches)
                                .where(
                                    and(
                                        eq(matches.seasonId, seasonId),
                                        eq(matches.competitionId, competitionId),
                                        eq(matches.stageId, stageId),
                                        eq(matches.status, 'FINISHED')
                                    )
                                )

        if(result.length === 0) {
            return []
        }

        return result
    }
}