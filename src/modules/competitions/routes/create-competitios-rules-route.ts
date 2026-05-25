import type { FastifyInstance } from "fastify";
import z from "zod";
import { CreateCompetitionRulesService } from "../services/create-competitions-rules-service";
import { DrizzleCompetitionsRulesRepository } from "../database/drizzle/drizzle-competitions-rules-repository";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "@/db";

const createCompetitionRulesBodySchema = z.object({
    pointsWin: z.number().int().nonnegative(),
    pointsDraw: z.number().int().nonnegative(),
    pointsLoss: z.number().int().nonnegative(),
    homeAway: z.boolean(),
    awayGoal: z.boolean(),
    extraTime: z.boolean(),
    penalties: z.boolean(),
    teamsPerGroup: z.number().int().nonnegative(),
    teamsAdvance: z.number().int().nonnegative()
})

export const createCompetitionRulesRoute = async (app: FastifyInstance) => {
    const competitionRulesRepository = new DrizzleCompetitionsRulesRepository(db);
    const createCompetitionRulesService = new CreateCompetitionRulesService(competitionRulesRepository);

    app.withTypeProvider<ZodTypeProvider>().post("/competition/:competitionId/rules", {
        schema: {
            title: "Create Competition Rules",
            description: "Endpoint para criar as regras de uma nova competição",
            tags: ["Competitions"],
            params: z.object({
                competitionId: z.uuid(),
            }),
            body: createCompetitionRulesBodySchema,
            response: {
                201: z.object({
                    message: z.string(),
                    competitionRulesId: z.uuid()
                }),
                400: z.object({
                    message: z.string(),
                }),
                500: z.object({
                    message: z.string(),
                }),
            },
        }
    }, async (request, reply) => {
        const { pointsWin, pointsDraw, pointsLoss, homeAway, awayGoal, extraTime, penalties, teamsPerGroup, teamsAdvance } = request.body;
        const { competitionId } = request.params;

        const result = await createCompetitionRulesService.execute({
            competitionId,
            pointsWin,
            pointsDraw,
            pointsLoss,
            homeAway,
            awayGoal,
            extraTime,
            penalties,
            teamsPerGroup,
            teamsAdvance
        });

        if (result.isLeft()) {
            return reply.status(400).send({ message: result.value.message });
        }

        return reply.status(201).send({ 
            message: "Competition rules successfully created.",
            competitionRulesId: result.value.competitionRulesId
        });
    });
}