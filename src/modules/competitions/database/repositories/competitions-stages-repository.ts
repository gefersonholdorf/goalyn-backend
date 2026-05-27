import { competitionStages } from '@/db/schema/competitions'

export type CompetitionStagesInsert = typeof competitionStages.$inferInsert;
export type CompetitionStages = typeof competitionStages.$inferSelect;
export type GetCompetitionStagesByIdDetails = Omit<
    CompetitionStages,
    "id" | "createdAt" | "updatedAt"
>;

export interface CompetitionsStagesRepository {
    create(data: CompetitionStagesInsert): Promise<{competitionStagesId: string}>
}