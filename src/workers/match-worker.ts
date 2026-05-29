import { Job, Worker } from "bullmq";
import { redisConnection } from "../queues/connection";
import { db } from "@/db";
import { matches } from "@/db/schema/matchs";
import { eq } from "drizzle-orm";
import { teamPlayers, teams } from "@/db/schema/teams";
import { players } from "@/db/schema/players";
import { playerAttributes } from "@/db/schema/players";
import type { MatchEngineResponse } from "@/types/match";
import { date } from "zod";
import { RecalculateStandingsService } from "@/modules/competitions/services/recalculate-standings-service";

interface MatchJobData {
  matchId: string;
}

// Função para mapear o mentality do time
function mapMentality(mentality: string | null): string {
  const mentalityMap: Record<string, string> = {
    'ULTRA_DEFENSIVE': 'VERY_DEFENSIVE',
    'DEFENSIVE': 'DEFENSIVE',
    'BALANCED': 'BALANCED',
    'ATTACKING': 'OFFENSIVE',
    'ULTRA_ATTACKING': 'VERY_OFFENSIVE'
  };
  return mentalityMap[mentality || 'BALANCED'] || 'BALANCED';
}

// Função para mapear pressing intensity
function mapPressing(pressing: string | null): string {
  const pressingMap: Record<string, string> = {
    'LOW': 'LOW',
    'MEDIUM': 'MEDIUM',
    'HIGH': 'HIGH'
  };
  return pressingMap[pressing || 'MEDIUM'] || 'MEDIUM';
}

// Função para mapear passing style
function mapPassingStyle(passingStyle: string | null): string {
  const styleMap: Record<string, string> = {
    'DIRECT': 'DIRECT',
    'MIXED': 'MIXED',
    'POSSESSION': 'SHORT'
  };
  return styleMap[passingStyle || 'MIXED'] || 'MIXED';
}

// Função para formatar o jogador no formato esperado
function formatPlayer(playerData: any, attributes: any) {
  return {
    name: playerData.name,
    position: playerData.position,
    age: playerData.age,
    nationality: playerData.nationality || 'Brazil',
    role: playerData.role || 'Default',
    attributes: {
      pace: attributes.pace,
      strength: attributes.strength,
      stamina: attributes.stamina,
      agility: attributes.agility,
      naturalFitness: attributes.naturalFitness,
      passing: attributes.passing,
      shooting: attributes.shooting,
      dribbling: attributes.dribbling,
      tackling: attributes.tackling,
      heading: attributes.heading,
      technique: attributes.technique,
      firstTouch: attributes.firstTouch,
      vision: attributes.vision,
      finishing: attributes.finishing,
      handling: attributes.handling,
      reflexes: attributes.reflexes,
      diving: attributes.diving,
      kicking: attributes.kicking,
      throwing: attributes.throwing,
      commanding: attributes.commanding,
      positioning: attributes.positioning,
      decisionMaking: attributes.decisionMaking,
      teamwork: attributes.teamwork,
      composure: attributes.composure,
      determination: attributes.determination,
      anticipation: attributes.anticipation,
      bravery: attributes.bravery,
      leadership: attributes.leadership,
      aggression: attributes.aggression,
      concentration: attributes.concentration,
      workRate: attributes.workRate,
      luck: attributes.luck
    }
  };
}

