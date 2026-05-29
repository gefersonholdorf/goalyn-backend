import type { FastifyInstance } from "fastify";
import { createCompetitionsRoute } from "./modules/competitions/routes/create-competitions-route";
import { generateFixturesRoute } from "./modules/competitions/routes/generate-fixtures-route";
import { getCompetitionByIdRoute } from "./modules/competitions/routes/get-competition-by-id-route";

export const routes = async(app: FastifyInstance) => {
    app.register(createCompetitionsRoute)
    app.register(getCompetitionByIdRoute)
    app.register(generateFixturesRoute)
}