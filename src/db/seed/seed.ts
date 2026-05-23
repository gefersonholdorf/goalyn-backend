// seed.ts
import { db } from '..';
import {
  players,
  playerAttributes,
} from '@/db/schema/players';
import {
  teamPlayers,
  teams,
} from '@/db/schema/teams';
import { sql } from 'drizzle-orm';

// Lista de times
const teamNames = [
  'Distrito 47 Futebol Clube',
  'Esportivo Vila Romana',
  'União Central',
  'Clube Atlético Ravena'
];

// Posições possíveis
const positions = ['GK', 'DEF', 'MID', 'FWD'] as const;

// Roles possíveis
const roles = [
  'Default',
  'Playmaker',
  'Target Man',
  'Sweeper Keeper',
  'Ball-Playing Defender',
  'Box-to-Box',
  'Poacher',
  'Winger'
] as const;

// Nacionalidades brasileiras comuns
const nationalities = [
  'Brasil', 'Argentina', 'Uruguai', 'Colômbia', 'Chile',
  'Paraguai', 'Equador', 'Peru', 'Venezuela', 'Bolívia'
];

// Nomes brasileiros
const firstNames = [
  'João', 'Maria', 'José', 'Ana', 'Carlos', 'Paula', 'Lucas', 'Mariana',
  'Pedro', 'Fernanda', 'Rafael', 'Juliana', 'Felipe', 'Camila', 'Gustavo',
  'Amanda', 'Bruno', 'Patrícia', 'Rodrigo', 'Vanessa', 'Thiago', 'Larissa',
  'André', 'Gabriela', 'Fernando', 'Tatiana', 'Ricardo', 'Sabrina', 'Eduardo'
];

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira',
  'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins',
  'Carvalho', 'Almeida', 'Nascimento', 'Araújo', 'Barbosa', 'Mendes'
];

// Função para gerar número aleatório entre min e max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para gerar número decimal aleatório
function randomDecimal(min: number, max: number, decimals: number = 2): string {
  const value = Math.random() * (max - min) + min;
  return value.toFixed(decimals);
}

// Função para gerar nome completo
function generateName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

// Função para gerar idade (18-40)
function generateAge(): number {
  return randomInt(18, 40);
}

// Função para gerar atributos (1-20)
function generateAttributes(): Record<string, number> {
  const attrs = {
    pace: randomInt(1, 20),
    strength: randomInt(1, 20),
    stamina: randomInt(1, 20),
    agility: randomInt(1, 20),
    naturalFitness: randomInt(1, 20),
    passing: randomInt(1, 20),
    shooting: randomInt(1, 20),
    dribbling: randomInt(1, 20),
    tackling: randomInt(1, 20),
    heading: randomInt(1, 20),
    technique: randomInt(1, 20),
    firstTouch: randomInt(1, 20),
    vision: randomInt(1, 20),
    finishing: randomInt(1, 20),
    handling: randomInt(1, 20),
    reflexes: randomInt(1, 20),
    diving: randomInt(1, 20),
    kicking: randomInt(1, 20),
    throwing: randomInt(1, 20),
    commanding: randomInt(1, 20),
    positioning: randomInt(1, 20),
    decisionMaking: randomInt(1, 20),
    teamwork: randomInt(1, 20),
    composure: randomInt(1, 20),
    determination: randomInt(1, 20),
    anticipation: randomInt(1, 20),
    bravery: randomInt(1, 20),
    leadership: randomInt(1, 20),
    aggression: randomInt(1, 20),
    concentration: randomInt(1, 20),
    workRate: randomInt(1, 20),
    luck: randomInt(1, 20),
  };
  return attrs;
}

// Função para ajustar atributos baseado na qualidade do time
function adjustAttributesForTeam(attrs: Record<string, number>, teamIndex: number): Record<string, number> {
  // Distrito 47 é o melhor time (teamIndex 0)
  // Os outros times são iguais entre si
  
  if (teamIndex === 0) {
    // Melhor time: atributos entre 12-20
    for (const key in attrs) {
      attrs[key] = Math.max(12, Math.min(20, attrs[key] + randomInt(3, 8)));
    }
  } else {
    // Times médios: atributos entre 8-16
    for (const key in attrs) {
      attrs[key] = Math.max(8, Math.min(16, attrs[key]));
    }
  }
  
  return attrs;
}

// Função para gerar jogador baseado na posição
function generatePlayerForPosition(position: typeof positions[number], teamIndex: number): any {
  const attributes = generateAttributes();
  
  // Ajusta atributos baseados na posição
  switch (position) {
    case 'GK':
      attributes.handling = randomInt(15, 20);
      attributes.reflexes = randomInt(15, 20);
      attributes.diving = randomInt(14, 20);
      attributes.kicking = randomInt(12, 18);
      attributes.throwing = randomInt(12, 18);
      attributes.commanding = randomInt(13, 19);
      break;
    case 'DEF':
      attributes.tackling = randomInt(14, 20);
      attributes.heading = randomInt(13, 19);
      attributes.positioning = randomInt(14, 20);
      break;
    case 'MID':
      attributes.passing = randomInt(14, 20);
      attributes.vision = randomInt(13, 19);
      attributes.technique = randomInt(13, 19);
      break;
    case 'FWD':
      attributes.shooting = randomInt(14, 20);
      attributes.finishing = randomInt(15, 20);
      attributes.dribbling = randomInt(13, 19);
      break;
  }
  
  const adjustedAttributes = adjustAttributesForTeam(attributes, teamIndex);
  
  const rolesForPosition = getRolesForPosition(position);
  const role = rolesForPosition[Math.floor(Math.random() * rolesForPosition.length)];
  
  return {
    player: {
      name: generateName(),
      position,
      role,
      age: generateAge(),
      nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
      isOnField: false,
      energy: randomDecimal(70, 100),
      currentStamina: randomDecimal(70, 100),
      condition: randomDecimal(75, 100),
      yellowCards: 0,
      redCard: false,
      minutesPlayed: 0,
      isInjured: false,
      injuryDuration: 0,
      goals: 0,
      assists: 0,
      shotsOnTarget: 0,
      shotsOffTarget: 0,
      passesCompleted: 0,
      passesAttempted: 0,
      tackles: 0,
      interceptions: 0,
      fouls: 0,
      distanceRun: '0',
      form: randomDecimal(40, 80),
      morale: randomDecimal(40, 80),
    },
    attributes: adjustedAttributes
  };
}

