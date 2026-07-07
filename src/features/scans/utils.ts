export function deriveVerdict(score: number, riskLevel: string) {
  const cleanRisk = (riskLevel || '').toUpperCase();
  if (cleanRisk === 'CRITICAL' || score < 45) return 'scam';
  if (score < 75) return 'caution';
  return 'safe';
}
