import type { FastifyInstance } from "fastify";
import z from "zod";
import { CreateCompetitionService } from "../services/create-competition-service";
import { DrizzleCompetitionsRepository } from "../database/drizzle/drizzle-competitions-repository";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "@/db";
import { GetCompetitionByIdService } from "../services/get-competitions-by-id-service";
import { DrizzleCompetitionsTeamsRepository } from "../database/drizzle/drizzle-competitions-teams-repository";

const getCompetitionByIdResponseSchema = z.object({
    seasonName: z.string(),
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    type: z.enum(["LEAGUE", "GROUP_KNOCKOUT", "KNOCKOUT"]),
    status: z.enum(["DRAFT", "ACTIVE", "FINISHED", "SCHEDULED"]),
    teams: z.array(z.string())
})

export const getCompetitionByIdRoute = async (app: FastifyInstance) => {
    const competitionRepository = new DrizzleCompetitionsRepository(db);
    const competitionTeamsRepository = new DrizzleCompetitionsTeamsRepository(db);
    const getCompetitionByIdService = new GetCompetitionByIdService(competitionRepository, competitionTeamsRepository);

    app.withTypeProvider<ZodTypeProvider>().get("/competitions/:id", {
        schema: {
            title: "Get Competition By Id",
            description: "Endpoint para obter uma competição por ID",
            tags: ["Competitions"],
            params: z.object({
                id: z.uuid(),
            }),
            response: {
                200: getCompetitionByIdResponseSchema,
                404: z.object({
                    message: z.string(),
                }),
                500: z.object({
                    message: z.string(),
                }),
            },
        }
    }, async (request, reply) => {
        const { id } = request.params;

        const result = await getCompetitionByIdService.execute({
            id
        });

        if (result.isLeft()) {
            return reply.status(404).send({ message: result.value.message });
        }

        return reply.status(200).send(result.value);
    });
}