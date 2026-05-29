import type { DB } from "@/db"
import type { Service } from "@/types/service"
import { left, right, type Either } from "@/utils/either"
import { DrizzleCompetitionsRepository } from "../database/drizzle/drizzle-competitions-repository"
import { DrizzleCompetitionsStagesRepository } from "../database/drizzle/drizzle-competitions-stages-repository"
import { DrizzleCompetitionsTeamsRepository } from "../database/drizzle/drizzle-competitions-teams-repository"
import { DrizzleMatchesRepository } from "../database/drizzle/drizzle-matches-repository"
import type { TableRow } from "@/types/table-row"
import { getOrCreate } from "@/utils/get-or-create"
import { standings } from "@/db/schema/stadings"
import { and, eq } from "drizzle-orm"

interface RecalculateStandingsServiceRequest {
    seasonId: string,
    competitionId: string,
    stageId: string
}

interface RecalculateStandingsServiceResponse {}

export class RecalculateStandingsService implements Service<RecalculateStandingsServiceRequest, RecalculateStandingsServiceResponse> {

    constructor(
        private readonly db: DB,
    ) {}

    async execute(serviceRequest: RecalculateStandingsServiceRequest): Promise<Either<Error, RecalculateStandingsServiceResponse>> {
        const { competitionId, seasonId, stageId  } = serviceRequest

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

                const matchesFinished = await matchesRepository.findFinishedByCompetitionId({
                    competitionId,
                    seasonId,
                    stageId
                })

                const standingsMap = new Map<string, TableRow>()

                for (const match of matchesFinished) {
                    const home = getOrCreate(match.homeTeamId, standingsMap)
                    const away = getOrCreate(match.awayTeamId, standingsMap)

                    const homeGoals = match.homeScore
                    const awayGoals = match.awayScore

                    home.played++
                    away.played++

                    home.goalsFor += homeGoals!
                    home.goalsAgainst += awayGoals!

                    away.goalsFor += awayGoals!
                    away.goalsAgainst += homeGoals!

                    if (homeGoals! > awayGoals!) {
                        home.wins++
                        away.losses++

                        home.points += 3

                        home.form.push("W")
                        away.form.push("L")
                    }

                    else if (homeGoals! < awayGoals!) {
                        away.wins++
                        home.losses++

                        away.points += 3

                        away.form.push("W")
                        home.form.push("L")
                    }

                    else {
                        home.draws++
                        away.draws++

                        home.points += 1
                        away.points += 1

                        home.form.push("D")
                        away.form.push("D")
                    }

                    home.goalDifference =
                        home.goalsFor - home.goalsAgainst

                    away.goalDifference =
                        away.goalsFor - away.goalsAgainst
                }

                const ordered = [...standingsMap.values()].sort((a, b) => {
                if (b.points !== a.points)
                    return b.points - a.points

                if (b.goalDifference !== a.goalDifference)
                    return b.goalDifference - a.goalDifference

                return b.goalsFor - a.goalsFor
                })

                const standingsToSave = ordered.map((team, index) => ({
                seasonId,
                competitionId,
                stageId,
                groupId: null,

                teamId: team.teamId,

                position: index + 1,

                played: team.played,
                wins: team.wins,
                draws: team.draws,
                losses: team.losses,

                goalsFor: team.goalsFor,
                goalsAgainst: team.goalsAgainst,

                goalDifference: team.goalDifference,

                points: team.points,

                form: team.form.slice(-5).join(""),
                }))

                await tx
                    .delete(standings)
                    .where(
                        and(
                            eq(standings.competitionId, competitionId),
                            eq(standings.stageId, stageId),
                        )
                    )

                await tx.insert(standings).values(standingsToSave)
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