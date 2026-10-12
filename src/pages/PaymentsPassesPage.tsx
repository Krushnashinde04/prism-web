import React, { useState } from 'react';
import {
  CreditCard,
  Ticket,
  Search,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  DollarSign,
  Calendar,
  MapPin,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentRecord, DigitalPass } from '../types';
import { Modal } from '../components/ui/Modal';
import { QRCodeComponent } from '../components/ui/QRCodeComponent';

export const PaymentsPassesPage: React.FC = () => {
  const { payments, passes, user, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'passes' | 'payments'>('passes');
  const [searchQuery, setSearchQuery] = useState('');
  const [receiptModalPayment, setReceiptModalPayment] = useState<PaymentRecord | null>(null);
  const [previewPass, setPreviewPass] = useState<DigitalPass | null>(null);

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    return (
      p.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter passes
  const filteredPasses = passes.filter((pass) => {
    return (
      pass.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalSpent = payments
    .filter((p) => p.status === 'Successful')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleDownloadReceipt = (receiptNo: string) => {
    addToast('Receipt Generated', `Downloaded official invoice ${receiptNo}`, 'success');
  };

  const handlePrintPass = (passNo: string) => {
    window.print();
    addToast('Print Triggered', `Digital pass ${passNo} sent to system printer`, 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl glass-panel bg-gradient-to-r from-[#0d142b] via-[#11193d] to-[#1d1238] border border-cyan-500/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 font-semibold">
            <Ticket className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus Digital Wallet & Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Payments & Passes
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Access encrypted digital QR event entry tickets, view payment settlement logs, and retrieve verified campus tax invoices.
          </p>
        </div>
      </div>

      {/* Tab Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tab Buttons */}
        <div className="inline-flex p-1 rounded-2xl bg-[#0e1022] border border-white/10 self-start">
          <button
            onClick={() => setActiveTab('passes')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'passes'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Passes</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {passes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payments'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payments History</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {payments.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'passes' ? 'Search passes or venues...' : 'Search transactions...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101222] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
        </div>
      </div>

      {/* TAB 1: MY PASSES */}
      {activeTab === 'passes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPasses.map((pass) => (
              <div
                key={pass.id}
                className="relative rounded-3xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group shadow-2xl"
              >
                {/* Holographic Header Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400" />

                <div className="p-6">
                  {/* Tier & Check-in Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
                      {pass.tier}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                        pass.checkInStatus === 'Valid'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : pass.checkInStatus === 'Checked In'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-slate-700/40 text-slate-400 border-white/10'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{pass.checkInStatus}</span>
                    </span>
                  </div>

                  {/* Event Info */}
                  <div className="py-4 space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {pass.eventTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>
                        {pass.eventDate} • {pass.eventTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span className="truncate">{pass.venue}</span>
                    </div>
                  </div>

                  {/* QR Matrix Block */}
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center justify-center my-2">
                    <QRCodeComponent value={pass.registrationNumber} size={115} />
                    <span className="font-mono text-xs font-bold text-cyan-300 mt-2.5 tracking-wider">
                      {pass.registrationNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Present at gate scanner for entry
                    </span>
                  </div>

                  {/* Attendee Info */}
                  <div className="pt-3 border-t border-dashed border-white/15 flex items-center justify-between text-xs text-slate-400">
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400">Holder</span>
                      <span className="font-semibold text-white">{pass.studentName}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] uppercase text-slate-400">Student ID</span>
                      <span className="font-mono text-slate-300">{pass.studentId}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Actions */}
                <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handlePrintPass(pass.registrationNumber)}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-purple-400" />
                    <span>Print Pass</span>
                  </button>

                  <button
                    onClick={() => handleDownloadReceipt(pass.registrationNumber)}
                    className="flex-1 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPasses.length === 0 && (
            <div className="p-12 text-center rounded-3xl glass-panel">
              <Ticket className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No passes found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Explore the events calendar to register and claim digital tickets.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYMENTS HISTORY */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Summary Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl glass-card border border-white/10">
              <span className="text-xs text-slate-400 uppercase font-semibold">
                Total Campus Spend
              </span>
              <p className="text-2xl font-black text-white mt-1">${totalSpent.toFixed(2)}</p>
              <span className="text-[11px] text-emerald-400 font-medium">All cleared ledger items</span>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-white/10">
              <span className="text-xs text-slate-400 uppercase font-semibold">
                Settled Transactions
              </span>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {payments.filter((p) => p.status === 'Successful').length}
              </p>
              <span className="text-[11px] text-slate-400">Confirmed by payment engine</span>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-white/10">
              <span className="text-xs text-slate-400 uppercase font-semibold">
                Security Protocol
              </span>
              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                <span className="text-sm font-bold text-white">Zero-Storage PCI Compliant</span>
              </div>
              <span className="text-[11px] text-slate-400">Card details are never stored</span>
            </div>
          </div>

          {/* Payments Table */}
          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-6">Transaction Ref</th>
                    <th className="py-4 px-6">Item / Activity</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Payment Method</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {filteredPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 font-mono text-purple-300 font-semibold">
                        {pay.transactionRef}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-white block">{pay.itemTitle}</span>
                        <span className="text-[10px] text-slate-400">{pay.itemType}</span>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-white">
                        {pay.amount === 0 ? 'FREE' : `$${pay.amount.toFixed(2)}`}
                      </td>
                      <td className="py-4 px-6 text-slate-400">{pay.date}</td>
                      <td className="py-4 px-6 text-slate-300">{pay.paymentMethod}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border ${
                            pay.status === 'Successful'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : pay.status === 'Pending'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {pay.status === 'Successful' && <CheckCircle2 className="w-3 h-3" />}
                          {pay.status === 'Pending' && <Clock className="w-3 h-3" />}
                          {pay.status === 'Failed' && <XCircle className="w-3 h-3" />}
                          <span>{pay.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setReceiptModalPayment(pay)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white font-semibold transition-colors flex items-center gap-1 ml-auto"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Official Tax Invoice / Receipt Modal */}
      {receiptModalPayment && (
        <Modal
          isOpen={!!receiptModalPayment}
          onClose={() => setReceiptModalPayment(null)}
          title="Official Payment Receipt"
          subtitle={`Invoice Ref: ${receiptModalPayment.receiptNumber}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-6">
            {/* PRISM Institutional Watermark Card */}
            <div className="p-6 rounded-2xl bg-white text-slate-900 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-900">PRISM</h3>
                  <p className="text-xs text-slate-500">Collegiate Activity Administration</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Receipt #
                  </span>
                  <span className="font-mono text-xs font-bold text-purple-700">
                    {receiptModalPayment.receiptNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Billed To</span>
                  <p className="font-bold text-slate-900">{user?.name || 'Student'}</p>
                  <p className="text-slate-600 font-mono text-[11px]">{user?.studentId}</p>
                  <p className="text-slate-600">{user?.department}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase block">Payment Date</span>
                  <p className="font-semibold text-slate-900">{receiptModalPayment.date}</p>
                  <span className="text-slate-500 text-[10px] uppercase block mt-2">Method</span>
                  <p className="font-semibold text-slate-900">{receiptModalPayment.paymentMethod}</p>
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-3 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{receiptModalPayment.itemTitle} ({receiptModalPayment.itemType})</span>
                  <span className="font-mono">${receiptModalPayment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Campus Service Fee (0%)</span>
                  <span className="font-mono">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 pt-1">
                <span>Total Amount Paid</span>
                <span className="text-base font-mono text-purple-700">
                  ${receiptModalPayment.amount.toFixed(2)} USD
                </span>
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-400">
                Generated securely by PRISM Settlement Engine • Status: {receiptModalPayment.status}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setReceiptModalPayment(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => handlePrintPass(receiptModalPayment.receiptNumber)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
