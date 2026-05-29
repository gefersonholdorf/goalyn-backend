type Match = {
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  leg: number;
};

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export function generateLeagueFixtures(
  teamIds: string[],
  homeAway = true
): Match[] {

  const teams = shuffle([...teamIds]);

  if (teams.length % 2 !== 0) {
    teams.push("BYE");
  }

  const rounds = teams.length - 1;
  const matchesPerRound = teams.length / 2;

  const fixtures: Match[] = [];
  const rotating = [...teams];

  for (let round = 0; round < rounds; round++) {

    const roundMatches: Match[] = [];

    for (let match = 0; match < matchesPerRound; match++) {

      const home = rotating[match];
      const away = rotating[rotating.length - 1 - match];

      if (home === "BYE" || away === "BYE") {
        continue;
      }

      const shouldInvert = round % 2 === 0;

      roundMatches.push({
        round: round + 1,
        homeTeamId: shouldInvert ? away : home,
        awayTeamId: shouldInvert ? home : away,
        leg: 1
      });
    }

    fixtures.push(...shuffle(roundMatches));

    const fixed = rotating[0];

    const rest = rotating.slice(1);

    rest.unshift(rest.pop()!);

    rotating.splice(0, rotating.length, fixed, ...rest);
  }

  if (!homeAway) {
    return fixtures;
  }

  const returnFixtures = fixtures.map((fixture) => ({
    round: fixture.round + rounds,
    homeTeamId: fixture.awayTeamId,
    awayTeamId: fixture.homeTeamId,
    leg: 2
  }));

  return [...fixtures, ...returnFixtures];
}