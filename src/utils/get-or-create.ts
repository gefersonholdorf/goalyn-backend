import type { TableRow } from "@/types/table-row"


export function getOrCreate(teamId: string, standingsMap: Map<string, TableRow>): TableRow {
   if (!standingsMap.has(teamId)) {
      standingsMap.set(teamId, {
         teamId,
         played: 0,
         wins: 0,
         draws: 0,
         losses: 0,
         goalsFor: 0,
         goalsAgainst: 0,
         goalDifference: 0,
         points: 0,
         form: [],
      })
   }

   return standingsMap.get(teamId)!
}