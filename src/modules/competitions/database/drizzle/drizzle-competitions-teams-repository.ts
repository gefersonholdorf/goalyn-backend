import { type DBClient } from "@/db";
import { competitionTeams } from "@/db/schema/competitions";
import { eq, inArray } from "drizzle-orm";
import type { CompetitionTeamsInsertMany, CompetitionsTeamsRepository } from "../repositories/competitions-teams-repository";
import { teams } from "@/db/schema/teams";

export class DrizzleCompetitionsTeamsRepository implements CompetitionsTeamsRepository {

    constructor(
        private readonly db: DBClient
    ) {}

    async createMany(data: CompetitionTeamsInsertMany[]): Promise<void> {
        await this.db.insert(competitionTeams).values(data);
    }
    async findMany(ids: string[]): Promise<string[]> {
        if (ids.length === 0) {
            return [];
        }

        const teamsFound = await this.db
            .select()
            .from(teams)
            .where(inArray(teams.id, ids));

        return teamsFound.map((team) => team.id)
    }

    async findManyByCompetitionId(id: string): Promise<string[]> {
        const result = await this.db.select()
                                    .from(teams)
                                    .innerJoin(competitionTeams, eq(competitionTeams.teamId, teams.id))
                                    .where(eq(competitionTeams.competitionId, id));

        if (result.length === 0) {
            return []
        }

        return result.map((item) => item.teams.name)
    }
}