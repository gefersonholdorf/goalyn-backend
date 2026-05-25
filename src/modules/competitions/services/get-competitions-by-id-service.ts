import type { Service } from "@/types/service";
import { left, right, type Either } from "@/utils/either";
import type { CompetitionsRepository } from "../database/repositories/competitions-repository";

interface GetCompetitionByIdServiceRequest {
    id: string;
}

interface GetCompetitionByIdServiceResponse {
    name: string,
    slug: string,
    seasonId: string
    type: "LEAGUE" | "GROUP_KNOCKOUT" | "KNOCKOUT"
    status: "DRAFT" | "ACTIVE" | "FINISHED" | "SCHEDULED";
}

export class GetCompetitionByIdService
    implements Service<
        GetCompetitionByIdServiceRequest,
        GetCompetitionByIdServiceResponse
    > 
{
    
    constructor(
        private readonly competitionsRepository: CompetitionsRepository
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

            return right(competition);

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