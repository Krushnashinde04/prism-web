import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Users2,
  CheckCircle2,
  Building,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ApplyMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyMembershipModal: React.FC<ApplyMembershipModalProps> = ({ isOpen, onClose }) => {
  const { user, teams, submitMembershipRequest, addToast } = useApp();

  const [preferredTeam, setPreferredTeam] = useState('Technical Team');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('2nd Year');
  const [skills, setSkills] = useState('React, TypeScript, Embedded Systems');
  const [reason, setReason] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      addToast('Statement Required', 'Please share why you would like to join the PRISM student council.', 'error');
      return;
    }

    const skillsArray = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    submitMembershipRequest({
      userId: user?.id || 'usr_unknown',
      userName: user?.name || 'Student Applicant',
      applicantName: user?.name || 'Student Applicant',
      userEmail: user?.email || 'student@prism.edu',
      applicantEmail: user?.email || 'student@prism.edu',
      studentId: user?.studentId || 'PRISM-000UEC0000',
      department,
      year: academicYear,
      appliedTeam: preferredTeam,
      preferredTeam,
      reason: reason.trim(),
      skills: skillsArray,
      portfolioUrl: portfolioUrl.trim() || undefined,
    });

    setSubmitted(true);
    addToast('Application Received', 'Your PRISM membership application has been forwarded to the Executive Council.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel bg-[#0d1024] border border-cyan-500/30 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Join PRISM Student Core</h3>
              <p className="text-xs text-cyan-300">Official Membership Application</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-white">Application Dispatched!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-cyan-300">{user?.name}</strong>. The PRISM Executive Council reviews applications on a rolling basis. You will be notified in your top navigation bar upon approval.
              </p>
            </div>
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold shadow-lg"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Applicant</span>
                <span className="font-bold text-white">{user?.name}</span>
                <span className="text-slate-400 block">{user?.email}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Student ID</span>
                <span className="font-mono text-cyan-300 font-bold">{user?.studentId}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Team / Guild</label>
                <select
                  value={preferredTeam}
                  onChange={(e) => setPreferredTeam(e.target.value)}
                  className="w-full bg-[#14172f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-[#14172f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Technical Skills & Areas of Interest
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Comma separated: e.g. Python, UI Design, Robotics"
                className="w-full bg-[#14172f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Why do you want to join PRISM? <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us about your project aspirations, initiatives you want to lead, or previous club involvement..."
                className="w-full bg-[#14172f] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Portfolio or GitHub URL (Optional)
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/your-username"
                className="w-full bg-[#14172f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Membership Application</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
