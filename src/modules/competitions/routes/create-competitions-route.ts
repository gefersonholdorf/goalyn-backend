import { db } from "@/db";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { CreateCompetitionService } from "../services/create-competition-service";

const rulesBodySchema = z.object({
    quantityTeams: z.number(),
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

const createCompetitionBodySchema = z.object({
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    seasonId: z.uuid(),
    type: z.enum(["LEAGUE", "GROUP_KNOCKOUT", "KNOCKOUT"]),
    rules: rulesBodySchema,
    teamsIds: z.array(z.uuid()).min(4)
})

export const createCompetitionsRoute = async (app: FastifyInstance) => {
    const createCompetitionService = new CreateCompetitionService(db);

    app.withTypeProvider<ZodTypeProvider>().post("/competitions", {
        schema: {
            title: "Create Competition",
            description: "Endpoint para criar uma nova competição",
            tags: ["Competitions"],
            body: createCompetitionBodySchema,
            response: {
                201: z.object({
                    message: z.string(),
                    competitionId: z.uuid()
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
        const { name, slug, seasonId, type, rules, teamsIds } = request.body;

        const result = await createCompetitionService.execute({
            name,
            slug,
            seasonId,
            type,
            rules,
            teamsIds
        });

        if (result.isLeft()) {
            return reply.status(400).send({ message: result.value.message });
        }

        return reply.status(201).send({ 
            message: "Competition successfully created.",
            competitionId: result.value.competitionId
        });
    });
}