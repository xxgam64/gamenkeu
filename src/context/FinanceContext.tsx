import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import {
  ScreenId,
  Transaction,
  PortfolioAsset,
  DividendRecord,
  SinkingFund,
  UpcomingBill,
} from '../types/finance';
import {
  auth,
  db,
  loginWithGoogle,
  logoutUser,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

export interface AppUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  provider: 'local' | 'google';
  createdAt: string;
}

interface FinanceContextType {
  // Auth & Profiles
  user: User | null;
  userProfile: AppUserProfile | null;
  savedProfiles: AppUserProfile[];
  isAuthLoading: boolean;
  login: () => Promise<void>;
  loginWithProfile: (name: string, email: string) => Promise<void>;
  switchProfile: (profile: AppUserProfile) => void;
  deleteSavedProfile: (uid: string) => void;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  // Navigation & View
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  viewMode: 'konsolidasi' | 'arus-kas' | 'audit-fiskal';
  setViewMode: (mode: 'konsolidasi' | 'arus-kas' | 'audit-fiskal') => void;

  // Data
  transactions: Transaction[];
  assets: PortfolioAsset[];
  sinkingFunds: SinkingFund[];
  upcomingBills: UpcomingBill[];
  dividends: DividendRecord[];

  // Mutators
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateAssetValuation: (id: string, newCurrentValue: number, newUnitPrice?: number) => Promise<void>;
  addAsset: (asset: Omit<PortfolioAsset, 'id' | 'unrealizedGain' | 'unrealizedGainPercent'>) => Promise<void>;
  addSinkingFund: (fund: Omit<SinkingFund, 'id' | 'statusNote'>) => Promise<void>;
  payBill: (id: string) => Promise<void>;
  syncCalendar: () => void;

  // Modals & UI controls
  isTransactionModalOpen: boolean;
  setIsTransactionModalOpen: (open: boolean) => void;
  selectedAssetForUpdate: PortfolioAsset | null;
  setSelectedAssetForUpdate: (asset: PortfolioAsset | null) => void;
  isAddAssetModalOpen: boolean;
  setIsAddAssetModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isCertificateModalOpen: boolean;
  setIsCertificateModalOpen: (open: boolean) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: '2024-10-25',
    time: '09:15 WIB',
    title: 'Gaji Pokok Korporasi',
    description: 'PT Teknologi Inovasi Indonesia',
    counterparty: 'PT Teknologi Inovasi Indonesia',
    account: 'Mandiri Payroll (•••• 1042)',
    category: 'Gaji & Kompensasi',
    classification: 'pendapatan',
    type: 'masuk',
    amount: 25000000,
    status: 'Selesai',
    receiptAttached: true,
    auditVerified: true,
  },
  {
    id: 'tx-2',
    date: '2024-10-24',
    time: '14:02 WIB',
    title: 'PLN & Utilitas Rumah',
    description: 'Token Listrik 2200VA + Air PDAM',
    counterparty: 'Pengelola Apartemen Sentral',
    account: 'BCA Auto-debit (•••• 8291)',
    category: 'Utilitas & Tagihan',
    classification: 'kebutuhan',
    type: 'keluar',
    amount: 1450000,
    status: 'Auto-Debit',
    receiptAttached: true,
    auditVerified: true,
  },
  {
    id: 'tx-3',
    date: '2024-10-22',
    time: '10:45 WIB',
    title: 'Top Up Reksadana Indeks',
    description: 'Alokasi Bulanan Bareksa (IDX30)',
    counterparty: 'Bibit Portal Investasi',
    account: 'Jago Rekening (•••• 4991)',
    category: 'Investasi Portofolio',
    classification: 'investasi',
    type: 'keluar',
    amount: 3500000,
    status: 'Portofolio',
    receiptAttached: true,
    auditVerified: true,
  },
  {
    id: 'tx-4',
    date: '2024-10-20',
    time: '20:15 WIB',
    title: 'Restoran & Rekreasi',
    description: 'QRIS Cafe Senopati',
    counterparty: 'Plataran Dharmawangsa',
    account: 'QRIS BCA (•••• 8291)',
    category: 'Makanan & Minuman',
    classification: 'keinginan',
    type: 'keluar',
    amount: 720000,
    status: 'QRIS BCA',
    receiptAttached: true,
    auditVerified: true,
  },
  {
    id: 'tx-5',
    date: '2024-10-15',
    time: '16:30 WIB',
    title: 'Bonus Insentif Q3',
    description: 'Disetujui Manajemen Finansial',
    counterparty: 'Honorarium Finansial Audit',
    account: 'BCA Payroll (•••• 8291)',
    category: 'Pendapatan Sampingan',
    classification: 'pendapatan',
    type: 'masuk',
    amount: 3500000,
    status: 'Selesai',
    receiptAttached: true,
    auditVerified: true,
  },
  {
    id: 'tx-6',
    date: '2024-09-24',
    time: '14:02 WIB',
    title: 'Pembayaran Sewa Tempat Tinggal',
    description: 'Pengelola Apartemen Sentral',
    counterparty: 'Pengelola Apartemen Sentral',
    account: 'BCA Payroll (•••• 8291)',
    category: 'Sewa Tempat Tinggal / Properti',
    classification: 'kebutuhan',
    type: 'keluar',
    amount: 6500000,
    status: 'Selesai',
    receiptAttached: true,
    auditVerified: true,
  },
  {
    id: 'tx-7',
    date: '2024-09-21',
    time: '18:20 WIB',
    title: 'Belanja Bahan Pokok Supermarket',
    description: 'GrandLucky SCBD Mart',
    counterparty: 'GrandLucky SCBD Mart',
    account: 'Mandiri Debit (•••• 1042)',
    category: 'Bahan Pokok & Dapur',
    classification: 'kebutuhan',
    type: 'keluar',
    amount: 1850000,
    status: 'Selesai',
    receiptAttached: true,
    auditVerified: true,
  },
  {
    id: 'tx-8',
    date: '2024-09-12',
    time: '08:00 WIB',
    title: 'Internet Fiber Optic',
    description: 'Biznet Dedicated Home 100Mbps',
    counterparty: 'Biznet Networks',
    account: 'Auto-debit BCA (•••• 8291)',
    category: 'Utilitas & Tagihan',
    classification: 'kebutuhan',
    type: 'keluar',
    amount: 550000,
    status: 'Auto-Debit',
    receiptAttached: true,
    auditVerified: true,
  },
];

