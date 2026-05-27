import type { FastifyInstance } from "fastify";
import { createCompetitionsRoute } from "./modules/competitions/routes/create-competitions-route";
import { getCompetitionByIdRoute } from "./modules/competitions/routes/get-competition-by-id-route";

export const routes = async(app: FastifyInstance) => {
    app.register(createCompetitionsRoute)
    app.register(getCompetitionByIdRoute)
}