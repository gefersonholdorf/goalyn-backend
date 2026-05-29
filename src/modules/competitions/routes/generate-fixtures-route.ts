import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { GenerateFixturesService } from "../services/generate-fixtures-service";
import { db } from "@/db";

export const generateFixturesRoute = async (app: FastifyInstance) => {
    const generateFixtureService = new GenerateFixturesService(db)

    app.withTypeProvider<ZodTypeProvider>().get("/competitions/:id/generate-fixtures", {
        schema: {
            title: "Generate Fixures By Competition Id",
            description: "Endpoint para gerar as partidas da competição.",
            tags: ["Competitions"],
            params: z.object({
                id: z.uuid(),
            }),
            response: {
                200: z.object({
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
        const { id } = request.params;

        const result = await generateFixtureService.execute({competitionId: id})

        if (result.isLeft()) {
            return reply.status(400).send({ message: result.value.message });
        }

        return reply.status(200).send({
            message: "Matches successfully generated."
        });
    });
}