function getRolesForPosition(position: typeof positions[number]): typeof roles {
  switch (position) {
    case 'GK':
      return ['Default', 'Playmaker', 'Target Man', 'Sweeper Keeper', 'Ball-Playing Defender', 'Box-to-Box', 'Poacher', 'Winger'];
    case 'DEF':
      return ['Default', 'Playmaker', 'Target Man', 'Sweeper Keeper', 'Ball-Playing Defender', 'Box-to-Box', 'Poacher', 'Winger'];
    case 'MID':
     return ['Default', 'Playmaker', 'Target Man', 'Sweeper Keeper', 'Ball-Playing Defender', 'Box-to-Box', 'Poacher', 'Winger'];
    case 'FWD':
      return ['Default', 'Playmaker', 'Target Man', 'Sweeper Keeper', 'Ball-Playing Defender', 'Box-to-Box', 'Poacher', 'Winger'];
    default:
      return ['Default', 'Playmaker', 'Target Man', 'Sweeper Keeper', 'Ball-Playing Defender', 'Box-to-Box', 'Poacher', 'Winger'];
  }
}

// Função para gerar posição baseada na distribuição do time
function getPositionByIndex(index: number): typeof positions[number] {
  // Distribuição típica: 3 GK, 8 DEF, 7 MID, 4 FWD = 22 jogadores
  if (index < 3) return 'GK';
  if (index < 11) return 'DEF';
  if (index < 18) return 'MID';
  return 'FWD';
}

// Função principal de seed
async function seed() {
  console.log('🚀 Iniciando seed do banco de dados...');
  
  try {
    // Limpa dados existentes (opcional - cuidado em produção!)
    console.log('🧹 Limpando dados existentes...');
    await db.delete(teamPlayers);
    await db.delete(playerAttributes);
    await db.delete(players);
    await db.delete(teams);
    
    const createdTeams = [];
    
    // Cria os times
    for (let i = 0; i < teamNames.length; i++) {
      const teamName = teamNames[i];
      console.log(`📝 Criando time: ${teamName}`);
      
      const [team] = await db.insert(teams).values({
        name: teamName,
        formationName: i === 0 ? '4-3-3' : '4-4-2',
        morale: i === 0 ? '85' : randomDecimal(50, 70),
        cohesion: i === 0 ? '80' : randomDecimal(50, 65),
        tacticalFamiliarity: i === 0 ? '85' : randomDecimal(50, 65),
        substitutionsRemaining: 5,
        mentality: i === 0 ? 'ATTACKING' : 'BALANCED',
        pressing: i === 0 ? 'HIGH' : 'MEDIUM',
        passingStyle: i === 0 ? 'POSSESSION' : 'MIXED',
        width: i === 0 ? 60 : 50,
        tempo: i === 0 ? 65 : 50,
        offensiveWidth: i === 0 ? 65 : 50,
        defensiveWidth: i === 0 ? 55 : 50,
        defensiveLine: i === 0 ? 65 : 50,
      }).returning();
      
      createdTeams.push({ team, index: i });
    }
    
    // Cria os jogadores para cada time
    for (const { team, index: teamIndex } of createdTeams) {
      console.log(`👥 Criando 22 jogadores para ${team.name}...`);
      
      const createdPlayers = [];
      
      for (let i = 0; i < 22; i++) {
        const position = getPositionByIndex(i);
        const { player, attributes } = generatePlayerForPosition(position, teamIndex);
        
        // Insere o jogador
        const [createdPlayer] = await db.insert(players).values(player).returning();
        
        // Insere os atributos do jogador
        await db.insert(playerAttributes).values({
          playerId: createdPlayer.id,
          ...attributes,
        });
        
        createdPlayers.push(createdPlayer);
        
        // Associa jogador ao time
        await db.insert(teamPlayers).values({
          teamId: team.id,
          playerId: createdPlayer.id,
          fieldPosition: position,
          isStarter: i < 11, // primeiros 11 são titulares
        });
      }
      
      console.log(`✅ ${createdPlayers.length} jogadores criados para ${team.name}`);
    }
    
    console.log('🎉 Seed concluído com sucesso!');
    
    // Exibe resumo
    const allTeams = await db.select().from(teams);
    const allPlayers = await db.select().from(players);
    const allTeamPlayers = await db.select().from(teamPlayers);
    
    console.log('\n📊 Resumo:');
    console.log(`- Times criados: ${allTeams.length}`);
    console.log(`- Jogadores criados: ${allPlayers.length}`);
    console.log(`- Associações time-jogador: ${allTeamPlayers.length}`);
    
    for (const team of allTeams) {
      const teamPlayerCount = await db.select().from(teamPlayers).where(sql`team_id = ${team.id}`);
      console.log(`- ${team.name}: ${teamPlayerCount.length} jogadores`);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

// Executa o seed
seed().catch((error) => {
  console.error('Falha no seed:', error);
  process.exit(1);
});