export const matchWorker = new Worker(
  "match-simulation",
  async (job: Job<MatchJobData>) => {
    console.log(`Executando partida ${job.data.matchId}`);

    // Busca informações da partida
    const matchInfo = await db
      .select()
      .from(matches)
      .where(eq(matches.id, job.data.matchId))
      .limit(1);

    if (!matchInfo.length) {
      throw new Error(`Partida ${job.data.matchId} não encontrada`);
    }

    const match = matchInfo[0];

    // Busca time da casa
    const homeTeamInfo = await db
      .select()
      .from(teams)
      .where(eq(teams.id, match.homeTeamId))
      .limit(1);

    // Busca time visitante
    const awayTeamInfo = await db
      .select()
      .from(teams)
      .where(eq(teams.id, match.awayTeamId))
      .limit(1);

    if (!homeTeamInfo.length || !awayTeamInfo.length) {
      throw new Error(`Times não encontrados para a partida ${job.data.matchId}`);
    }

    const homeTeam = homeTeamInfo[0];
    const awayTeam = awayTeamInfo[0];

    // Busca jogadores do time da casa com seus atributos
    const homeTeamPlayersData = await db
      .select()
      .from(teamPlayers)
      .innerJoin(players, eq(teamPlayers.playerId, players.id))
      .innerJoin(playerAttributes, eq(players.id, playerAttributes.playerId))
      .where(eq(teamPlayers.teamId, homeTeam.id));

    // Busca jogadores do time visitante com seus atributos
    const awayTeamPlayersData = await db
      .select()
      .from(teamPlayers)
      .innerJoin(players, eq(teamPlayers.playerId, players.id))
      .innerJoin(playerAttributes, eq(players.id, playerAttributes.playerId))
      .where(eq(teamPlayers.teamId, awayTeam.id));

    console.log(`Partida: ${homeTeam.name} vs ${awayTeam.name}`);
    console.log(`Jogadores do ${homeTeam.name}: ${homeTeamPlayersData.length}`);
    console.log(`Jogadores do ${awayTeam.name}: ${awayTeamPlayersData.length}`);

    // Formata os jogadores para o body da requisição
    const homeTeamPlayers = homeTeamPlayersData.map(row => 
      formatPlayer(row.players, row.player_attributes)
    );

    const awayTeamPlayers = awayTeamPlayersData.map(row => 
      formatPlayer(row.players, row.player_attributes)
    );

    // Prepara o body da requisição
    const requestBody = {
      matchInitDetails: {
        stadiumName: "Estádio do Distrito Industrial",
        weather: "Snow",
        matchImportance: 78,
        stadiumCapacity: 18000,
        timeOfDay: "Evening",
        neutralVenue: false,
        refereeStrictness: 62
      },
      homeTeam: {
        name: homeTeam.name,
        formation: homeTeam.formationName || "4-4-2",
        players: homeTeamPlayers,
        instructions: {
          mentality: mapMentality(homeTeam.mentality),
          pressing: mapPressing(homeTeam.pressing),
          passingStyle: mapPassingStyle(homeTeam.passingStyle),
          width: homeTeam.width || 50,
          tempo: homeTeam.tempo || 50,
          offensiveWidth: homeTeam.offensiveWidth || 50,
          defensiveWidth: homeTeam.defensiveWidth || 50,
          defensiveLine: homeTeam.defensiveLine || 50
        },
        morale: Number(homeTeam.morale),
        cohesion: Number(homeTeam.cohesion),
        tacticalFamiliarity: Number(homeTeam.tacticalFamiliarity)
      },
      awayTeam: {
        name: awayTeam.name,
        formation: awayTeam.formationName || "4-4-2",
        players: awayTeamPlayers,
        instructions: {
          mentality: mapMentality(awayTeam.mentality),
          pressing: mapPressing(awayTeam.pressing),
          passingStyle: mapPassingStyle(awayTeam.passingStyle),
          width: awayTeam.width || 50,
          tempo: awayTeam.tempo || 50,
          offensiveWidth: awayTeam.offensiveWidth || 50,
          defensiveWidth: awayTeam.defensiveWidth || 50,
          defensiveLine: awayTeam.defensiveLine || 50
        },
        morale: Number(awayTeam.morale),
        cohesion: Number(awayTeam.cohesion),
        tacticalFamiliarity: Number(awayTeam.tacticalFamiliarity)
      }
    };

    console.log("Enviando requisição para simular partida...");
    
    // Faz a requisição para a API de simulação
    const simulationResponse = await fetch('http://localhost:3334/api/v1/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!simulationResponse.ok) {
      throw new Error(`Erro na simulação: ${simulationResponse.statusText}`);
    }

    const simulationResult: MatchEngineResponse = await simulationResponse.json() as MatchEngineResponse;
    console.log("Resultado da simulação:", simulationResult);
    console.log(simulationResult.teamOne, ' ', simulationResult.homeGoals, 'X', simulationResult.awayGoals, ' ', simulationResult.teamTwo)

    await db.update(matches).set({
      homeScore: simulationResult.homeGoals,
      awayScore: simulationResult.awayGoals,
      status: 'FINISHED',
    }).where(eq(matches.id, job.data.matchId))

    const standingsService =
      new RecalculateStandingsService(db)

    await standingsService.execute({
      competitionId: match.competitionId,
      seasonId: match.seasonId,
      stageId: match.stageId
    })

  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

matchWorker.on("completed", job => {
  console.log(`Job ${job.id} concluído`);
});

matchWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} falhou`, err);
});