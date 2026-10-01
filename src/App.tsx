import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { TransactionModal } from './components/modals/TransactionModal';
import { UpdateAssetModal } from './components/modals/UpdateAssetModal';
import { AddAssetModal } from './components/modals/AddAssetModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { CertificateModal } from './components/modals/CertificateModal';

import { FinancialOverviewScreen } from './screens/FinancialOverviewScreen';
import { CashBookScreen } from './screens/CashBookScreen';
import { BudgetAnalysisScreen } from './screens/BudgetAnalysisScreen';
import { PortfolioScreen } from './screens/PortfolioScreen';
import { PlanningScreen } from './screens/PlanningScreen';
import { PremiumAccountScreen } from './screens/PremiumAccountScreen';

const MainContent: React.FC = () => {
  const { currentScreen } = useFinance();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'ringkasan-keuangan':
        return <FinancialOverviewScreen />;
      case 'buku-kas':
        return <CashBookScreen />;
      case 'analisis-anggaran':
        return <BudgetAnalysisScreen />;
      case 'manajemen-portofolio':
        return <PortfolioScreen />;
      case 'perencanaan-dana-dan-tagihan':
        return <PlanningScreen />;
      case 'akses-akun-premium':
        return <PremiumAccountScreen />;
      default:
        return <FinancialOverviewScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0b1c30] flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Viewport Container */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header onOpenMobileSidebar={() => setIsOpenMobile(true)} />
        <main className="w-full pt-16 flex-1">{renderScreen()}</main>
      </div>

      {/* Global Modals */}
      <TransactionModal />
      <UpdateAssetModal />
      <AddAssetModal />
      <ExportReportModal />
      <CertificateModal />

      {/* Toast Feedback System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainContent />
    </FinanceProvider>
  );
}
