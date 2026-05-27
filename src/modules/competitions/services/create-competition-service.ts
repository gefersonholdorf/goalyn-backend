import type { DB } from "@/db";
import type { Service } from "@/types/service";
import { left, right, type Either } from "@/utils/either";
import { DrizzleCompetitionsRepository } from "../database/drizzle/drizzle-competitions-repository";
import { DrizzleCompetitionsRulesRepository } from "../database/drizzle/drizzle-competitions-rules-repository";
import { DrizzleCompetitionsTeamsRepository } from "../database/drizzle/drizzle-competitions-teams-repository";
import { DrizzleCompetitionsStagesRepository } from "../database/drizzle/drizzle-competitions-stages-repository";

interface CreateCompetitionServiceRequest {
    name: string,
    slug: string,
    seasonId: string
    type: "LEAGUE" | "GROUP_KNOCKOUT" | "KNOCKOUT",
	rules: {
		quantityTeams: number
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
	teamsIds: string[]
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
		private readonly db: DB,
    ) {}
    
    async execute(
		request: CreateCompetitionServiceRequest
	): Promise<Either<Error, CreateCompetitionServiceResponse>> {
		try {
			const { name, slug, seasonId, type, rules, teamsIds } = request;
			const { awayGoal, extraTime, homeAway, penalties, pointsDraw, pointsLoss, pointsWin, quantityTeams, teamsAdvance, teamsPerGroup} = rules

			const result = await this.db.transaction(async (tx) => {
				const competitionsRepository =
					new DrizzleCompetitionsRepository(tx);

				const competitionsRulesRepository =
					new DrizzleCompetitionsRulesRepository(tx);

				const competitionsTeamsRepository =
					new DrizzleCompetitionsTeamsRepository(tx)

				const competitionsStagesRepository =
					new DrizzleCompetitionsStagesRepository(tx)

				const competition = await competitionsRepository.create({
					name,
					slug,
					seasonId,
					type
				});

				await competitionsRulesRepository.create({
					competitionId: competition.competitionId,
					quantityTeams,
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

				const teamsFound = await competitionsTeamsRepository.findMany(teamsIds)

				if (teamsIds.length !== rules.quantityTeams) {
					throw new Error("Invalid quantity of teams");
				}

				if (teamsIds.length > teamsFound.length) {
					throw new Error("One or more teams do not exist");
				}

				const creatingTeams = teamsIds.map((teamId) => {
					return {
						competitionId: competition.competitionId,
						teamId: teamId
					}
				})

				await competitionsTeamsRepository.createMany(creatingTeams)

				if (type === 'LEAGUE') {
					await competitionsStagesRepository.create({
						competitionId: competition.competitionId,
						name: 'Stage 1',
						order: 1,
						type: 'LEAGUE',
					})
				}

				return {
					competitionId: competition.competitionId
				}
			})		

			return right({
				competitionId: result.competitionId
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