export type LiquidityType = 'D+0' | 'D+1' | 'D+30' | 'no_vencimento';
export type InvestmentType = 'CDB' | 'LCI' | 'LCA' | 'RDB';
export type RiskLevel = 'baixo' | 'medio' | 'alto';

export interface Bank {
  id: string;
  institutionId?: string;
  offerId?: string;
  name: string;
  shortName: string;
  logo: string;
  logoUrl?: string;
  color: string;
  cdiRate: number;
  investmentType: InvestmentType;
  liquidity: LiquidityType;
  minimumAmount: number;
  fgcCovered: boolean;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendationScore: number;
  isRecommended: boolean;
  hasTax: boolean;
  description: string;
  rateHistory: number[];
  affiliateUrl: string;
}

export const LIQUIDITY_LABELS: Record<LiquidityType, { label: string; color: 'brand' | 'neutral' | 'warning' }> = {
  'D+0': { label: 'Saque quando quiser', color: 'brand' },
  'D+1': { label: 'Disponível amanhã', color: 'neutral' },
  'D+30': { label: 'Disponível em 30 dias', color: 'neutral' },
  'no_vencimento': { label: 'Só no vencimento', color: 'warning' },
};

export const INVESTMENT_LABELS: Record<InvestmentType, string> = {
  'CDB': 'CDB',
  'LCI': 'LCI — sem imposto',
  'LCA': 'LCA — sem imposto',
  'RDB': 'RDB',
};

const SUPABASE_STORAGE_BASE = 'https://fdqmuoxqjxqurdnpxedf.supabase.co/storage/v1/object/public/bank-logos';

