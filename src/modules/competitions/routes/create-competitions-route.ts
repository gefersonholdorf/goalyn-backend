import type { FastifyInstance } from "fastify";
import z from "zod";
import { CreateCompetitionService } from "../services/create-competition-service";
import { DrizzleCompetitionsRepository } from "../database/drizzle/drizzle-competitions-repository";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "@/db";

const createCompetitionBodySchema = z.object({
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    seasonId: z.uuid(),
    type: z.enum(["LEAGUE", "GROUP_KNOCKOUT", "KNOCKOUT"]),
})

export const createCompetitionsRoute = async (app: FastifyInstance) => {
    const competitionRepository = new DrizzleCompetitionsRepository(db);
    const createCompetitionService = new CreateCompetitionService(competitionRepository);

    app.withTypeProvider<ZodTypeProvider>().post("/competitions", {
        schema: {
            title: "Create Competition",
            description: "Endpoint para criar uma nova competição",
            tags: ["Competitions"],
            body: createCompetitionBodySchema,
            response: {
                201: z.object({
                    message: z.string(),
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
        const { name, slug, seasonId, type } = request.body;

        const result = await createCompetitionService.execute({
            name,
            slug,
            seasonId,
            type
        });

        if (result.isLeft()) {
            return reply.status(400).send({ message: result.value.message });
        }

        return reply.status(201).send({ message: "Competition successfully created." });
    });
}