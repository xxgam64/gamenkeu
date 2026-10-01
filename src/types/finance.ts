export type ScreenId =
  | 'ringkasan-keuangan'
  | 'buku-kas'
  | 'analisis-anggaran'
  | 'manajemen-portofolio'
  | 'perencanaan-dana-dan-tagihan'
  | 'akses-akun-premium';

export type TransactionType = 'masuk' | 'keluar';

export type CategoryClassification =
  | 'kebutuhan'
  | 'keinginan'
  | 'investasi'
  | 'pendapatan';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // e.g. "09:15 WIB"
  title: string;
  description?: string;
  counterparty?: string;
  account: string;
  category: string;
  classification: CategoryClassification;
  type: TransactionType;
  amount: number;
  status: 'Selesai' | 'Auto-Debit' | 'Portofolio' | 'QRIS BCA' | 'Pending';
  receiptAttached?: boolean;
  auditVerified?: boolean;
}

export interface PortfolioAsset {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'Saham Bluechip' | 'Obligasi Negara' | 'Komoditas / Emas' | 'Reksadana Saham';
  units: number;
  unitLabel: string;
  avgBuyPrice: number;
  investedCapital: number;
  currentValue: number;
  currentUnitPrice?: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  badgeColor?: string;
}

export interface DividendRecord {
  id: string;
  title: string;
  issuer: string;
  date: string;
  amount: number;
  destination: string;
  type: 'kupon' | 'dividen';
}

export interface SinkingFund {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
  frequency: string;
  holdingAccount: string;
  statusNote: string;
  monthlyAllocation: number;
  icon: string;
}

export interface UpcomingBill {
  id: string;
  dueDate: string;
  daysRemainingText: string;
  title: string;
  institution: string;
  category: string;
  holdingAccount: string;
  amount: number;
  readinessStatus: 'Dana Siap 100%' | 'Teralokasi Penuh' | 'Menunggu Gaji Masuk';
  isPaid?: boolean;
}
