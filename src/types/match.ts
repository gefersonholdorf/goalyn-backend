export interface MatchEngineResponse {
  status: 'FULL_TIME',
  minute: number,
  second: number,
  teamOne: string,
  teamTwo: string,
  homeGoals: number,
  awayGoals: number,
  stats: {
    possession: { home: number, away: number },
    shots: { home: number, away: number },
    shotsOnTarget: { home: number, away: number },
    corners: { home: number, away: number },
    fouls: { home: number, away: number },
    yellowCards: { home: number, away: number },
    redCards: { home: number, away: number },
    passes: { home: number, away: number },
    passAccuracy: { home: number, away: number },
    tackles: { home: number, away: number },
    injuries: { home: number, away: number }
  }
}