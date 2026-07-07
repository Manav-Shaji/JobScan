export function localFallbackAnalysis(jobText: string, reason: string) {
  const text = jobText.toLowerCase();
  const redFlags: string[] = [];

  const suspects = [
    { regex: /\b(telegram|whatsapp|signal)\b/i, flag: 'Contacts applicants via insecure messaging apps' },
    { regex: /\b(crypto|bitcoin|ethereum|tether|payment required|transfer money|wire transfer|wallet address)\b/i, flag: 'Mentions cryptocurrency or payment transfers' },
    { regex: /\b(urgent|immediately|asap|right away|hurry up|urgent hiring)\b/i, flag: 'Uses urgent hiring pressure' },
    { regex: /\b(no experience|required no experience|entry level with high pay|easy money)\b/i, flag: 'Promises high pay with little or no experience' },
    { regex: /\b(investment|invest|investment opportunity|profit share)\b/i, flag: 'Includes suspicious investment language' },
    { regex: /\b(work from home|remote work|home-based|work at home)\b/i, flag: 'Offers remote work with unclear employer verification' }
  ];

  suspects.forEach((item) => {
    if (item.regex.test(text)) {
      redFlags.push(item.flag);
    }
  });

  if (text.length > 0 && text.length < 120) {
    redFlags.push('Job description is unusually short and lacks detail');
  }

  const signalCount = Math.max(0, 4 - redFlags.length);
  const positiveSignals = [
    'Job description provided',
    'Includes role and application details',
    'Contains some legitimate formatting'
  ].slice(0, signalCount || 1);

  const jitter = (text.length % 7) - 3;
  const score = Math.max(15, 78 - redFlags.length * 16 + jitter);
  const overallRisk = Math.min(98, Math.max(12, 100 - score));
  const riskLevel = overallRisk >= 70 ? 'HIGH' : overallRisk >= 45 ? 'MEDIUM' : 'LOW';

  return {
    overallTrustScore: score,
    riskLevel,
    posterCredibilityScore: 50 + (text.length % 5) - 2,
    contactTrustScore: Math.max(35, 75 - redFlags.length * 10 + ((text.length + 1) % 5) - 2),
    employerTrustScore: Math.max(35, 80 - redFlags.length * 12 + ((text.length + 2) % 5) - 2),
    salaryRiskScore: Math.min(95, 20 + redFlags.length * 10 + ((text.length + 3) % 5) - 2),
    urgencyRiskScore: Math.min(95, 20 + redFlags.length * 8 + ((text.length + 4) % 5) - 2),
    patternName: redFlags.length > 2 ? 'Unknown Pattern' : 'None',
    patternConfidence: redFlags.length > 2 ? 60 : 0,
    redFlags: redFlags.slice(0, 8),
    positiveSignals,
    summary: `Local fallback analysis used because Gemini was unavailable (${reason}). Review suspicious terms before applying.`,
    extractedText: "",
    fallbackUsed: true,
    source: 'local',
    fallbackReason: reason
  };
}
