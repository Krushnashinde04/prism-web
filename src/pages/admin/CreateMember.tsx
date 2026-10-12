import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  UserPlus,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Copy,
  Users2,
  RefreshCw,
  Mail,
  Phone,
  Building,
  GraduationCap,
  ArrowRight,
  Send,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAccount } from '../../types';

export const CreateMember: React.FC = () => {
  const { createMember, teams, addToast } = useApp();

  const generateMemberId = () => {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    return `PRISM-MEM-${randomHex}`;
  };

  const [fullName, setFullName] = useState('');
  const [memberId, setMemberId] = useState(generateMemberId);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Electronics and Computer Engineering');
  const [academicYear, setAcademicYear] = useState('3rd Year');
  const [team, setTeam] = useState('Technical Team');
  const [designation, setDesignation] = useState('Core Engineer');
  const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Success view state
  const [createdMember, setCreatedMember] = useState<UserAccount | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);

  // Avatar presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  ];

  const handleRegenerateId = () => {
    setMemberId(generateMemberId());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      addToast('Missing Required Fields', 'Please fill in Member Name and College Email.', 'error');
      return;
    }

    if (!memberId.trim()) {
      addToast('Missing Member ID', 'Please enter or generate a Member ID.', 'error');
      return;
    }

    if (phone.trim() && phone.trim().length !== 10) {
      addToast('Invalid Phone Number', 'Please enter a 10-digit phone number (e.g. 0123456789).', 'error');
      return;
    }

    try {
      const newMember = createMember({
        studentId: memberId,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        avatar,
        department,
        year: academicYear,
        team,
        designation,
        phone,
        status,
      });

      setCreatedMember(newMember);
      addToast('PRISM Member Created', `${fullName} has been granted PRISM Member credentials!`, 'success');
    } catch (err: any) {
      addToast('Creation Error', err.message || 'Failed to create member.', 'error');
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setMemberId(generateMemberId());
    setEmail('');
    setPhone('');
    setDepartment('Electronics and Computer Engineering');
    setAcademicYear('3rd Year');
    setTeam('Technical Team');
    setDesignation('Core Engineer');
    setStatus('active');
    setCreatedMember(null);
  };

  const handleCopyId = () => {
    if (createdMember?.studentId) {
      navigator.clipboard.writeText(createdMember.studentId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Institutional Member Provisioning</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Create PRISM Member</h1>
        <p className="text-sm text-slate-300 mt-1">
          Issue verified PRISM Member credentials, assign student committees, and enable immediate website publishing access.
        </p>
      </div>

      {createdMember ? (
        /* Success Confirmation Panel */
        <div className="rounded-3xl glass-panel bg-gradient-to-br from-[#0c102b] via-[#0f1437] to-[#0d1d36] border border-cyan-500/30 p-8 shadow-2xl space-y-6 animate-scale-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Account Provisioned</span>
              <h2 className="text-2xl font-black text-white">{createdMember.name}</h2>
              <p className="text-xs text-slate-300">
                Official role assigned: <strong className="text-cyan-300">PRISM Member (Verified)</strong>
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#070a1a]/80 border border-cyan-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Generated Member ID</span>
                <span className="text-lg font-mono font-black text-cyan-300">{createdMember.studentId}</span>
              </div>
              <button
                onClick={handleCopyId}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 border border-white/10 flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId ? 'Copied!' : 'Copy Member ID'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Email</span>
                <p className="font-semibold text-white truncate">{createdMember.email}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Assigned Team</span>
                <p className="font-semibold text-white">{createdMember.team}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Designation</span>
                <p className="font-semibold text-white">{createdMember.designation}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Initial Password</span>
                <p className="font-mono text-purple-300">Member@2026!</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Department</span>
                <p className="font-semibold text-white">{createdMember.department}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Status</span>
                <p className="font-bold text-emerald-400 uppercase">Active</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-center gap-3">
            <Send className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <span>
              Secure activation notification dispatched to <strong>{createdMember.email}</strong>. Member can immediately log in under the <strong>PRISM Member</strong> login portal.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={handleResetForm}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all"
            >
              Create Another Member
            </button>
            <NavLink
              to="/admin/users"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold hover:brightness-110 shadow-lg shadow-purple-600/25 flex items-center gap-2 transition-all"
            >
              <span>View in Manage Users</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      ) : (
        /* Member Registration Form */
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl glass-panel bg-[#090c1e] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-8"
        >
          {/* Section 1: Identity & Credentials */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Personal Identity & Member ID</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Automatically Generated Member ID <span className="text-cyan-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateId}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Generate a new Member ID"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. PRISM-MEM-3630"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                  className="w-full bg-[#12152d] border border-cyan-500/40 font-mono font-bold rounded-xl px-4 py-2.5 text-sm text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Auto-generated by default. You can edit or enter your own custom Member ID directly.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Institutional Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@prism.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#12152d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Phone Number (10 Digits)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="0123456789"
                    value={phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(digitsOnly);
                    }}
                    className="w-full bg-[#12152d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Enter 10-digit mobile number (e.g. 0123456789).
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Department, Academic & Team Assignment */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <Building className="w-4 h-4 text-purple-400" />
              <span>Collegiate Committee & Designation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="Electronics and Computer Engineering">Electronics & Computer Engineering</option>
                  <option value="Electronic and Computer Engineering">Electronic and Computer Engineering</option>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Mechanical & Aerospace">Mechanical & Aerospace</option>
                  <option value="Design & Media Arts">Design & Media Arts</option>
                  <option value="Biotechnology & Quantum">Biotechnology & Quantum</option>
                  <option value="Management & Commerce">Management & Commerce</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                  <option value="Postgraduate">Postgraduate Scholar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Assigned Team / Committee <span className="text-rose-400">*</span>
                </label>
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400 font-semibold"
                >
                  <option value="Technical Team">Technical Team</option>
                  <option value="Media Team">Media Team</option>
                  <option value="Documentation Team">Documentation Team</option>
                  <option value="Management Team">Management Team</option>
                  <option value="OrbitX Space Collective">OrbitX Space Collective</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Official Designation <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Core Engineer, Event Lead, Editor"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Joining Date</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Account Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="active">Active (Immediate Clearance)</option>
                  <option value="inactive">Inactive (Pending Onboarding)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Profile Avatar Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">Select Profile Avatar</label>
              <button
                type="button"
                onClick={() => avatarFileInputRef.current?.click()}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload from PC</span>
              </button>
            </div>

            <input
              ref={avatarFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (ev.target?.result) {
                      setAvatar(ev.target.result as string);
                      addToast('Avatar Selected', `Loaded "${file.name}" from PC`, 'info');
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <div className="flex items-center gap-3 flex-wrap">
              {avatarPresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(preset)}
                  className={`relative rounded-xl overflow-hidden p-0.5 transition-all cursor-pointer ${
                    avatar === preset
                      ? 'ring-2 ring-cyan-400 scale-105'
                      : 'opacity-70 hover:opacity-100 hover:scale-100'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-12 h-12 object-cover rounded-lg" />
                </button>
              ))}

              {avatar && !avatarPresets.includes(avatar) && (
                <div className="relative rounded-xl overflow-hidden p-0.5 ring-2 ring-purple-400 scale-105">
                  <img src={avatar} alt="custom avatar" className="w-12 h-12 object-cover rounded-lg" />
                </div>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              * Password default: <code className="text-cyan-300">Member@2026!</code> (can be changed upon first login)
            </span>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:brightness-110 text-white text-sm font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create PRISM Member</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