const INITIAL_ASSETS: PortfolioAsset[] = [
  {
    id: 'ast-1',
    code: 'BBCA',
    name: 'Bank Central Asia (BBCA)',
    description: 'IDX Equity • KSEI Reg: ID1000106708',
    category: 'Saham Bluechip',
    units: 50,
    unitLabel: 'Lot (5.000 Lbr)',
    avgBuyPrice: 8850,
    investedCapital: 44250000,
    currentValue: 51500000,
    currentUnitPrice: 10300,
    unrealizedGain: 7250000,
    unrealizedGainPercent: 16.38,
    badgeColor: 'bg-slate-900 text-white',
  },
  {
    id: 'ast-2',
    code: 'SBN',
    name: 'Surat Berharga Negara (ORI024-T3)',
    description: 'Kupon 6.10% p.a. Fixed Rate • Jatuh Tempo Okt 2026',
    category: 'Obligasi Negara',
    units: 25,
    unitLabel: 'Unit (@ Rp 1 Juta)',
    avgBuyPrice: 1000000,
    investedCapital: 25000000,
    currentValue: 25750000,
    currentUnitPrice: 1030000,
    unrealizedGain: 750000,
    unrealizedGainPercent: 3.0,
    badgeColor: 'bg-[#006C4A] text-white',
  },
  {
    id: 'ast-3',
    code: 'ANTM',
    name: 'Emas Batangan Logam Mulia',
    description: '25 Gram • Certicard Resmi LM Antam',
    category: 'Komoditas / Emas',
    units: 25,
    unitLabel: 'Gram (1 Keping)',
    avgBuyPrice: 1150000,
    investedCapital: 28750000,
    currentValue: 36250000,
    currentUnitPrice: 1450000,
    unrealizedGain: 7500000,
    unrealizedGainPercent: 26.08,
    badgeColor: 'bg-amber-600 text-white',
  },
  {
    id: 'ast-4',
    code: 'IDX30',
    name: 'Reksadana Indeks IDX30',
    description: 'BNP Paribas Asset Management • Bank Kustodian BCA',
    category: 'Reksadana Saham',
    units: 8800,
    unitLabel: 'Unit Penyertaan Aktif',
    avgBuyPrice: 1136.36,
    investedCapital: 10000000,
    currentValue: 11000000,
    currentUnitPrice: 1250,
    unrealizedGain: 1000000,
    unrealizedGainPercent: 10.0,
    badgeColor: 'bg-sky-600 text-white',
  },
];

