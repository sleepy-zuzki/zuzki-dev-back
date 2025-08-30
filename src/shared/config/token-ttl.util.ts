export function getAccessTokenTtl(): number {
  const raw = process.env.ACCESS_TOKEN_TTL;
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) {
    return n;
  }
  // Valor por defecto seguro: 15 minutos
  return 900;
}