export const BANKS: Bank[] = [
  {
    id: 'rico',
    name: 'Rico Investimentos',
    shortName: 'Rico',
    logo: 'RC',
    logoUrl: `${SUPABASE_STORAGE_BASE}/rico.webp`,
    color: '#00C2A8',
    cdiRate: 230.0,
    investmentType: 'CDB',
    liquidity: 'no_vencimento',
    minimumAmount: 100,
    fgcCovered: true,
    riskScore: 73,
    riskLevel: 'baixo',
    recommendationScore: 99,
    isRecommended: false,
    hasTax: true,
    description: 'Corretora do grupo XP com grande variedade de CDBs de diversos emissores. Taxas agressivas a partir de R$ 100, com vencimentos variados.',
    rateHistory: [225, 226, 228, 228, 230, 230],
    affiliateUrl: 'https://www.rico.com.vc',
  },
  {
    id: 'xp',
    name: 'XP Investimentos',
    shortName: 'XP',
    logo: 'XP',
    logoUrl: `${SUPABASE_STORAGE_BASE}/xp.webp`,
    color: '#000000',
    cdiRate: 150.0,
    investmentType: 'CDB',
    liquidity: 'no_vencimento',
    minimumAmount: 1000,
    fgcCovered: true,
    riskScore: 85,
    riskLevel: 'baixo',
    recommendationScore: 97,
    isRecommended: false,
    hasTax: true,
    description: 'Maior corretora independente do Brasil. Oferece CDBs de múltiplos emissores com taxas elevadas. Investimento mínimo varia por produto.',
    rateHistory: [145, 146, 148, 148, 150, 150],
    affiliateUrl: 'https://www.xp.com.br',
  },
  {
    id: 'pagbank',
    name: 'PagBank',
    shortName: 'PagBank',
    logo: 'PB',
    logoUrl: `${SUPABASE_STORAGE_BASE}/pagseguro.webp`,
    color: '#00A652',
    cdiRate: 115.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 1,
    fgcCovered: true,
    riskScore: 74,
    riskLevel: 'baixo',
    recommendationScore: 93,
    isRecommended: false,
    hasTax: true,
    description: 'Banco digital do PagSeguro com CDBs a partir de R$ 1. Também oferece "cofrinho" com rendimento automático. Boa opção para iniciantes.',
    rateHistory: [112, 113, 113, 114, 115, 115],
    affiliateUrl: 'https://www.pagbank.com.br',
  },
  {
    id: 'pan',
    name: 'Banco Pan',
    shortName: 'Pan',
    logo: 'PA',
    logoUrl: `${SUPABASE_STORAGE_BASE}/bancopan.webp`,
    color: '#0066FF',
    cdiRate: 115.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 5,
    fgcCovered: true,
    riskScore: 72,
    riskLevel: 'baixo',
    recommendationScore: 91,
    isRecommended: false,
    hasTax: true,
    description: 'Banco com CDB e conta remunerada a partir de R$ 5. Taxas competitivas com resgate no mesmo dia. Também oferece conta digital gratuita.',
    rateHistory: [112, 113, 113, 114, 115, 115],
    affiliateUrl: 'https://www.bancopan.com.br',
  },
  {
    id: 'agibank',
    name: 'Agibank',
    shortName: 'Agi',
    logo: 'AG',
    logoUrl: `${SUPABASE_STORAGE_BASE}/agibank.webp`,
    color: '#FF6B00',
    cdiRate: 113.0,
    investmentType: 'CDB',
    liquidity: 'no_vencimento',
    minimumAmount: 1000,
    fgcCovered: true,
    riskScore: 68,
    riskLevel: 'baixo',
    recommendationScore: 87,
    isRecommended: false,
    hasTax: true,
    description: 'Banco digital com CDB, LCI e LCA. Para o CDB a taxa é de 113% do CDI. Também oferece LCI e LCA isentas de IR com liquidez no vencimento.',
    rateHistory: [110, 111, 112, 112, 113, 113],
    affiliateUrl: 'https://www.agibank.com.br',
  },
  {
    id: 'picpay',
    name: 'PicPay',
    shortName: 'PicPay',
    logo: 'PP',
    logoUrl: `${SUPABASE_STORAGE_BASE}/picpay.webp`,
    color: '#21C25E',
    cdiRate: 111.5,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 1,
    fgcCovered: true,
    riskScore: 73,
    riskLevel: 'baixo',
    recommendationScore: 89,
    isRecommended: false,
    hasTax: true,
    description: 'App de pagamentos que também oferece CDB no "cofrinho" com rendimento diário. A partir de R$ 1 com resgate imediato.',
    rateHistory: [108, 109, 110, 111, 111, 111.5],
    affiliateUrl: 'https://www.picpay.com',
  },
  {
    id: 'nubank',
    name: 'Nubank',
    shortName: 'Nu',
    logo: 'NU',
    logoUrl: `${SUPABASE_STORAGE_BASE}/nubank.webp`,
    color: '#820AD1',
    cdiRate: 110.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 1,
    fgcCovered: true,
    riskScore: 82,
    riskLevel: 'baixo',
    recommendationScore: 88,
    isRecommended: false,
    hasTax: true,
    description: 'O banco roxinho mais popular do Brasil. RDB na caixinha com liquidez diária e CDBs com taxas maiores para quem travar o dinheiro por mais tempo.',
    rateHistory: [105, 107, 108, 109, 110, 110],
    affiliateUrl: 'https://nubank.com.br',
  },
  {
    id: 'bmg',
    name: 'Banco BMG',
    shortName: 'BMG',
    logo: 'BM',
    logoUrl: `${SUPABASE_STORAGE_BASE}/bancoobmg.webp`,
    color: '#FF6600',
    cdiRate: 110.5,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 50,
    fgcCovered: true,
    riskScore: 65,
    riskLevel: 'medio',
    recommendationScore: 82,
    isRecommended: false,
    hasTax: true,
    description: 'Banco tradicional com CDB de liquidez diária a partir de R$ 50. Boas taxas para investimentos de médio prazo.',
    rateHistory: [107, 108, 109, 110, 110, 110.5],
    affiliateUrl: 'https://www.bancobmg.com.br',
  },
  {
    id: '99pay',
    name: '99Pay',
    shortName: '99',
    logo: '99',
    logoUrl: `${SUPABASE_STORAGE_BASE}/99.webp`,
    color: '#FFCC00',
    cdiRate: 110.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 0,
    fgcCovered: false,
    riskScore: 50,
    riskLevel: 'medio',
    recommendationScore: 80,
    isRecommended: false,
    hasTax: true,
    description: 'Carteira digital do app 99. Rendimento automático via Tesouro Selic na conta remunerada. Sem cobertura do FGC, mas com garantia soberana.',
    rateHistory: [108, 109, 109, 110, 110, 110],
    affiliateUrl: 'https://www.99app.com',
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    shortName: 'MP',
    logo: 'MP',
    logoUrl: `${SUPABASE_STORAGE_BASE}/mercadopago.webp`,
    color: '#009EE3',
    cdiRate: 110.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 1,
    fgcCovered: false,
    riskScore: 50,
    riskLevel: 'medio',
    recommendationScore: 83,
    isRecommended: false,
    hasTax: true,
    description: 'Conta digital do Mercado Livre. Rendimento automático via Tesouro Selic no "cofrinho". Sem FGC, mas com garantia soberana do governo.',
    rateHistory: [105, 107, 108, 109, 110, 110],
    affiliateUrl: 'https://www.mercadopago.com.br',
  },
  {
    id: 'recargapay',
    name: 'RecargaPay',
    shortName: 'Recarga',
    logo: 'RP',
    logoUrl: `${SUPABASE_STORAGE_BASE}/recargapay.webp`,
    color: '#6B2FBF',
    cdiRate: 105.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 50,
    fgcCovered: true,
    riskScore: 60,
    riskLevel: 'medio',
    recommendationScore: 72,
    isRecommended: false,
    hasTax: true,
    description: 'App de pagamentos com conta remunerada e CDB. O CDB rende ~103% do CDI com prazo de 30 dias. Conta remunerada tem resgate imediato.',
    rateHistory: [102, 103, 104, 104, 105, 105],
    affiliateUrl: 'https://www.recargapay.com.br',
  },
  {
    id: 'brb',
    name: 'Banco BRB',
    shortName: 'BRB',
    logo: 'BR',
    logoUrl: `${SUPABASE_STORAGE_BASE}/bancobrb.webp`,
    color: '#003399',
    cdiRate: 106.5,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 100,
    fgcCovered: true,
    riskScore: 70,
    riskLevel: 'baixo',
    recommendationScore: 76,
    isRecommended: false,
    hasTax: true,
    description: 'Banco de Brasília com CDB de liquidez diária e LCI isenta de IR. CDB a partir de R$ 100 com boas taxas para a região.',
    rateHistory: [103, 104, 105, 106, 106.5, 106.5],
    affiliateUrl: 'https://www.brb.com.br',
  },
  {
    id: 'c6',
    name: 'C6 Bank',
    shortName: 'C6',
    logo: 'C6',
    logoUrl: `${SUPABASE_STORAGE_BASE}/c6.webp`,
    color: '#242424',
    cdiRate: 102.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 20,
    fgcCovered: true,
    riskScore: 75,
    riskLevel: 'baixo',
    recommendationScore: 78,
    isRecommended: false,
    hasTax: true,
    description: 'Banco digital completo com CDB a partir de R$ 20 e conta com cashback. Também oferece tag de pedágio, cartões sem anuidade e programa Átomos.',
    rateHistory: [100, 101, 101, 102, 102, 102],
    affiliateUrl: 'https://www.c6bank.com.br',
  },
  {
    id: 'inter',
    name: 'Banco Inter',
    shortName: 'Inter',
    logo: 'IN',
    logoUrl: `${SUPABASE_STORAGE_BASE}/inter.webp`,
    color: '#FF6900',
    cdiRate: 101.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 1,
    fgcCovered: true,
    riskScore: 78,
    riskLevel: 'baixo',
    recommendationScore: 82,
    isRecommended: false,
    hasTax: true,
    description: 'Banco digital com conta gratuita e CDB de liquidez diária. Também oferece LCA isenta de IR. Marketplace integrado e cashback em compras.',
    rateHistory: [100, 100, 101, 101, 101, 101],
    affiliateUrl: 'https://www.bancointer.com.br',
  },
  {
    id: 'mercantil',
    name: 'Banco Mercantil',
    shortName: 'Mercantil',
    logo: 'ME',
    logoUrl: `${SUPABASE_STORAGE_BASE}/bancomercantil.webp`,
    color: '#003E7E',
    cdiRate: 101.0,
    investmentType: 'CDB',
    liquidity: 'no_vencimento',
    minimumAmount: 5000,
    fgcCovered: true,
    riskScore: 62,
    riskLevel: 'medio',
    recommendationScore: 65,
    isRecommended: false,
    hasTax: true,
    description: 'Banco mineiro tradicional com CDB de prazo fixo. Requer investimento mínimo de R$ 5.000, com rendimento de ~101% do CDI no vencimento.',
    rateHistory: [100, 100, 100, 101, 101, 101],
    affiliateUrl: 'https://www.bancomercantilinvest.com.br',
  },
  {
    id: 'bancodonordeste',
    name: 'Banco do Nordeste',
    shortName: 'BNB',
    logo: 'BN',
    logoUrl: `${SUPABASE_STORAGE_BASE}/bancodonordeste.webp`,
    color: '#E30613',
    cdiRate: 100.0,
    investmentType: 'CDB',
    liquidity: 'no_vencimento',
    minimumAmount: 500,
    fgcCovered: true,
    riskScore: 72,
    riskLevel: 'baixo',
    recommendationScore: 68,
    isRecommended: false,
    hasTax: true,
    description: 'Banco de desenvolvimento regional com CDB e LCA. Principal financiador do Nordeste. CDB com ~100% do CDI no vencimento. LCA isenta de IR.',
    rateHistory: [98, 99, 99, 100, 100, 100],
    affiliateUrl: 'https://www.bnb.gov.br',
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    shortName: 'Bradesco',
    logo: 'BD',
    logoUrl: `${SUPABASE_STORAGE_BASE}/bradesco.webp`,
    color: '#CC092F',
    cdiRate: 100.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 100,
    fgcCovered: true,
    riskScore: 90,
    riskLevel: 'baixo',
    recommendationScore: 75,
    isRecommended: false,
    hasTax: true,
    description: 'Um dos maiores bancos do Brasil com mais de 70 milhões de clientes. CDB de liquidez diária a 100% do CDI, ideal para reserva de emergência.',
    rateHistory: [100, 100, 100, 100, 100, 100],
    affiliateUrl: 'https://www.bradesco.com.br',
  },
  {
    id: 'next',
    name: 'Next',
    shortName: 'Next',
    logo: 'NX',
    logoUrl: `${SUPABASE_STORAGE_BASE}/next.webp`,
    color: '#00E88F',
    cdiRate: 100.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 100,
    fgcCovered: true,
    riskScore: 78,
    riskLevel: 'baixo',
    recommendationScore: 70,
    isRecommended: false,
    hasTax: true,
    description: 'Banco digital do Bradesco com interface moderna. CDB de liquidez diária a 100% do CDI. Conta gratuita com funcionalidades de banco completo.',
    rateHistory: [100, 100, 100, 100, 100, 100],
    affiliateUrl: 'https://www.banconext.com.br',
  },
  {
    id: 'santander',
    name: 'Santander',
    shortName: 'Santander',
    logo: 'ST',
    logoUrl: `${SUPABASE_STORAGE_BASE}/santander.webp`,
    color: '#EC0000',
    cdiRate: 100.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 1,
    fgcCovered: true,
    riskScore: 88,
    riskLevel: 'baixo',
    recommendationScore: 74,
    isRecommended: false,
    hasTax: true,
    description: 'Banco espanhol de grande porte no Brasil. CDB com liquidez diária a 100% do CDI. Também oferece LCI e LCA isentas de imposto de renda.',
    rateHistory: [100, 100, 100, 100, 100, 100],
    affiliateUrl: 'https://www.santander.com.br',
  },
  {
    id: 'banrisul',
    name: 'Banrisul',
    shortName: 'Banrisul',
    logo: 'BL',
    logoUrl: `${SUPABASE_STORAGE_BASE}/banrisul.webp`,
    color: '#003399',
    cdiRate: 100.0,
    investmentType: 'CDB',
    liquidity: 'D+1',
    minimumAmount: 500,
    fgcCovered: true,
    riskScore: 72,
    riskLevel: 'baixo',
    recommendationScore: 66,
    isRecommended: false,
    hasTax: true,
    description: 'Banco estatal do Rio Grande do Sul com CDB, LCI e LCA. Tradicional e sólido, com mais de 90 anos de história. LCI e LCA isentas de IR.',
    rateHistory: [98, 99, 99, 100, 100, 100],
    affiliateUrl: 'https://www.banrisul.com.br',
  },
  {
    id: 'bancodobrasil',
    name: 'Banco do Brasil',
    shortName: 'BB',
    logo: 'BB',
    logoUrl: `${SUPABASE_STORAGE_BASE}/bancodobrasil.webp`,
    color: '#FFCC00',
    cdiRate: 99.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 500,
    fgcCovered: true,
    riskScore: 92,
    riskLevel: 'baixo',
    recommendationScore: 73,
    isRecommended: false,
    hasTax: true,
    description: 'Maior banco público do Brasil. CDB com liquidez diária a 99% do CDI. Solidez institucional e ampla rede de atendimento em todo o país.',
    rateHistory: [97, 98, 98, 99, 99, 99],
    affiliateUrl: 'https://www.bb.com.br',
  },
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    shortName: 'Itaú',
    logo: 'IT',
    logoUrl: `${SUPABASE_STORAGE_BASE}/itau.webp`,
    color: '#003399',
    cdiRate: 95.0,
    investmentType: 'CDB',
    liquidity: 'D+1',
    minimumAmount: 1000,
    fgcCovered: true,
    riskScore: 92,
    riskLevel: 'baixo',
    recommendationScore: 71,
    isRecommended: false,
    hasTax: true,
    description: 'Maior banco privado do Brasil e da América Latina. CDB e LCA disponíveis. LCA isenta de IR com carência de 6 meses.',
    rateHistory: [93, 94, 94, 95, 95, 95],
    affiliateUrl: 'https://www.itau.com.br',
  },
  {
    id: 'caixa',
    name: 'Caixa Econômica',
    shortName: 'Caixa',
    logo: 'CX',
    logoUrl: `${SUPABASE_STORAGE_BASE}/caixa.webp`,
    color: '#005CA9',
    cdiRate: 95.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 200,
    fgcCovered: true,
    riskScore: 88,
    riskLevel: 'baixo',
    recommendationScore: 69,
    isRecommended: false,
    hasTax: true,
    description: 'Banco público federal focado em habitação e programas sociais. CDB com liquidez diária a partir de R$ 200. Também oferece LCI isenta de IR.',
    rateHistory: [93, 94, 94, 95, 95, 95],
    affiliateUrl: 'https://www.caixa.gov.br',
  },
  {
    id: 'porto',
    name: 'Porto Seguro Bank',
    shortName: 'Porto',
    logo: 'PS',
    logoUrl: `${SUPABASE_STORAGE_BASE}/porto.webp`,
    color: '#003DA5',
    cdiRate: 100.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 100,
    fgcCovered: true,
    riskScore: 70,
    riskLevel: 'baixo',
    recommendationScore: 67,
    isRecommended: false,
    hasTax: true,
    description: 'Braço financeiro da seguradora Porto Seguro. Conta remunerada e CDB com liquidez diária. Boa integração com seguros e serviços financeiros.',
    rateHistory: [98, 99, 99, 100, 100, 100],
    affiliateUrl: 'https://www.portoseguro.com.br',
  },
];

