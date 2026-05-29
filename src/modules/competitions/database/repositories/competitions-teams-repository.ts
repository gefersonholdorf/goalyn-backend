import { competitionTeams } from '@/db/schema/competitions'

export type CompetitionTeamsInsertMany = typeof competitionTeams.$inferInsert;
export type CompetitionTeams = typeof competitionTeams.$inferSelect;
export type GetCompetitionTeamsManyDetails = Omit<
    CompetitionTeams,
    "id"
>;

export interface CompetitionsTeamsRepository {
    createMany(data: CompetitionTeamsInsertMany[]): Promise<void>
    findMany(ids: string[]): Promise<string[]>
    findManyByCompetitionId(id: string): Promise<{
        id: string
        name: string
    }[]>
}