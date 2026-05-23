import { db } from '@/db';
import { teams } from '@/db/schema/teams';

export async function seedTeams() {
  await db.insert(teams).values([
    {
      name: 'Distrito 47 Futebol Clube',
      formationName: '4-3-3',

      cohesion: '70',
      morale: '80',
      tacticalFamiliarity: '76',

      mentality: 'ATTACKING',
      pressing: 'HIGH',
      passingStyle: 'POSSESSION',

      defensiveLine: 78,
      defensiveWidth: 50,
      offensiveWidth: 60,
      tempo: 65,
      width: 68,

      substitutionsRemaining: 5,
    },

    {
      name: 'Esportivo Vila Romana',
      formationName: '4-2-3-1',

      cohesion: '82',
      morale: '85',
      tacticalFamiliarity: '88',

      mentality: 'BALANCED',
      pressing: 'MEDIUM',
      passingStyle: 'MIXED',

      defensiveLine: 65,
      defensiveWidth: 58,
      offensiveWidth: 72,
      tempo: 70,
      width: 74,

      substitutionsRemaining: 5,
    },

    {
      name: 'União Central',
      formationName: '3-5-2',

      cohesion: '74',
      morale: '69',
      tacticalFamiliarity: '71',

      mentality: 'DEFENSIVE',
      pressing: 'LOW',
      passingStyle: 'DIRECT',

      defensiveLine: 42,
      defensiveWidth: 66,
      offensiveWidth: 48,
      tempo: 44,
      width: 55,

      substitutionsRemaining: 5,
    },

    {
      name: 'Clube Atlético Ravena',
      formationName: '4-4-2',

      cohesion: '91',
      morale: '89',
      tacticalFamiliarity: '93',

      mentality: 'BALANCED',
      pressing: 'MEDIUM',
      passingStyle: 'MIXED',

      defensiveLine: 70,
      defensiveWidth: 60,
      offensiveWidth: 67,
      tempo: 63,
      width: 64,

      substitutionsRemaining: 5,
    },
  ]);

  console.log('✅ Times cadastrados com sucesso!');
}