const INITIAL_SINKING_FUNDS: SinkingFund[] = [
  {
    id: 'sf-1',
    name: 'Dana Darurat 6x Pengeluaran Bulanan',
    category: 'Dana Darurat',
    targetAmount: 30000000,
    currentAmount: 24000000,
    dueDate: '2024-12-31',
    frequency: 'Bulanan',
    holdingAccount: 'Reksa Dana Pasar Uang (Bibit RDN)',
    statusNote: 'Aman & Berjalan',
    monthlyAllocation: 2000000,
    icon: 'shield',
  },
  {
    id: 'sf-2',
    name: 'Pajak Tahunan Mobil & Servis Rutin',
    category: 'Tagihan Rutin Wajib',
    targetAmount: 3500000,
    currentAmount: 3500000,
    dueDate: '2024-11-15',
    frequency: 'Tahunan',
    holdingAccount: 'Bank Mandiri - Sinking Fund (*8821)',
    statusNote: 'Dana Siap di Rekening Kas',
    monthlyAllocation: 0,
    icon: 'directions_car',
  },
  {
    id: 'sf-3',
    name: 'Premi Asuransi Kesehatan Tahunan',
    category: 'Tagihan Rutin Wajib',
    targetAmount: 4000000,
    currentAmount: 2000000,
    dueDate: '2025-02-28',
    frequency: 'Tahunan',
    holdingAccount: 'BCA Deposito Berjangka (*4019)',
    statusNote: 'Alokasi Berjalan (50%)',
    monthlyAllocation: 500000,
    icon: 'health_and_safety',
  },
];

const INITIAL_BILLS: UpcomingBill[] = [
  {
    id: 'bill-1',
    dueDate: '28 Okt 2024',
    daysRemainingText: 'H-4 Jatuh Tempo',
    title: 'Tagihan Listrik PLN & Internet Fiber',
    institution: 'Kebutuhan Operasional Rumah Tangga',
    category: 'Utilitas Rutin',
    holdingAccount: 'BCA Giro Operasional',
    amount: 1450000,
    readinessStatus: 'Dana Siap 100%',
    isPaid: false,
  },
  {
    id: 'bill-2',
    dueDate: '15 Nov 2024',
    daysRemainingText: 'H-22 Jatuh Tempo',
    title: 'Pajak Tahunan Mobil Honda & Servis Berkala',
    institution: 'Samsat Digital & Bengkel Resmi',
    category: 'Pajak Tahunan',
    holdingAccount: 'Mandiri Sinking Fund (*8821)',
    amount: 3500000,
    readinessStatus: 'Teralokasi Penuh',
    isPaid: false,
  },
  {
    id: 'bill-3',
    dueDate: '20 Nov 2024',
    daysRemainingText: 'H-27 Jatuh Tempo',
    title: 'Cicilan Pokok KPR Griya Mandiri',
    institution: 'Bank Syariah Indonesia / Debit Otomatis',
    category: 'Komitmen Aset',
    holdingAccount: 'Rekening Payroll Utama',
    amount: 4250000,
    readinessStatus: 'Menunggu Gaji Masuk',
    isPaid: false,
  },
];

