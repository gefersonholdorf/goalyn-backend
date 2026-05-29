import type { Service } from "@/types/service";
import { left, right, type Either } from "@/utils/either";
import type { CompetitionsRepository } from "../database/repositories/competitions-repository";
import type { CompetitionsTeamsRepository } from "../database/repositories/competitions-teams-repository";

interface GetCompetitionByIdServiceRequest {
    id: string;
}

interface GetCompetitionByIdServiceResponse {
    seasonName: string
    name: string,
    slug: string,
    type: "LEAGUE" | "GROUP_KNOCKOUT" | "KNOCKOUT"
    status: "DRAFT" | "ACTIVE" | "FINISHED" | "SCHEDULED";
    teams: string[]
}

export class GetCompetitionByIdService
    implements Service<
        GetCompetitionByIdServiceRequest,
        GetCompetitionByIdServiceResponse
    > 
{
    
    constructor(
        private readonly competitionsRepository: CompetitionsRepository,
        private readonly competitionsTeamsRepository: CompetitionsTeamsRepository
    ) {}
    
    async execute(
        request: GetCompetitionByIdServiceRequest
    ): Promise<Either<Error, GetCompetitionByIdServiceResponse>> {
        try {
            const { id } = request;

            const competition = await this.competitionsRepository.findById(id);

            if(!competition) {
                return left(new Error("Competition not found."));
            }

            const teams = await this.competitionsTeamsRepository.findManyByCompetitionId(competition.competition.id)

            const teamsName = teams.map(item => item.name)

            return right({
                seasonName: competition.season.name,
                name: competition.competition.name,
                slug: competition.competition.slug,
                type: competition.competition.type,
                status: competition.competition.status,
                teams: teamsName
            });

        } catch (error) {
            return left(
                new Error(
                    "Error getting competition: " +
                        (error instanceof Error
                            ? error.message
                            : String(error))
                )
            );
        }
    }
}