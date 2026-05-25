import type { Service } from "@/types/service";
import { left, right, type Either } from "@/utils/either";
import type { CompetitionsRulesRepository } from "../database/repositories/competitions-rules-repository";

interface CreateCompetitionRulesServiceRequest {
    competitionId: string
    pointsWin: number
    pointsDraw: number
    pointsLoss: number
    homeAway: boolean 
    awayGoal: boolean
    extraTime: boolean
    penalties: boolean
    teamsPerGroup: number
    teamsAdvance: number
}

interface CreateCompetitionRulesServiceResponse {
    competitionRulesId: string;
}

export class CreateCompetitionRulesService
    implements Service<
        CreateCompetitionRulesServiceRequest,
        CreateCompetitionRulesServiceResponse
    > 
{
    
    constructor(
        private readonly competitionsRulesRepository: CompetitionsRulesRepository
    ) {}
    
    async execute(
        request: CreateCompetitionRulesServiceRequest
    ): Promise<Either<Error, CreateCompetitionRulesServiceResponse>> {
        try {
            const { competitionId, awayGoal, extraTime, penalties, teamsPerGroup, teamsAdvance, homeAway, pointsDraw, pointsWin, pointsLoss } = request;

            const competition = await this.competitionsRulesRepository.create({
                competitionId,
                awayGoal,
                extraTime,
                penalties,
                teamsPerGroup,
                teamsAdvance,
                homeAway,
                pointsDraw,
                pointsWin,
                pointsLoss
            });

            return right({
                competitionRulesId: competition.competitionRulesId
            });
        } catch (error) {
            return left(
                new Error(
                    "Error creating competition rules: " +
                        (error instanceof Error
                            ? error.message
                            : String(error))
                )
            );
        }
    }
}