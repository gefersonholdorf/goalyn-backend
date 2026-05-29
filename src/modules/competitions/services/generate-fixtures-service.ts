import type { DB } from "@/db"
import type { Service } from "@/types/service"
import { left, right, type Either } from "@/utils/either"
import { generateLeagueFixtures } from "@/utils/generate-legue-fixtures"
import { DrizzleCompetitionsRepository } from "../database/drizzle/drizzle-competitions-repository"
import { DrizzleCompetitionsTeamsRepository } from "../database/drizzle/drizzle-competitions-teams-repository"
import { DrizzleCompetitionsStagesRepository } from "../database/drizzle/drizzle-competitions-stages-repository"
import { DrizzleMatchesRepository } from "../database/drizzle/drizzle-matches-repository"

interface GenerateFixturesServiceRequest {
    competitionId: string
}

interface GenerateFixturesServiceResponse {}

export class GenerateFixturesService implements Service<GenerateFixturesServiceRequest, GenerateFixturesServiceResponse> {

    constructor(
        private readonly db: DB,
    ) {}

    async execute(serviceRequest: GenerateFixturesServiceRequest): Promise<Either<Error, GenerateFixturesServiceResponse>> {
        const { competitionId } = serviceRequest

        try {
            
            const result = await this.db.transaction(async (tx) => {
                const competitionsRepository =
                    new DrizzleCompetitionsRepository(tx)

                const competitionTeamsRepository =
                    new DrizzleCompetitionsTeamsRepository(tx)
                
                const competitionStagesRepository =
                    new DrizzleCompetitionsStagesRepository(tx)
                
                const matchesRepository =
                    new DrizzleMatchesRepository(tx)

                const competition = await competitionsRepository.findById(competitionId)

                if(!competition) {
                    throw new Error('Competition not found.')
                }

                const teams = await competitionTeamsRepository.findManyByCompetitionId(competitionId)
                const teamsId = teams.map(item => item.id)

                const stages = await competitionStagesRepository.findByCompetitionId(competitionId)

                const fixtures = generateLeagueFixtures(teamsId)

                const matchesToInsert = fixtures.map((fix) => {
                    return {
                        competitionId,
                        seasonId: competition.season.id,
                        stageId: stages[0].id,
                        homeTeamId: fix.homeTeamId,
                        awayTeamId: fix.awayTeamId,
                        status: "PENDING" as const,
                        round: fix.round,
                        leg: fix.leg,
                    }
                })

                await matchesRepository.createMany(matchesToInsert)
            })

            return right({})

        } catch (error) {
            console.error(error)
            return left(
                new Error(
                    "Error creating competition: " +
                        (error instanceof Error
                            ? error.message
                            : String(error)
                        )
                )
            );
        }
    }
}