import fastify from "fastify";
import { env } from "./env";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifyScalar from "@scalar/fastify-api-reference"
import { db } from "./db";
import { matches } from "./db/schema/matchs";
import { routes } from "./routes";

export const app = fastify({
	logger: env.APP !== "production",
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Goalyn-API",
			version: "1.0.0",
			description: "API para gerenciamento de partidas de futebol virtual",
			summary: "API para gerenciamento de partidas de futebol virtual",	
		},
		servers: [
			{
				url: `http://localhost:3334`,
				description: "Development server",
			},
		],
		components: {
			securitySchemes: {
				ApiKeyAuth: {
					type: "apiKey",
					name: "Authorization",
					in: "header",
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifyScalar, {
	routePrefix: "/docs",
	logLevel: "silent",
	configuration: {
		pageTitle: "Scalar - Goalyn API",
		theme: "kepler",
	},
});


app.register(routes, { prefix: "/api/v1"})