import { competitionRules } from '@/db/schema/competitions'

export type CompetitionRulesInsert = typeof competitionRules.$inferInsert;
export type CompetitionRules = typeof competitionRules.$inferSelect;
export type GetCompetitionRulesByIdDetails = Omit<
    CompetitionRules,
    "id" | "createdAt" | "updatedAt"
>;

export interface CompetitionsRulesRepository {
    create(data: CompetitionRulesInsert): Promise<{competitionRulesId: string}>
    findById(id: string): Promise<GetCompetitionRulesByIdDetails | null>
}