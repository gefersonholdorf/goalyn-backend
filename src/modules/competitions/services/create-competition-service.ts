import type { Service } from "@/types/service";
import { left, right, type Either } from "@/utils/either";
import type { CompetitionsRepository } from "../database/repositories/competitions-repository";

interface CreateCompetitionServiceRequest {
    name: string,
    slug: string,
    seasonId: string
    type: "LEAGUE" | "GROUP_KNOCKOUT" | "KNOCKOUT"
}

interface CreateCompetitionServiceResponse {
	competitionId: string;
}

export class CreateCompetitionService
	implements Service<
		CreateCompetitionServiceRequest,
		CreateCompetitionServiceResponse
	> 
{
	
    constructor(
        private readonly competitionsRepository: CompetitionsRepository
    ) {}
    
    async execute(
		request: CreateCompetitionServiceRequest
	): Promise<Either<Error, CreateCompetitionServiceResponse>> {
		try {
			const { name, slug, seasonId, type } = request;

			const competition = await this.competitionsRepository.create({
				name,
				slug,
				seasonId,
				type
			});

			return right({
				competitionId: competition.competitionId
			});
		} catch (error) {
			return left(
				new Error(
					"Error creating competition: " +
						(error instanceof Error
							? error.message
							: String(error))
				)
			);
		}
	}
}