const INITIAL_DIVIDENDS: DividendRecord[] = [
  {
    id: 'div-1',
    title: 'Kupon Berkala SBN (ORI024-T3)',
    issuer: 'Kemenkeu RI • Kupon Net (PPh Final 10% Terpotong)',
    date: '15 Sep 2024',
    amount: 114375,
    destination: 'Masuk ke RDN BCA',
    type: 'kupon',
  },
  {
    id: 'div-2',
    title: 'Kupon Berkala SBN (ORI024-T3)',
    issuer: 'Kemenkeu RI • Kupon Net (PPh Final 10% Terpotong)',
    date: '15 Agu 2024',
    amount: 114375,
    destination: 'Masuk ke RDN BCA',
    type: 'kupon',
  },
  {
    id: 'div-3',
    title: 'Dividen Tunai Final BBCA (T.B 2023)',
    issuer: 'PT Bank Central Asia Tbk • Rp 227.50 /lembar',
    date: '04 Apr 2024',
    amount: 1137500,
    destination: 'Kredit Otomatis RDN',
    type: 'dividen',
  },
  {
    id: 'div-4',
    title: 'Dividen Tunai Interim BBCA',
    issuer: 'PT Bank Central Asia Tbk • Rp 42.50 /lembar',
    date: '20 Des 2023',
    amount: 212500,
    destination: 'Kredit Otomatis RDN',
    type: 'dividen',
  },
];

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(() => {
    try {
      const active = localStorage.getItem('gam_active_profile');
      return active ? JSON.parse(active) : null;
    } catch {
      return null;
    }
  });
  const [savedProfiles, setSavedProfiles] = useState<AppUserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('gam_saved_profiles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('ringkasan-keuangan');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('oct-2024');
  const [viewMode, setViewMode] = useState<'konsolidasi' | 'arus-kas' | 'audit-fiskal'>('konsolidasi');

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [assets, setAssets] = useState<PortfolioAsset[]>(INITIAL_ASSETS);
  const [sinkingFunds, setSinkingFunds] = useState<SinkingFund[]>(INITIAL_SINKING_FUNDS);
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>(INITIAL_BILLS);
  const [dividends] = useState<DividendRecord[]>(INITIAL_DIVIDENDS);

  // Helper to load user profile data
  const loadProfileData = (uid: string) => {
    try {
      const savedTx = localStorage.getItem(`gam_tx_${uid}`);
      if (savedTx) {
        setTransactions(JSON.parse(savedTx));
      } else {
        setTransactions(INITIAL_TRANSACTIONS);
        localStorage.setItem(`gam_tx_${uid}`, JSON.stringify(INITIAL_TRANSACTIONS));
      }

      const savedAst = localStorage.getItem(`gam_ast_${uid}`);
      if (savedAst) {
        setAssets(JSON.parse(savedAst));
      } else {
        setAssets(INITIAL_ASSETS);
        localStorage.setItem(`gam_ast_${uid}`, JSON.stringify(INITIAL_ASSETS));
      }

      const savedSf = localStorage.getItem(`gam_sf_${uid}`);
      if (savedSf) {
        setSinkingFunds(JSON.parse(savedSf));
      } else {
        setSinkingFunds(INITIAL_SINKING_FUNDS);
        localStorage.setItem(`gam_sf_${uid}`, JSON.stringify(INITIAL_SINKING_FUNDS));
      }
    } catch (e) {
      console.warn('Error loading profile data:', e);
    }
  };

  // Login with instant user profile (Works on GitHub Pages for everyone!)
  const loginWithProfile = async (name: string, email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || 'Pengguna';
    const uid = 'usr_' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);

    const profile: AppUserProfile = {
      uid,
      displayName: cleanName,
      email: cleanEmail,
      provider: 'local',
      createdAt: new Date().toISOString(),
    };

    setUserProfile(profile);
    localStorage.setItem('gam_active_profile', JSON.stringify(profile));

    setSavedProfiles((prev) => {
      const filtered = prev.filter((p) => p.uid !== uid);
      const updated = [profile, ...filtered];
      localStorage.setItem('gam_saved_profiles', JSON.stringify(updated));
      return updated;
    });

    loadProfileData(uid);
    setIsLoginModalOpen(false);
    showToast(
      'Berhasil Masuk',
      `Selamat datang, ${cleanName}! Sesi buku kas Anda aktif dan tersimpan.`
    );
  };

  const switchProfile = (profile: AppUserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('gam_active_profile', JSON.stringify(profile));
    loadProfileData(profile.uid);
    setIsLoginModalOpen(false);
    showToast('Beralih Profil', `Sekarang menggunakan akun ${profile.displayName}.`);
  };

  const deleteSavedProfile = (uid: string) => {
    setSavedProfiles((prev) => {
      const updated = prev.filter((p) => p.uid !== uid);
      localStorage.setItem('gam_saved_profiles', JSON.stringify(updated));
      return updated;
    });
    if (userProfile?.uid === uid) {
      logout();
    }
    showToast('Profil Dihapus', 'Profil telah dihapus dari daftar tersimpan.', 'info');
  };

  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedAssetForUpdate, setSelectedAssetForUpdate] = useState<PortfolioAsset | null>(null);
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);

      if (firebaseUser) {
        // Sync user profile
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(
            userRef,
            {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Pengguna GamMenkeu',
              photoURL: firebaseUser.photoURL || '',
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );

          // Fetch user transactions
          const txCol = collection(db, 'users', firebaseUser.uid, 'transactions');
          const txSnap = await getDocs(txCol);

          if (!txSnap.empty) {
            const loadedTx: Transaction[] = [];
            txSnap.forEach((d) => loadedTx.push(d.data() as Transaction));
            setTransactions(loadedTx);
          } else {
            // First time user: seed starter transactions for their personal cloud store
            for (const item of INITIAL_TRANSACTIONS) {
              await setDoc(doc(db, 'users', firebaseUser.uid, 'transactions', item.id), item);
            }
            setTransactions(INITIAL_TRANSACTIONS);
          }

          // Fetch user assets
          const astCol = collection(db, 'users', firebaseUser.uid, 'assets');
          const astSnap = await getDocs(astCol);
          if (!astSnap.empty) {
            const loadedAst: PortfolioAsset[] = [];
            astSnap.forEach((d) => loadedAst.push(d.data() as PortfolioAsset));
            setAssets(loadedAst);
          } else {
            for (const item of INITIAL_ASSETS) {
              await setDoc(doc(db, 'users', firebaseUser.uid, 'assets', item.id), item);
            }
            setAssets(INITIAL_ASSETS);
          }

          // Fetch user sinking funds
          const sfCol = collection(db, 'users', firebaseUser.uid, 'sinkingFunds');
          const sfSnap = await getDocs(sfCol);
          if (!sfSnap.empty) {
            const loadedSf: SinkingFund[] = [];
            sfSnap.forEach((d) => loadedSf.push(d.data() as SinkingFund));
            setSinkingFunds(loadedSf);
          } else {
            for (const item of INITIAL_SINKING_FUNDS) {
              await setDoc(doc(db, 'users', firebaseUser.uid, 'sinkingFunds', item.id), item);
            }
            setSinkingFunds(INITIAL_SINKING_FUNDS);
          }

          showToast('Selamat Datang!', `Berhasil masuk sebagai ${firebaseUser.displayName || firebaseUser.email}. Data tersimpan di akun Anda.`);
        } catch (err) {
          console.warn('Error loading user data from Firestore:', err);
        }
      } else {
        // Fallback to local storage if not logged in
        const savedTx = localStorage.getItem('gam_transactions');
        if (savedTx) setTransactions(JSON.parse(savedTx));
        const savedAst = localStorage.getItem('gam_assets');
        if (savedAst) setAssets(JSON.parse(savedAst));
        const savedSf = localStorage.getItem('gam_sinking_funds');
        if (savedSf) setSinkingFunds(JSON.parse(savedSf));
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await loginWithGoogle();
      setIsLoginModalOpen(false);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        return;
      }

      let errorTitle = 'Gagal Masuk';
      let errorMsg = err?.message || 'Terjadi kesalahan saat masuk.';

      if (err?.message?.includes('identity-toolkit-api') || err?.message?.includes('identitytoolkit.googleapis.com')) {
        errorTitle = 'API Auth Belum Aktif';
        errorMsg = 'Layanan Google Identity Platform belum aktif di Google Cloud Console. Silakan aktifkan Identity Toolkit API pada konsol pengembang proyek.';
      } else if (err?.code === 'auth/unauthorized-domain') {
        errorTitle = 'Domain Belum Diotorisasi';
        errorMsg = 'Domain GitHub Pages belum ditambahkan ke daftar Authorized Domains di Firebase Authentication Settings.';
      } else if (err?.code === 'auth/popup-blocked') {
        errorTitle = 'Popup Terblokir';
        errorMsg = 'Jendela popup Google Sign-In diblokir browser. Izinkan popup untuk melanjutkan.';
      }

      showToast(errorTitle, errorMsg, 'warning');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('gam_active_profile');
    setTransactions(INITIAL_TRANSACTIONS);
    setAssets(INITIAL_ASSETS);
    setSinkingFunds(INITIAL_SINKING_FUNDS);
    showToast('Berhasil Keluar', 'Anda kini menggunakan mode tamu (Demo).', 'info');
  };

  const addTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    const id = `tx-${Date.now()}`;
    const tx: Transaction = { ...newTx, id };
    const nextTx = [tx, ...transactions];
    setTransactions(nextTx);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'transactions', id), tx);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/transactions/${id}`);
      }
    }

    if (userProfile) {
      localStorage.setItem(`gam_tx_${userProfile.uid}`, JSON.stringify(nextTx));
    } else {
      localStorage.setItem('gam_transactions', JSON.stringify(nextTx));
    }

    showToast(
      'Transaksi Tersimpan',
      `${tx.title} sebesar Rp ${tx.amount.toLocaleString('id-ID')} telah dicatat.`
    );
  };

  const deleteTransaction = async (id: string) => {
    const nextTx = transactions.filter((t) => t.id !== id);
    setTransactions(nextTx);
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/transactions/${id}`);
      }
    }
    if (userProfile) {
      localStorage.setItem(`gam_tx_${userProfile.uid}`, JSON.stringify(nextTx));
    } else {
      localStorage.setItem('gam_transactions', JSON.stringify(nextTx));
    }
    showToast('Transaksi Dihapus', 'Entri berhasil dihapus.', 'info');
  };

  const updateAssetValuation = async (id: string, newCurrentValue: number, newUnitPrice?: number) => {
    let updatedAsset: PortfolioAsset | undefined;
    setAssets((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const gain = newCurrentValue - item.investedCapital;
          const percent = Number(((gain / item.investedCapital) * 100).toFixed(2));
          updatedAsset = {
            ...item,
            currentValue: newCurrentValue,
            currentUnitPrice: newUnitPrice ?? item.currentUnitPrice,
            unrealizedGain: gain,
            unrealizedGainPercent: percent,
          };
          return updatedAsset;
        }
        return item;
      })
    );

    if (user && updatedAsset) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'assets', id), updatedAsset);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/assets/${id}`);
      }
    }

    showToast('Valuasi Diperbarui', 'Nilai pasar portofolio terbaru berhasil dikalkulasi ulang.');
  };

  const addAsset = async (data: Omit<PortfolioAsset, 'id' | 'unrealizedGain' | 'unrealizedGainPercent'>) => {
    const gain = data.currentValue - data.investedCapital;
    const percent = Number(((gain / data.investedCapital) * 100).toFixed(2));
    const newAsset: PortfolioAsset = {
      ...data,
      id: `ast-${Date.now()}`,
      unrealizedGain: gain,
      unrealizedGainPercent: percent,
    };
    setAssets((prev) => [...prev, newAsset]);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'assets', newAsset.id), newAsset);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/assets/${newAsset.id}`);
      }
    }

    showToast('Instrumen Didaftarkan', `${data.name} berhasil ditambahkan ke portofolio.`);
  };

  const addSinkingFund = async (data: Omit<SinkingFund, 'id' | 'statusNote'>) => {
    const percent = (data.currentAmount / data.targetAmount) * 100;
    const statusNote = percent >= 100 ? 'Dana Siap di Rekening Kas' : `${percent.toFixed(1)}% Terpenuhi`;
    const newFund: SinkingFund = {
      ...data,
      id: `sf-${Date.now()}`,
      statusNote,
    };
    setSinkingFunds((prev) => [...prev, newFund]);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'sinkingFunds', newFund.id), newFund);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/sinkingFunds/${newFund.id}`);
      }
    }

    showToast(
      'Rencana Dana Ditambahkan',
      `${data.name} dengan target Rp ${data.targetAmount.toLocaleString('id-ID')} tersimpan.`
    );
  };

  const payBill = async (id: string) => {
    setUpcomingBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPaid: true } : b))
    );
    const bill = upcomingBills.find((b) => b.id === id);
    if (bill) {
      await addTransaction({
        date: new Date().toISOString().split('T')[0],
        time: '12:00 WIB',
        title: bill.title,
        description: bill.institution,
        counterparty: bill.institution,
        account: bill.holdingAccount,
        category: bill.category,
        classification: 'kebutuhan',
        type: 'keluar',
        amount: bill.amount,
        status: 'Selesai',
        receiptAttached: true,
        auditVerified: true,
      });
      showToast('Tagihan Dibayar', `${bill.title} telah dilunasi dan dicatat di Buku Kas.`);
    }
  };

  const syncCalendar = () => {
    showToast('Sinkronisasi Berhasil', 'Jadwal jatuh tempo tagihan tersinkronisasi.');
  };

  return (
    <FinanceContext.Provider
      value={{
        user,
        userProfile,
        savedProfiles,
        isAuthLoading,
        login,
        loginWithProfile,
        switchProfile,
        deleteSavedProfile,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        currentScreen,
        setCurrentScreen,
        selectedPeriod,
        setSelectedPeriod,
        viewMode,
        setViewMode,
        transactions,
        assets,
        sinkingFunds,
        upcomingBills,
        dividends,
        addTransaction,
        deleteTransaction,
        updateAssetValuation,
        addAsset,
        addSinkingFund,
        payBill,
        syncCalendar,
        isTransactionModalOpen,
        setIsTransactionModalOpen,
        selectedAssetForUpdate,
        setSelectedAssetForUpdate,
        isAddAssetModalOpen,
        setIsAddAssetModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isCertificateModalOpen,
        setIsCertificateModalOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
