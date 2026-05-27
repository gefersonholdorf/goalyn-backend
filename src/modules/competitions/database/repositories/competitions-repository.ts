import { competitions } from '@/db/schema/competitions'
import type { seasons } from '@/db/schema/seasons';

export type CompetitionInsert = typeof competitions.$inferInsert;

export type Competition = {
    competition: typeof competitions.$inferSelect;
    season: typeof seasons.$inferSelect;
};
export type GetCompetitionByIdDetails = Omit<
    Competition,
    "id" | "createdAt" | "updatedAt"
>;

export interface CompetitionsRepository {
    create(data: CompetitionInsert): Promise<{competitionId: string}>
    findById(id: string): Promise<GetCompetitionByIdDetails | null>
}