export const CURRENT_CDI_RATE = 14.90;
export const CURRENT_SAVINGS_RATE = 8.26;
export const CURRENT_IPCA_RATE = 4.26;

export function calculateReturnWithBaseCdi(
  principal: number,
  cdiPercent: number,
  months: number,
  hasTax: boolean,
  baseCdiRate: number
): { gross: number; net: number; monthly: number } {
  const annualRate = (baseCdiRate * cdiPercent) / 100 / 100;
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  const total = principal * Math.pow(1 + monthlyRate, months);
  const gross = total - principal;

  let taxRate = 0;
  if (hasTax) {
    if (months <= 6) taxRate = 0.225;
    else if (months <= 12) taxRate = 0.20;
    else if (months <= 24) taxRate = 0.175;
    else taxRate = 0.15;
  }

  const net = gross * (1 - taxRate);
  const monthly = net / months;

  return { gross, net, monthly };
}

export function calculateReturn(
  principal: number,
  cdiPercent: number,
  months: number,
  hasTax: boolean
): { gross: number; net: number; monthly: number } {
  return calculateReturnWithBaseCdi(principal, cdiPercent, months, hasTax, CURRENT_CDI_RATE);
}

export function calculateSavingsReturn(principal: number, months: number): number {
  const annualRate = CURRENT_SAVINGS_RATE / 100;
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  return principal * Math.pow(1 + monthlyRate, months) - principal;
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'baixo': return '#16A34A';
    case 'medio': return '#D97706';
    case 'alto': return '#DC2626';
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'baixo': return 'Baixo risco';
    case 'medio': return 'Médio risco';
    case 'alto': return 'Alto risco';
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}
