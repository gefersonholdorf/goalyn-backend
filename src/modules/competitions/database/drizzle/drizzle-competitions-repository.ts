import { type DB } from "@/db";
import { competitions } from "@/db/schema/competitions";
import { eq } from "drizzle-orm";
import type { Competition, CompetitionInsert, CompetitionsRepository } from "../repositories/competitions-repository";

export class DrizzleCompetitionsRepository implements CompetitionsRepository {

    constructor(
        private readonly db: DB
    ) {}

    async create(data: CompetitionInsert): Promise<void> {
        await this.db.insert(competitions).values(data);
    }
    async findById(id: string): Promise<Competition | null> {
        const competition = await this.db.select().from(competitions).where(eq(competitions.id, id)).limit(1);
        return competition[0] || null;
    }
}