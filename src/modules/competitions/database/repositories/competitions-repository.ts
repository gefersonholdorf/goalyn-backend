import { competitions } from '@/db/schema/competitions'

export type CompetitionInsert = typeof competitions.$inferInsert;
export type Competition = typeof competitions.$inferSelect;
export type GetCompetitionByIdDetails = Omit<
    Competition,
    "id" | "createdAt" | "updatedAt"
>;

export interface CompetitionsRepository {
    create(data: CompetitionInsert): Promise<void>
    findById(id: string): Promise<GetCompetitionByIdDetails | null>
}