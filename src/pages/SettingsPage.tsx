import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Palette,
  LogOut,
  Save,
  CheckCircle2,
  Shield,
  Sun,
  Moon,
  Smartphone,
  Mail,
  Camera,
  Upload,
  Laptop,
  Link as LinkIcon,
  Trash2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
];

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, updatePassword, theme, toggleTheme, logout, addToast } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  // Helper to extract the college ID part from a student ID (e.g. "PRISM-000UEC0000" -> "000UEC0000")
  const extractCollegeId = (val?: string) => {
    if (!val) return '000UEC0000';
    return val.replace(/^PRISM-?\s*/i, '').trim();
  };

  const [collegeId, setCollegeId] = useState(() => extractCollegeId(user?.studentId));
  const [department, setDepartment] = useState(user?.department || '');
  const [year, setYear] = useState(user?.year || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarError, setAvatarError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Sync avatar if user context changes
  useEffect(() => {
    if (user?.avatar) {
      setAvatar(user.avatar);
      setAvatarError(false);
    }
  }, [user?.avatar]);

  // Keep college ID synced if user context updates
  useEffect(() => {
    if (user?.studentId) {
      setCollegeId(extractCollegeId(user.studentId));
    }
  }, [user?.studentId]);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Invalid File Type', 'Please upload an image file (PNG, JPG, WEBP, GIF, SVG).', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('File Too Large', 'Please select an image smaller than 10MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      if (file.type === 'image/svg+xml' || file.size < 50 * 1024) {
        setAvatar(dataUrl);
        setAvatarError(false);
        addToast('Avatar Selected', `Photo "${file.name}" loaded from device. Click "Save Changes" to apply.`, 'success');
        return;
      }

      // Optimize image using HTML5 Canvas (max 400x400) for fast loading and low storage footprint
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 400;
        let w = img.width;
        let h = img.height;

        if (w > h) {
          if (w > maxSize) {
            h = Math.round((h * maxSize) / w);
            w = maxSize;
          }
        } else {
          if (h > maxSize) {
            w = Math.round((w * maxSize) / h);
            h = maxSize;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          setAvatar(compressed);
        } else {
          setAvatar(dataUrl);
        }
        setAvatarError(false);
        addToast('Avatar Selected', `Photo "${file.name}" loaded from device. Click "Save Changes" to apply.`, 'success');
      };
      img.onerror = () => {
        setAvatar(dataUrl);
        setAvatarError(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const fullStudentId = `PRISM-${collegeId.trim() || '000UEC0000'}`;

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState(
    user?.notifications || {
      email: true,
      sms: false,
      eventReminders: true,
      teamUpdates: true,
      announcements: true,
    }
  );

  const handleCollegeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    if (val.startsWith('PRISM-')) {
      val = val.substring(6);
    } else if (val.startsWith('PRISM')) {
      val = val.substring(5).replace(/^-+/, '');
    }
    val = val.replace(/\s+/g, '');
    setCollegeId(val);
  };

  const handleCollegeIdBlur = () => {
    if (!collegeId.trim()) {
      setCollegeId('000UEC0000');
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCollegeId = collegeId.trim() || '000UEC0000';
    const formattedId = `PRISM-${cleanCollegeId}`;
    setCollegeId(cleanCollegeId);

    updateProfile({
      name,
      email,
      studentId: formattedId,
      department,
      year,
      bio,
      phone,
      avatar,
      notifications,
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please provide your current security password');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const success = await updatePassword(currentPassword, newPassword);
    if (success) {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl glass-panel bg-gradient-to-r from-[#11122a] via-[#16173a] to-[#0d172e] border border-purple-500/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300 font-semibold">
            <SettingsIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Account & System Preferences</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Manage your PRISM scholar profile, configure notification alerts, adjust theme appearance, and update security credentials.
          </p>
        </div>
      </div>

      {/* 1. Student Profile Section */}
      <div className="rounded-3xl glass-panel border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Student Profile Information</h3>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 shadow-sm">
            {fullStudentId}
          </span>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Avatar and direct file upload */}
          <div className="bg-[#0b0e20] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 shadow-inner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar preview with drag & drop */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer rounded-2xl p-1 transition-all flex-shrink-0 ${
                  isDragging
                    ? 'ring-4 ring-cyan-400 scale-105 bg-cyan-500/10'
                    : 'ring-4 ring-purple-500/30 hover:ring-purple-400'
                }`}
                title="Click or drag an image file from your PC or laptop"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center relative shadow-2xl">
                  <img
                    src={
                      !avatarError && avatar
                        ? avatar
                        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={name || 'User avatar'}
                    onError={() => setAvatarError(true)}
                    className="w-full h-full object-cover"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-semibold gap-1.5 p-2 text-center">
                    <Upload className="w-5 h-5 text-cyan-300" />
                    <span>Upload Image</span>
                  </div>
                </div>

                {/* Floating camera / laptop upload badge */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-[#090b17]"
                  title="Upload image from PC or laptop"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Hidden native file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Controls right side */}
              <div className="flex-1 w-full space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">Profile Avatar</h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      Direct PC Upload
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload any photo directly from your PC or laptop, or choose a preset below. Drag and drop onto the avatar box is also supported.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose from PC / Laptop</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{showUrlInput ? 'Hide URL Input' : 'Paste Image Link'}</span>
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar('');
                        setAvatarError(false);
                        addToast('Avatar Reset', 'Avatar has been reset to default.', 'info');
                      }}
                      className="px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Reset to default avatar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* Quick Preset Avatars */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[11px] font-semibold text-slate-400">Quick Presets:</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setAvatar(preset);
                          setAvatarError(false);
                          addToast('Preset Chosen', `Preset avatar #${idx + 1} selected.`, 'info');
                        }}
                        className={`relative rounded-xl overflow-hidden p-0.5 transition-all cursor-pointer ${
                          avatar === preset
                            ? 'ring-2 ring-cyan-400 scale-105'
                            : 'opacity-70 hover:opacity-100 hover:scale-100'
                        }`}
                        title={`Choose preset #${idx + 1}`}
                      >
                        <img src={preset} alt={`preset ${idx + 1}`} className="w-9 h-9 object-cover rounded-lg" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Web URL input */}
                {showUrlInput && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5 animate-fade-in">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Direct Image Web URL
                    </label>
                    <input
                      type="text"
                      value={avatar}
                      placeholder="https://example.com/avatar.jpg"
                      onChange={(e) => {
                        setAvatar(e.target.value);
                        setAvatarError(false);
                      }}
                      className="w-full bg-[#101222] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                    />
                    <p className="text-[10px] text-amber-300/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      Must be a direct image URL (ends in .jpg, .png, etc.), not a search engine results page.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#101222] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                College Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#101222] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Student ID Number
                </label>
                <button
                  type="button"
                  onClick={() => setCollegeId('000UEC0000')}
                  className="text-[11px] text-purple-400 hover:text-purple-300 font-mono transition-colors underline underline-offset-2"
                >
                  Example: PRISM-000UEC0000
                </button>
              </div>
              <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all bg-[#101222]">
                <div className="bg-purple-500/15 border-r border-white/10 px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-purple-300 select-none flex items-center">
                  PRISM-
                </div>
                <input
                  type="text"
                  value={collegeId}
                  onChange={handleCollegeIdChange}
                  onBlur={handleCollegeIdBlur}
                  placeholder="000UEC0000"
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-none placeholder-slate-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex flex-wrap items-center justify-between gap-1">
                <span>
                  ID starts with <strong className="text-purple-300 font-mono">PRISM-</strong> followed by college ID (e.g. <span className="text-cyan-300 font-mono">PRISM-000UEC0000</span>)
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Full ID: <span className="text-cyan-300 font-bold">{fullStudentId}</span>
                </span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Academic Year & Cohort
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#101222] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Department / Major
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#101222] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Bio & Research Interests
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#101222] border border-white/10 rounded-xl p-4 text-xs text-white leading-relaxed focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Notification Preferences */}
      <div className="rounded-3xl glass-panel border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
          <Bell className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Notification Alerts & Channels</h3>
        </div>

        <div className="space-y-4">
          {[
            {
              key: 'email',
              title: 'Email Notifications',
              desc: 'Receive registration confirmations and receipts to your official inbox',
            },
            {
              key: 'eventReminders',
              title: 'Event Calendar Reminders',
              desc: 'Get notified 24 hours prior to upcoming registered college events',
            },
            {
              key: 'teamUpdates',
              title: 'Team & Club Activity Broadcasts',
              desc: 'Receive alerts when team leads post announcements or meeting dates',
            },
            {
              key: 'announcements',
              title: 'Urgent Campus Broadcasts',
              desc: 'Instant notifications for administrative deadlines and weather alerts',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(notifications as any)[item.key]}
                  onChange={(e) => {
                    const updated = {
                      ...notifications,
                      [item.key]: e.target.checked,
                    };
                    setNotifications(updated);
                    updateProfile({ notifications: updated });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Theme Preferences (Dark / Light) */}
      <div className="rounded-3xl glass-panel border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
          <Palette className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Theme & Visual Experience</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dark Mode Card */}
          <div
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              theme === 'dark'
                ? 'bg-purple-900/25 border-purple-500/60 shadow-lg shadow-purple-600/20'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold text-white">OrbitX Dark Cosmos</span>
              </div>
              {theme === 'dark' && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Deep space palette with electric purple, cyan glow accents, and glassmorphism.
            </p>
          </div>

          {/* Light Mode Card */}
          <div
            onClick={() => theme !== 'light' && toggleTheme()}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              theme === 'light'
                ? 'bg-cyan-900/25 border-cyan-500/60 shadow-lg shadow-cyan-600/20'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-white">Daylight Pearl</span>
              </div>
              {theme === 'light' && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 text-[10px] font-bold">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              High contrast clean daylight mode for outdoor study and bright ambient environments.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Security & Password Update */}
      <div className="rounded-3xl glass-panel border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
          <Lock className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-bold text-white">Change Security Password</h3>
        </div>

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Your password has been securely updated!</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#101222] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-[#101222] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full bg-[#101222] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* 5. Session & Logout Area */}
      <div className="rounded-3xl glass-panel border border-rose-500/20 p-6 flex items-center justify-between shadow-xl">
        <div>
          <h4 className="text-base font-bold text-white">Sign Out of PRISM</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            End active session on this device. Your data remains stored in your student account.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
