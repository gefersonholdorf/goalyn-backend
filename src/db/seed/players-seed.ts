import { db } from '@/db';

import { playerAttributes, players } from '@/db/schema/players';

const FIRST_NAMES = [
  'Lucas',
  'Gabriel',
  'Pedro',
  'João',
  'Mateus',
  'Rafael',
  'Vinicius',
  'Carlos',
  'André',
  'Thiago',
];

const LAST_NAMES = [
  'Silva',
  'Souza',
  'Oliveira',
  'Santos',
  'Costa',
  'Rocha',
  'Melo',
  'Almeida',
  'Fernandes',
  'Pereira',
];

const NATIONALITIES = [
  'Brazil',
  'Argentina',
  'Portugal',
  'Spain',
  'France',
  'Germany',
  'Italy',
  'England',
  'Uruguay',
];

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'] as const;

const ROLES = {
  GK: ['Sweeper Keeper'],
  DEF: ['Ball-Playing Defender'],
  MID: ['Playmaker', 'Box-to-Box'],
  FWD: ['Target Man', 'Poacher', 'Winger'],
} as const;

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(array: readonly T[]): T {
  return array[random(0, array.length - 1)];
}

function createName() {
  return `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
}

function generateAttribute(baseMin = 1, baseMax = 20) {
  return random(baseMin, baseMax);
}

function generatePositionAttributes(position: (typeof POSITIONS)[number]) {
  switch (position) {
    case 'GK':
      return {
        pace: generateAttribute(1, 20),
        strength: generateAttribute(1, 20),
        stamina: generateAttribute(1, 20),
        agility: generateAttribute(1, 20),
        naturalFitness: generateAttribute(1, 20),

        passing: generateAttribute(1, 20),
        shooting: generateAttribute(1, 20),
        dribbling: generateAttribute(1, 20),
        tackling: generateAttribute(1, 20),
        heading: generateAttribute(1, 20),

        kicking: generateAttribute(1, 20),
        technique: generateAttribute(1, 20),
        firstTouch: generateAttribute(1, 20),
        vision: generateAttribute(1, 20),
        finishing: generateAttribute(1, 20),

        handling: generateAttribute(1, 20),
        reflexes: generateAttribute(1, 20),
        diving: generateAttribute(1, 20),
        throwing: generateAttribute(1, 20),
        commanding: generateAttribute(1, 20),

        positioning: generateAttribute(1, 20),
        decisionMaking: generateAttribute(1, 20),
        teamwork: generateAttribute(1, 20),
        composure: generateAttribute(1, 20),
        determination: generateAttribute(1, 20),

        anticipation: generateAttribute(1, 20),
        bravery: generateAttribute(1, 20),
        leadership: generateAttribute(1, 20),
        aggression: generateAttribute(1, 20),
        concentration: generateAttribute(1, 20),

        workRate: generateAttribute(1, 20),
        luck: generateAttribute(1, 20),
      };

      case 'DEF':
      return {
        pace: generateAttribute(1, 20),
        strength: generateAttribute(1, 20),
        stamina: generateAttribute(1, 20),
        agility: generateAttribute(1, 20),
        naturalFitness: generateAttribute(1, 20),

        passing: generateAttribute(1, 20),
        shooting: generateAttribute(1, 20),
        dribbling: generateAttribute(1, 20),
        tackling: generateAttribute(1, 20),
        heading: generateAttribute(1, 20),

        technique: generateAttribute(1, 20),
        firstTouch: generateAttribute(1, 20),
        vision: generateAttribute(1, 20),
        finishing: generateAttribute(1, 20),

        handling: generateAttribute(1, 20),
        reflexes: generateAttribute(1, 20),
        diving: generateAttribute(1, 20),
        kicking: generateAttribute(1, 20),
        throwing: generateAttribute(1, 20),
        commanding: generateAttribute(1, 20),

        positioning: generateAttribute(1, 20),
        decisionMaking: generateAttribute(1, 20),
        teamwork: generateAttribute(1, 20),
        composure: generateAttribute(1, 20),
        determination: generateAttribute(1, 20),

        anticipation: generateAttribute(1, 20),
        bravery: generateAttribute(1, 20),
        leadership: generateAttribute(1, 20),
        aggression: generateAttribute(1, 20),
        concentration: generateAttribute(1, 20),

        workRate: generateAttribute(1, 20),
        luck: generateAttribute(1, 20),
      };

      case 'MID':
        return {
          pace: generateAttribute(1, 20),
          strength: generateAttribute(1, 20),
          stamina: generateAttribute(1, 20),
          agility: generateAttribute(1, 20),
          naturalFitness: generateAttribute(1, 20),

          passing: generateAttribute(1, 20),
          shooting: generateAttribute(1, 20),
          dribbling: generateAttribute(1, 20),
          tackling: generateAttribute(1, 20),
          heading: generateAttribute(1, 20),

          technique: generateAttribute(1, 20),
          firstTouch: generateAttribute(1, 20),
          vision: generateAttribute(1, 20),
          finishing: generateAttribute(1, 20),

          handling: generateAttribute(1, 20),
          reflexes: generateAttribute(1, 20),
          diving: generateAttribute(1, 20),
          kicking: generateAttribute(1, 20),
          throwing: generateAttribute(1, 20),
          commanding: generateAttribute(1, 20),

          positioning: generateAttribute(1, 20),
          decisionMaking: generateAttribute(1, 20),
          teamwork: generateAttribute(1, 20),
          composure: generateAttribute(1, 20),
          determination: generateAttribute(1, 20),

          anticipation: generateAttribute(1, 20),
          bravery: generateAttribute(1, 20),
          leadership: generateAttribute(1, 20),
          aggression: generateAttribute(1, 20),
          concentration: generateAttribute(1, 20),

          workRate: generateAttribute(1, 20),
          luck: generateAttribute(1, 20),
        };

    case 'FWD':
      return {
        pace: generateAttribute(1, 20),
        strength: generateAttribute(1, 20),
        stamina: generateAttribute(1, 20),
        agility: generateAttribute(1, 20),
        naturalFitness: generateAttribute(1, 20),

        passing: generateAttribute(1, 20),
        shooting: generateAttribute(1, 20),
        dribbling: generateAttribute(1, 20),
        tackling: generateAttribute(1, 20),
        heading: generateAttribute(1, 20),

        technique: generateAttribute(1, 20),
        firstTouch: generateAttribute(1, 20),
        vision: generateAttribute(1, 20),
        finishing: generateAttribute(1, 20),

        handling: generateAttribute(1, 20),
        reflexes: generateAttribute(1, 20),
        diving: generateAttribute(1, 20),
        kicking: generateAttribute(1, 20),
        throwing: generateAttribute(1, 20),
        commanding: generateAttribute(1, 20),

        positioning: generateAttribute(1, 20),
        decisionMaking: generateAttribute(1, 20),
        teamwork: generateAttribute(1, 20),
        composure: generateAttribute(1, 20),
        determination: generateAttribute(1, 20),

        anticipation: generateAttribute(1, 20),
        bravery: generateAttribute(1, 20),
        leadership: generateAttribute(1, 20),
        aggression: generateAttribute(1, 20),
        concentration: generateAttribute(1, 20),

        workRate: generateAttribute(1, 20),
        luck: generateAttribute(1, 20),
      };
  }
}
export async function seedPlayers(quantity = 100) {
  for (let i = 0; i < quantity; i++) {
    const position = randomItem([...POSITIONS]);

    const role = randomItem(ROLES[position]);

    const [player] = await db
      .insert(players)
      .values({
        name: createName(),
        age: random(17, 38),
        nationality: randomItem(NATIONALITIES),

        position,
        role,

        morale: String(random(40, 100)),
        form: String(random(40, 100)),

        energy: '100',
        currentStamina: '100',
        condition: '100',
      })
      .returning();

    const attributes = generatePositionAttributes(position);

    await db.insert(playerAttributes).values({
      playerId: player.id,
      ...attributes,
    });
  }

  console.log(`✅ ${quantity} players created`);
}