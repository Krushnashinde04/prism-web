import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  Search,
  Clock,
  MapPin,
  Trophy,
  CheckCircle2,
  Ticket,
  DollarSign,
  Sparkles,
  CreditCard,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CollegeEvent } from '../types';
import { Modal } from '../components/ui/Modal';
import { QRCodeComponent } from '../components/ui/QRCodeComponent';

export const EventsPage: React.FC = () => {
  const { events, registerForEvent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Upcoming' | 'Ongoing' | 'Completed'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeModalEvent, setActiveModalEvent] = useState<CollegeEvent | null>(null);
  const [checkoutEvent, setCheckoutEvent] = useState<CollegeEvent | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Campus Pay (Student ID Balance)');
  const [isProcessingReg, setIsProcessingReg] = useState(false);
  const [confirmedPassId, setConfirmedPassId] = useState<string | null>(null);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Other'];
  const statusOptions = ['All', 'Upcoming', 'Ongoing', 'Completed'] as const;

  const featuredEvent = events[0]; // Apex Hackathon flagship

  const filteredEvents = events.filter((e) => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleRegisterSubmit = async () => {
    if (!checkoutEvent) return;
    setIsProcessingReg(true);
    const pass = await registerForEvent(checkoutEvent.id, paymentMethod);
    setIsProcessingReg(false);
    if (pass) {
      setConfirmedPassId(pass.registrationNumber);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Featured Event Hero Banner */}
      {featuredEvent && (
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-purple-500/30 shadow-2xl group">
          <div className="absolute inset-0">
            <img
              src={featuredEvent.poster}
              alt={featuredEvent.title}
              className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070814] via-[#0b0d22]/90 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-12 max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-purple-600/30">
                ★ FEATURED FLAGSHIP
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 text-cyan-300 text-xs font-mono border border-cyan-500/30">
                {featuredEvent.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {featuredEvent.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
              {featuredEvent.longDescription || featuredEvent.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 font-medium">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <CalendarDays className="w-4 h-4 text-purple-400" />
                {featuredEvent.date}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 text-rose-400" />
                {featuredEvent.venue}
              </span>
              <span className="flex items-center gap-1.5 bg-purple-500/20 px-3 py-1.5 rounded-xl border border-purple-500/40 text-purple-300 font-bold">
                Pass Fee: ${featuredEvent.fee}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setActiveModalEvent(featuredEvent)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all"
              >
                Full Schedule & Rules
              </button>

              {featuredEvent.isRegistered ? (
                <span className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Pass Issued in Wallet
                </span>
              ) : (
                <button
                  onClick={() => {
                    setCheckoutEvent(featuredEvent);
                    setConfirmedPassId(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Controls: Time Status Tabs, Category Filter & Search Bar */}
      <div className="space-y-4">
        {/* Time Status Tabs (Upcoming, Ongoing, Completed) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-2xl bg-[#0e1022] border border-white/10">
            {statusOptions.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st} Events
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event name, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101222] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300 shadow-md shadow-purple-500/20'
                  : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const percentRegistered = Math.min(
            100,
            Math.round((evt.registeredCount / evt.capacity) * 100)
          );

          return (
            <div
              key={evt.id}
              className="rounded-3xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition-all duration-300 group shadow-xl"
            >
              {/* Event Poster Header */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={evt.poster}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1124] via-black/40 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-white/10 uppercase tracking-wider">
                    {evt.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
                      evt.status === 'Ongoing'
                        ? 'bg-rose-500/80 text-white animate-pulse'
                        : evt.status === 'Completed'
                        ? 'bg-slate-700/80 text-slate-300'
                        : 'bg-emerald-500/80 text-white'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-purple-600/90 backdrop-blur-md text-xs font-bold text-white shadow-lg">
                  {evt.fee === 0 ? 'FREE' : `$${evt.fee}`}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="space-y-1.5 mt-4 pt-3 border-t border-white/5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>
                        {evt.date} • {evt.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>

                  {/* Availability Indicator */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Availability</span>
                      <span className="text-purple-300 font-semibold font-mono">
                        {evt.registeredCount}/{evt.capacity} Spots ({percentRegistered}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentRegistered > 90
                            ? 'bg-rose-500'
                            : 'bg-gradient-to-r from-purple-500 to-cyan-400'
                        }`}
                        style={{ width: `${percentRegistered}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveModalEvent(evt)}
                    className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    View Details
                  </button>

                  {evt.isRegistered ? (
                    <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </span>
                  ) : evt.status === 'Completed' ? (
                    <span className="px-3.5 py-2 rounded-xl bg-white/5 text-slate-500 text-xs font-semibold">
                      Concluded
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setCheckoutEvent(evt);
                        setConfirmedPassId(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
                    >
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="p-12 text-center rounded-3xl glass-panel">
          <CalendarDays className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No matching events found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try choosing a different category or clearing search filters.
          </p>
        </div>
      )}

      {/* Event Details Modal */}
      {activeModalEvent && (
        <Modal
          isOpen={!!activeModalEvent}
          onClose={() => setActiveModalEvent(null)}
          title={activeModalEvent.title}
          subtitle={`Organized by ${activeModalEvent.organizer} • ${activeModalEvent.category}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img
                src={activeModalEvent.poster}
                alt={activeModalEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f1f] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold">
                  {activeModalEvent.fee === 0 ? 'FREE ADMISSION' : `$${activeModalEvent.fee} REGISTRATION FEE`}
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Event Overview
              </h5>
              <p className="text-sm text-slate-200 leading-relaxed">
                {activeModalEvent.longDescription || activeModalEvent.description}
              </p>
            </div>

            {/* Highlights */}
            {activeModalEvent.highlights && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Event Highlights & Amenities
                </h5>
                <ul className="space-y-2">
                  {activeModalEvent.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-200 flex items-center gap-2 bg-white/[0.03] p-2.5 rounded-xl border border-white/5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Schedule Timeline */}
            {activeModalEvent.timeline && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Schedule Agenda
                </h5>
                <div className="space-y-2">
                  {activeModalEvent.timeline.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="text-white font-medium">{item.activity}</span>
                      <span className="text-purple-300 font-mono">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModalEvent.prizes && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-amber-300 uppercase tracking-wider">
                    Prizes & Recognitions:
                  </span>
                  <p className="text-slate-200 mt-0.5">{activeModalEvent.prizes}</p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalEvent(null)}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-white/5"
              >
                Close
              </button>
              {activeModalEvent.isRegistered ? (
                <span className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pass Issued</span>
                </span>
              ) : (
                <button
                  onClick={() => {
                    const evt = activeModalEvent;
                    setActiveModalEvent(null);
                    setCheckoutEvent(evt);
                    setConfirmedPassId(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
                >
                  Proceed to Register
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Registration & Payment Checkout Modal */}
      {checkoutEvent && (
        <Modal
          isOpen={!!checkoutEvent}
          onClose={() => setCheckoutEvent(null)}
          title={confirmedPassId ? 'Registration Confirmed!' : `Register for ${checkoutEvent.title}`}
          subtitle={
            confirmedPassId
              ? 'Your official PRISM digital pass is ready'
              : 'Complete your registration and claim your digital QR pass'
          }
          maxWidth="max-w-md"
        >
          {confirmedPassId ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-lg font-bold text-white">Digital Pass Issued!</h4>
              <p className="text-xs text-slate-300">
                You are confirmed for <span className="text-white font-bold">{checkoutEvent.title}</span>. Your ticket has been recorded in your wallet.
              </p>

              <div className="p-4 bg-black/40 rounded-2xl border border-white/10 inline-block mx-auto">
                <QRCodeComponent value={confirmedPassId} size={110} />
                <p className="font-mono text-xs font-bold text-cyan-300 mt-2">
                  {confirmedPassId}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                <NavLink
                  to="/payments-and-passes"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 text-center"
                >
                  Open Passes & Download Receipt →
                </NavLink>
                <button
                  onClick={() => setCheckoutEvent(null)}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Order Summary Box */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Event</span>
                  <span className="text-white font-semibold">{checkoutEvent.title}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Date & Time</span>
                  <span className="text-white">{checkoutEvent.date}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Pass Tier</span>
                  <span className="text-purple-300 font-semibold">
                    {checkoutEvent.fee > 0 ? 'VIP Access Pass' : 'General Admission'}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-emerald-400">
                    {checkoutEvent.fee === 0 ? 'FREE' : `$${checkoutEvent.fee}.00`}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Payment Method
                </label>
                <div className="space-y-2">
                  {[
                    'Campus Pay (Student ID Balance)',
                    'Credit / Debit Card (Visa/Mastercard)',
                    'Apple Pay / Google Pay',
                  ].map((method) => (
                    <label
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentMethod === method
                          ? 'bg-purple-600/20 border-purple-500/60 text-white'
                          : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-purple-400" />
                        <span>{method}</span>
                      </div>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="text-purple-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  onClick={() => setCheckoutEvent(null)}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegisterSubmit}
                  disabled={isProcessingReg}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 disabled:opacity-70"
                >
                  {isProcessingReg ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Confirming Pass...</span>
                    </>
                  ) : (
                    <span>
                      {checkoutEvent.fee === 0 ? 'Claim Free Ticket' : `Pay $${checkoutEvent.fee} & Issue Pass`}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
