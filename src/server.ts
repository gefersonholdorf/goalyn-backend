import { env } from "./env";
import { app } from "./index";

const port = env.PORT;

app.listen({ port }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	if (env.APP !== "production") {
		app.log.info(`Goalyn API is running at port ${port}`);
	}
});