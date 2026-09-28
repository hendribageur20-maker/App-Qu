import React, { useState, useMemo } from 'react';
import {
  Layers,
  Briefcase,
  GraduationCap,
  Info,
  Sofa,
  Calculator,
  MonitorPlay,
  BookOpen,
  Sparkles,
  ArrowRight,
  Eye,
  Download,
  Search,
  Code2,
  Play,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  FileCode,
  Monitor,
  Smartphone,
  PlusCircle,
} from 'lucide-react';
import {
  INITIAL_CATALOG_APPS,
  TUTORIAL_ARTICLES,
  VIDEO_TUTORIALS,
  buildMasterAppQuGroupHtml,
  CatalogApp,
} from './data/catalogApps';
import { LivePreviewModal } from './components/LivePreviewModal';

type ActiveTab = 'katalog' | 'tools' | 'tutorial' | 'tentang';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('katalog');
  const [apps, setApps] = useState<CatalogApp[]>(INITIAL_CATALOG_APPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Modal Live Preview state
  const [previewApp, setPreviewApp] = useState<CatalogApp | null>(null);

  // Inline Quick Preview Dock state (on Katalog page)
  const [inlinePreviewAppId, setInlinePreviewAppId] = useState<string>(INITIAL_CATALOG_APPS[0].id);
  const [showInlineDock, setShowInlineDock] = useState<boolean>(true);
  const [inlineViewport, setInlineViewport] = useState<'desktop' | 'mobile'>('desktop');

  // Tools AI — App Generator state
  const [builderTitle, setBuilderTitle] = useState('');
  const [builderCategory, setBuilderCategory] = useState('Utility App');
  const [builderPrompt, setBuilderPrompt] = useState('');
  const [isGeneratingApp, setIsGeneratingApp] = useState(false);
  const [builderError, setBuilderError] = useState<string | null>(null);

  // Tools AI — Prompt Coach state
  const [coachIdea, setCoachIdea] = useState('');
  const [isCoaching, setIsCoaching] = useState(false);
  const [coachResult, setCoachResult] = useState<{
    structuredPrompt: string;
    recommendedFeatures: string[];
    learningTip: string;
  } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Tutorial state
  const [activeVideo, setActiveVideo] = useState(VIDEO_TUTORIALS[0]);
  const [selectedArticleId, setSelectedArticleId] = useState<string>(TUTORIAL_ARTICLES[0].id);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(apps.map((a) => a.category)));
    return ['Semua', ...unique];
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesCat = selectedCategory === 'Semua' || app.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [apps, selectedCategory, searchQuery]);

  const activeInlineApp = useMemo(
    () => apps.find((a) => a.id === inlinePreviewAppId) || apps[0],
    [apps, inlinePreviewAppId]
  );

  const handleDirectDownload = (app: CatalogApp, customName?: string) => {
    const blob = new Blob([app.htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = customName || app.fileName || 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenMasterPortalPreview = () => {
    const masterHtml = buildMasterAppQuGroupHtml(apps);
    const masterAppObj: CatalogApp = {
      id: 'master-app-qu-group-index',
      title: 'Master index.html — App Qu Group (Untuk GitHub Belajar-sama-ai)',
      category: 'Full Web Portal',
      version: 'v2.5 Master',
      description:
        'File index.html mandiri yang menggabungkan seluruh katalog App Qu Group, Tools AI, Tutorial, dan fitur Live Preview dalam satu file siap upload ke GitHub.',
      fileName: 'index.html',
      iconType: 'sparkles',
      theme: 'blue',
      highlights: [
        'Siap diunggah langsung ke github.com/hendribageur20-maker/Belajar-sama-ai',
        'Sudah termasuk 4 Tab Navigasi & Live Preview Modal Interaktif',
      ],
      htmlCode: masterHtml,
    };
    setPreviewApp(masterAppObj);
  };

  const handleUpdateAppHtml = (appId: string, newHtml: string) => {
    setApps((prev) =>
      prev.map((item) => (item.id === appId ? { ...item, htmlCode: newHtml } : item))
    );
  };

  const handleGenerateNewApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderPrompt.trim() || isGeneratingApp) return;

    setIsGeneratingApp(true);
    setBuilderError(null);

    try {
      const response = await fetch('/api/ai/generate-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: builderTitle.trim() || undefined,
          category: builderCategory,
          prompt: builderPrompt.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat aplikasi web dengan AI.');
      }

      const safeTitle = data.title || builderTitle.trim() || 'Aplikasi Web AI Baru';
      const slug = safeTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newApp: CatalogApp = {
        id: `custom-${Date.now()}`,
        title: safeTitle,
        category: data.category || builderCategory,
        version: data.version || 'v1.0 AI Ready',
        description: data.description || builderPrompt.trim(),
        fileName: `${slug || 'aplikasi-ai'}.html`,
        iconType: 'sparkles',
        theme: 'blue',
        highlights: data.highlights || [
          'Dibuat otomatis dengan AI App Builder',
          'Single-file HTML5 siap pakai & responsif',
        ],
        htmlCode: data.htmlCode,
      };

      setApps((prev) => [newApp, ...prev]);
      setInlinePreviewAppId(newApp.id);
      setPreviewApp(newApp);
      setBuilderTitle('');
      setBuilderPrompt('');
    } catch (err: any) {
      setBuilderError(
        err.message || 'Gagal menghubungi server AI. Silakan coba lagi beberapa saat.'
      );
    } finally {
      setIsGeneratingApp(false);
    }
  };

  const handleRunPromptCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachIdea.trim() || isCoaching) return;

    setIsCoaching(true);
    try {
      const response = await fetch('/api/ai/prompt-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: coachIdea.trim() }),
      });
      const data = await response.json();
      if (response.ok && data.structuredPrompt) {
        setCoachResult(data);
      } else {
        setCoachResult({
          structuredPrompt: `Buatkan aplikasi web single-file HTML5 lengkap untuk "${coachIdea.trim()}" dengan desain modern responsif, form input interaktif, kalkulasi otomatis dalam Rupiah, tabel riwayat data, serta fitur cetak atau simpan laporan.`,
          recommendedFeatures: [
            'Form input data dengan validasi otomatis',
            'Perhitungan real-time tanpa reload halaman',
            'Tabel daftar data dengan pencarian cepat',
            'Tampilan responsif untuk layar HP dan Desktop',
          ],
          learningTip:
            'Mintalah format Single-File HTML5 agar seluruh kode HTML, CSS, dan JavaScript berada di satu file index.html yang mudah Anda uji di Live Preview.',
        });
      }
    } catch {
      setCoachResult({
        structuredPrompt: `Buatkan aplikasi web single-file HTML5 lengkap untuk "${coachIdea.trim()}" dengan desain modern responsif, form input interaktif, kalkulasi otomatis dalam Rupiah, dan ringkasan statistik.`,
        recommendedFeatures: [
          'Input data interaktif',
          'Kalkulasi otomatis instan',
          'Ringkasan kartu statistik',
          'Desain rapi & ramah perangkat mobile',
        ],
        learningTip:
          'Uji setiap tombol aplikasi di jendela Live Preview sebelum mengunduh file index.html.',
      });
    } finally {
      setIsCoaching(false);
    }
  };

  const renderAppIcon = (app: CatalogApp) => {
    const colorClasses = {
      amber: 'bg-[#FEF3C7] text-[#B45309]',
      blue: 'bg-[#DBEAFE] text-[#1D4ED8]',
      purple: 'bg-[#F3E8FF] text-[#7E22CE]',
      emerald: 'bg-[#D1FAE5] text-[#047857]',
    }[app.theme];

    const IconComponent = {
      sofa: Sofa,
      calculator: Calculator,
      monitor: MonitorPlay,
      book: BookOpen,
      sparkles: Sparkles,
    }[app.iconType];

    return (
      <div
        className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 ${colorClasses}`}
      >
        <IconComponent className="w-6 h-6 stroke-[2.2]" />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB] text-slate-900">
      {/* Top Bar Contract matching App Qu Group visual identity */}
      <header className="bg-gradient-to-r from-[#1233C4] via-[#1C44E2] to-[#172FB0] text-white shadow-md">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Title */}
          <a
            href="#katalog"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('katalog');
            }}
            className="flex items-center gap-3.5 text-white hover:opacity-95 transition-opacity"
          >
            <span className="w-11 h-11 rounded-2xl bg-white text-[#1842DC] flex items-center justify-center font-extrabold text-2xl shadow-xs shrink-0">
              Q
            </span>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight whitespace-nowrap">
              App Qu Group
            </span>
          </a>

          {/* Zone 2: Quick Top Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-blue-100">
            <button
              type="button"
              onClick={() => setActiveTab('katalog')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'katalog' ? 'text-white underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Katalog Web
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tools')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'tools' ? 'text-white underline underline-offset-8 decoration-2' : ''
              }`}
            >
              AI App Builder
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tutorial')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'tutorial' ? 'text-white underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Video & Artikel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tentang')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'tentang' ? 'text-white underline underline-offset-8 decoration-2' : ''
              }`}
            >
              GitHub index.html
            </button>
          </nav>

          {/* Zone 3: Primary Action (Live Preview & Download Master index.html for GitHub) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenMasterPortalPreview}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview & Unduh index.html</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-[1180px] w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* 4 Iconic Navigation Cards from App Qu Group Screenshot */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8"
          role="tablist"
          aria-label="Menu Utama App Qu Group"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'katalog'}
            onClick={() => setActiveTab('katalog')}
            className={`group rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'katalog'
                ? 'bg-[#1B57EC] text-white shadow-lg shadow-blue-600/25 border border-[#1B57EC]'
                : 'bg-white text-slate-800 border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/30'
            }`}
          >
            <Layers
              className={`w-6 h-6 ${
                activeTab === 'katalog' ? 'text-white' : 'text-[#1B57EC]'
              }`}
            />
            <span className="text-sm font-bold tracking-tight whitespace-nowrap">Katalog</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tools'}
            onClick={() => setActiveTab('tools')}
            className={`group rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-[#1B57EC] text-white shadow-lg shadow-blue-600/25 border border-[#1B57EC]'
                : 'bg-white text-slate-800 border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/30'
            }`}
          >
            <Briefcase
              className={`w-6 h-6 ${
                activeTab === 'tools' ? 'text-white' : 'text-[#1B57EC]'
              }`}
            />
            <span className="text-sm font-bold tracking-tight whitespace-nowrap">Tools AI</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tutorial'}
            onClick={() => setActiveTab('tutorial')}
            className={`group rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'tutorial'
                ? 'bg-[#1B57EC] text-white shadow-lg shadow-blue-600/25 border border-[#1B57EC]'
                : 'bg-white text-slate-800 border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/30'
            }`}
          >
            <GraduationCap
              className={`w-6 h-6 ${
                activeTab === 'tutorial' ? 'text-white' : 'text-[#059669]'
              }`}
            />
            <span className="text-sm font-bold tracking-tight whitespace-nowrap">Tutorial</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tentang'}
            onClick={() => setActiveTab('tentang')}
            className={`group rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'tentang'
                ? 'bg-[#1B57EC] text-white shadow-lg shadow-blue-600/25 border border-[#1B57EC]'
                : 'bg-white text-slate-800 border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/30'
            }`}
          >
            <Info
              className={`w-6 h-6 ${
                activeTab === 'tentang' ? 'text-white' : 'text-[#D97706]'
              }`}
            />
            <span className="text-sm font-bold tracking-tight whitespace-nowrap">Tentang</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: KATALOG WEB APP + LIVE PREVIEW SEBELUM DOWNLOAD   */}
        {/* ========================================================= */}
        {activeTab === 'katalog' && (
          <div className="space-y-7">
            {/* Section Title & Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Daftar Web App Qu Group
                </h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  Uji coba aplikasi secara langsung di <strong>Live Preview</strong> sebelum mengunduh kode sumber HTML siap pakai.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari aplikasi web..."
                    className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 w-48 sm:w-56"
                  />
                </div>
                <span className="text-sm font-semibold text-slate-500 tabular-nums whitespace-nowrap">
                  {filteredApps.length} Aplikasi Aktif
                </span>
              </div>
            </div>

            {/* Category Filter Controls */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowInlineDock((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>
                  {showInlineDock ? 'Sembunyikan Panel Live Preview Cepat' : 'Tampilkan Panel Live Preview Cepat'}
                </span>
              </button>
            </div>

            {/* App Catalog 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredApps.map((app) => {
                const isSelectedInline = app.id === inlinePreviewAppId && showInlineDock;
                return (
                  <article
                    key={app.id}
                    className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
                      isSelectedInline
                        ? 'border-blue-500 ring-2 ring-blue-500/15'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Card Top Row: Icon Box & Quiet Category Metadata */}
                      <div className="flex items-center justify-between gap-4 mb-5">
                        {renderAppIcon(app)}
                        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                          <span>{app.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{app.fileName}</span>
                        </div>
                      </div>

                      {/* App Title & Description */}
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                        {app.title}
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {app.description}
                      </p>

                      {/* Key Highlights */}
                      <ul className="space-y-1.5 mb-6">
                        {app.highlights.map((item, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Footer Divider: Version on Left, Live Preview & Download Actions on Right */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-xs font-semibold text-slate-400 tabular-nums">
                        {app.version}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setInlinePreviewAppId(app.id);
                            setShowInlineDock(true);
                          }}
                          title="Tampilkan di Panel Preview Bawah"
                          className="px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Preview Cepat
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDirectDownload(app)}
                          title={`Unduh langsung ${app.fileName}`}
                          className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                          aria-label={`Unduh ${app.title}`}
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setPreviewApp(app)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1B57EC] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                        >
                          <span>Buka App</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Inline Live Preview Dock ("Live Preview Sebelum Download") */}
            {showInlineDock && activeInlineApp && (
              <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs mt-8">
                <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold">
                          Live Preview Interaktif: {activeInlineApp.title}
                        </h3>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-blue-400 font-mono">
                          {activeInlineApp.fileName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Coba langsung fungsi aplikasi di bawah ini sebelum mengunduh file HTML
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Quick App Selector inside Dock */}
                    <select
                      value={activeInlineApp.id}
                      onChange={(e) => setInlinePreviewAppId(e.target.value)}
                      aria-label="Pilih aplikasi untuk di-preview"
                      className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none"
                    >
                      {apps.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title} ({a.version})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setInlineViewport('desktop')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                          inlineViewport === 'desktop'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setInlineViewport('mobile')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                          inlineViewport === 'mobile'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>HP</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewApp(activeInlineApp)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 whitespace-nowrap cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Layar Penuh & Edit Kode</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDirectDownload(activeInlineApp, 'index.html')}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download index.html</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-200/70 p-3 sm:p-5 flex justify-center">
                  <div
                    className={`bg-white overflow-hidden transition-all duration-200 shadow-md ${
                      inlineViewport === 'mobile'
                        ? 'w-[390px] h-[560px] rounded-3xl border-4 border-slate-800'
                        : 'w-full h-[540px] rounded-xl border border-slate-300'
                    }`}
                  >
                    <iframe
                      title={`Inline Preview ${activeInlineApp.title}`}
                      srcDoc={activeInlineApp.htmlCode}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-modals allow-forms"
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TOOLS AI (AI WEB APP BUILDER & PROMPT COACH)       */}
        {/* ========================================================= */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: AI Single-File HTML Web App Generator */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900">
                    AI Web App Builder + Live Preview
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Ketik aplikasi yang ingin Anda buat, uji di Live Preview, lalu download file{' '}
                    <code className="font-mono text-blue-700">index.html</code>-nya.
                  </p>
                </div>
              </div>

              <form onSubmit={handleGenerateNewApp} className="space-y-4 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Aplikasi (Opsional)
                    </label>
                    <input
                      type="text"
                      value={builderTitle}
                      onChange={(e) => setBuilderTitle(e.target.value)}
                      placeholder="Misal: KasirQu Warung Kopi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kategori Aplikasi
                    </label>
                    <select
                      value={builderCategory}
                      onChange={(e) => setBuilderCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="Utility App">Utility App</option>
                      <option value="Business Web">Business Web</option>
                      <option value="Web 3D App">Web 3D App</option>
                      <option value="EdTech Web">EdTech Web</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Deskripsi & Fitur Aplikasi yang Diinginkan
                  </label>
                  <textarea
                    rows={4}
                    value={builderPrompt}
                    onChange={(e) => setBuilderPrompt(e.target.value)}
                    placeholder="Contoh: Buatkan aplikasi kasir laundry kiloan dengan pilihan paket cuci kering, cuci setrika, kilat, hitung total harga otomatis dalam Rupiah, dan tabel antrean pelanggan..."
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Quick Example Prompts */}
                <div>
                  <span className="block text-xs font-semibold text-slate-500 mb-2">
                    Ide Cepat (Klik untuk mengisi):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        title: 'KasirQu Kedai Kopi',
                        cat: 'Business Web',
                        prompt:
                          'Aplikasi POS kasir kedai kopi dengan daftar menu kopi & snack, keranjang pesanan, hitung diskon & kembalian Rupiah, serta struk digital.',
                      },
                      {
                        title: 'Catatan Keuangan UMKM',
                        cat: 'Utility App',
                        prompt:
                          'Aplikasi pencatat pemasukan dan pengeluaran harian UMKM dengan saldo otomatis, filter kategori, dan grafik ringkasan.',
                      },
                      {
                        title: 'Kuis Pintar Matematika SD',
                        cat: 'EdTech Web',
                        prompt:
                          'Aplikasi latihan soal matematika interaktif dengan skor langsung, timer, dan pembahasan jawaban.',
                      },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setBuilderTitle(preset.title);
                          setBuilderCategory(preset.cat);
                          setBuilderPrompt(preset.prompt);
                        }}
                        className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        + {preset.title}
                      </button>
                    ))}
                  </div>
                </div>

                {builderError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {builderError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGeneratingApp || !builderPrompt.trim()}
                  className="w-full py-3 px-5 rounded-xl bg-[#1B57EC] hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  {isGeneratingApp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sedang Merancang Kode HTML & Membuka Live Preview...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Buat Web App & Buka Live Preview</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right 5 Cols: AI Prompt Coach for Beginners */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-1">
                  Asisten Penyusun Prompt AI
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mb-5">
                  Bingung menyusun kalimat perintah untuk AI? Masukkan ide singkat Anda, dan AI akan menyusunkan prompt yang rapi.
                </p>

                <form onSubmit={handleRunPromptCoach} className="space-y-3 mb-5">
                  <input
                    type="text"
                    value={coachIdea}
                    onChange={(e) => setCoachIdea(e.target.value)}
                    placeholder="Contoh: Aplikasi stok barang bengkel motor..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    disabled={isCoaching || !coachIdea.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                  >
                    {isCoaching ? 'Menyusun Struktur Prompt...' : 'Susun Prompt Terstruktur'}
                  </button>
                </form>

                {coachResult && (
                  <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-700">
                          Hasil Prompt Siap Pakai:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setBuilderPrompt(coachResult.structuredPrompt);
                              setBuilderTitle(coachIdea);
                            }}
                            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            Gunakan di Builder ←
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(coachResult.structuredPrompt);
                              setCopiedPrompt(true);
                              setTimeout(() => setCopiedPrompt(false), 2000);
                            }}
                            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            {copiedPrompt ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedPrompt ? 'Tersalin' : 'Salin'}</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-mono bg-white p-3 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                        {coachResult.structuredPrompt}
                      </p>
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-slate-700 mb-1">
                        Saran Fitur:
                      </span>
                      <ul className="space-y-1">
                        {coachResult.recommendedFeatures.map((f, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                            <span className="text-blue-600 font-bold">·</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs text-blue-900 bg-blue-50/80 border border-blue-200 p-3 rounded-xl">
                      <strong>Tips Belajar:</strong> {coachResult.learningTip}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Setiap aplikasi yang Anda buat di <strong>Tools AI</strong> otomatis tersimpan ke tab{' '}
                <strong>Katalog</strong> dan bisa langsung diuji di Live Preview.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TUTORIAL (VIDEO YOUTUBE & ARTIKEL BELAJAR SAMA AI) */}
        {/* ========================================================= */}
        {activeTab === 'tutorial' && (
          <div className="space-y-8">
            {/* Video Tutorial Section */}
            <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900">
                    Video Tutorial & Panduan Pembuatan Aplikasi AI
                  </h1>
                  <p className="text-sm text-slate-600">
                    Tonton panduan langkah demi langkah merancang aplikasi, menguji di Live Preview, hingga mengunggah ke GitHub.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-sm">
                    <iframe
                      src={activeVideo.embedUrl}
                      title={activeVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-4">{activeVideo.title}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {activeVideo.description}
                  </p>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-500">
                      Daftar Materi Video:
                    </span>
                    {VIDEO_TUTORIALS.map((vid) => (
                      <button
                        key={vid.id}
                        type="button"
                        onClick={() => setActiveVideo(vid)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                          activeVideo.id === vid.id
                            ? 'bg-blue-50/70 border-blue-500'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-blue-700">{vid.level}</span>
                          <span className="font-mono tabular-nums">{vid.duration}</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Play className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{vid.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="block text-xs font-bold text-slate-800 mb-2">
                      Poin Penting Materi Ini:
                    </span>
                    <ul className="space-y-1.5">
                      {activeVideo.keyTakeaways.map((pt, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Artikel & Tips Pilihan from Belajar-sama-ai/index.html */}
            <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">
                Artikel & Tips Pemrograman AI Terbaru
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Panduan praktis dari repositori Belajar-sama-ai untuk membantu pemula menguasai pembuatan aplikasi web.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-3">
                  {TUTORIAL_ARTICLES.map((art) => (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedArticleId === art.id
                          ? 'bg-blue-50/70 border-blue-500'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span>{art.category}</span>
                        <span>·</span>
                        <span>{art.date}</span>
                        <span>·</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{art.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{art.summary}</p>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-7">
                  {TUTORIAL_ARTICLES.filter((a) => a.id === selectedArticleId).map((article) => (
                    <article
                      key={article.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4"
                    >
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-blue-700">{article.category}</span>
                        <span>·</span>
                        <span>Dipublikasikan: {article.date}</span>
                        <span>·</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {article.title}
                      </h3>
                      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                        {article.content.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>

                      <div className="bg-white border border-blue-200 rounded-xl p-4 mt-4">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold text-blue-900">
                            Contoh Prompt dari Artikel Ini:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setBuilderPrompt(article.samplePrompt);
                              setActiveTab('tools');
                            }}
                            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            Coba Buat di Tools AI →
                          </button>
                        </div>
                        <p className="text-xs font-mono text-slate-700">{article.samplePrompt}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: TENTANG & EXPORT MASTER INDEX.HTML UNTUK GITHUB    */}
        {/* ========================================================= */}
        {activeTab === 'tentang' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#1B57EC] text-white flex items-center justify-center font-extrabold text-xl">
                  Q
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900">
                    Tentang App Qu Group & Belajar Sama AI
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Ekosistem Katalog Web App, Studio Live Preview, dan Pembelajaran Pemrograman AI Mandiri
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>App Qu Group</strong> dirancang khusus untuk mempermudah kreator, pelaku UMKM, dan pembelajar mandiri dalam mencoba, memodifikasi, dan mengunduh aplikasi berbasis web (HTML5, CSS, dan JavaScript) secara instan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    1. Live Preview Sebelum Download
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Setiap aplikasi di dalam katalog dapat dijalankan secara interaktif dalam mode Desktop, Tablet, maupun Smartphone sebelum Anda mengunduh file{' '}
                    <code className="font-mono">index.html</code>.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    2. Inspeksi & Modifikasi Kode AI
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Buka tampilan Split View di dalam Live Preview untuk mengedit langsung kode HTML atau meminta AI menambahkan fitur baru secara real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-2">
                  <FileCode className="w-4 h-4" />
                  <span>Integrasi GitHub Repository</span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-2">
                  Unduh Master <code className="font-mono text-blue-700">index.html</code> untuk GitHub
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Ingin memasang tampilan lengkap <strong>App Qu Group</strong> beserta fitur Live Preview ini di repositori GitHub{' '}
                  <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                    hendribageur20-maker/Belajar-sama-ai
                  </code>
                  ? Anda dapat melakukan Live Preview lalu mengunduh file tunggal{' '}
                  <code className="font-mono">index.html</code> di bawah ini.
                </p>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleOpenMasterPortalPreview}
                    className="w-full py-3 px-4 rounded-xl bg-[#1B57EC] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Live Preview & Download Master index.html</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const html = buildMasterAppQuGroupHtml(apps);
                      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'index.html';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Langsung index.html (Siap Upload GitHub)</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                Kompatibel penuh dengan GitHub Pages tanpa memerlukan instalasi server tambahan.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200/80 bg-white mt-12 py-5 px-4 sm:px-6">
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© 2026 App Qu Group · Belajar Sama AI. Seluruh aplikasi dapat diuji di Live Preview sebelum diunduh.</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('katalog')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Katalog
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tools')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Tools AI
            </button>
            <button
              type="button"
              onClick={handleOpenMasterPortalPreview}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Unduh Master index.html
            </button>
          </div>
        </div>
      </footer>

      {/* Full-Screen Interactive Live Preview & Code Studio Modal */}
      <LivePreviewModal
        app={previewApp}
        onClose={() => setPreviewApp(null)}
        onUpdateAppHtml={handleUpdateAppHtml}
      />
    </div>
  );
}
