import type { matches } from "@/db/schema/matchs";

export type MatchesInsert = typeof matches.$inferInsert;
export type Match = typeof matches.$inferSelect;

export interface CompetitionDetails {
    competitionId: string,
    seasonId: string,
    stageId: string
}

export interface MatchesRepository {
    createMany(data: MatchesInsert[]): Promise<void>
    findFinishedByCompetitionId(data: CompetitionDetails): Promise<Match[]>
}