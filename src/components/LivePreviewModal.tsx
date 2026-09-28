import React, { useState, useEffect } from 'react';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Code2,
  Eye,
  Columns,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Loader2,
  FileCode,
} from 'lucide-react';
import { CatalogApp } from '../data/catalogApps';

interface LivePreviewModalProps {
  app: CatalogApp | null;
  onClose: () => void;
  onUpdateAppHtml?: (appId: string, newHtml: string) => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  app,
  onClose,
  onUpdateAppHtml,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'preview' | 'split' | 'code'>('preview');
  const [editableHtml, setEditableHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // AI Live Modification inside Preview
  const [aiInstruction, setAiInstruction] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refineMessage, setRefineMessage] = useState<string | null>(null);
  const [refineError, setRefineError] = useState<string | null>(null);

  useEffect(() => {
    if (app) {
      setEditableHtml(app.htmlCode);
      setRefineMessage(null);
      setRefineError(null);
      setAiInstruction('');
    }
  }, [app]);

  if (!app) return null;

  const fileSizeKb = (new Blob([editableHtml]).size / 1024).toFixed(1);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(editableHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadHtml = (customFileName?: string) => {
    const blob = new Blob([editableHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = customFileName || app.fileName || 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetHtml = () => {
    setEditableHtml(app.htmlCode);
    setIframeKey((prev) => prev + 1);
    setRefineMessage('Kode dikembalikan ke versi awal.');
    setTimeout(() => setRefineMessage(null), 2500);
  };

  const handleAiRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInstruction.trim() || isRefining) return;

    setIsRefining(true);
    setRefineError(null);
    setRefineMessage(null);

    try {
      const response = await fetch('/api/ai/refine-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentHtml: editableHtml,
          instruction: aiInstruction.trim(),
          title: app.title,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal memodifikasi aplikasi dengan AI.');
      }

      if (data.htmlCode) {
        setEditableHtml(data.htmlCode);
        setIframeKey((prev) => prev + 1);
        if (onUpdateAppHtml) {
          onUpdateAppHtml(app.id, data.htmlCode);
        }
        setRefineMessage(data.summary || 'Perubahan AI berhasil diterapkan ke Live Preview!');
        setAiInstruction('');
      }
    } catch (err: any) {
      setRefineError(err.message || 'Terjadi kesalahan saat menghubungi server AI.');
    } finally {
      setIsRefining(false);
    }
  };

  const viewportWidthClass =
    viewport === 'desktop'
      ? 'w-full h-full'
      : viewport === 'tablet'
        ? 'w-[768px] max-w-full h-[94%] rounded-2xl shadow-2xl border-4 border-slate-800'
        : 'w-[390px] max-w-full h-[92%] rounded-3xl shadow-2xl border-[6px] border-slate-900';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="live-preview-title"
    >
      <div className="bg-white border border-slate-200 w-full max-w-[1380px] h-[94vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Studio Control Bar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              LP
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 id="live-preview-title" className="font-bold text-sm sm:text-base truncate">
                  {app.title}
                </h2>
                <span className="text-xs text-slate-400 hidden sm:inline">·</span>
                <span className="text-xs text-blue-400 font-mono hidden sm:inline tabular-nums">
                  {app.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Live Preview Interaktif Sebelum Download · Ukuran File:{' '}
                <span className="font-mono text-slate-200 tabular-nums">{fileSizeKb} KB</span>
              </p>
            </div>
          </div>

          {/* Center: Mode & Device Switchers */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  viewMode === 'preview'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  viewMode === 'split'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split Kode + Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  viewMode === 'code'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Kode HTML</span>
              </button>
            </div>

            {/* Viewport Device Switcher */}
            {viewMode !== 'code' && (
              <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  title="Tampilan Desktop (100%)"
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    viewport === 'desktop'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('tablet')}
                  title="Tampilan Tablet (768px)"
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    viewport === 'tablet'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  title="Tampilan HP / Mobile (390px)"
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    viewport === 'mobile'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">HP</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Download & Close Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadHtml('index.html')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download index.html</span>
            </button>
            {app.fileName !== 'index.html' && (
              <button
                type="button"
                onClick={() => handleDownloadHtml(app.fileName)}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Unduh {app.fileName}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Live Preview"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Quick Customization Bar inside Live Preview */}
        <form
          onSubmit={handleAiRefine}
          className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <input
              type="text"
              value={aiInstruction}
              onChange={(e) => setAiInstruction(e.target.value)}
              placeholder="Ingin ubah tampilan atau tambah fitur sebelum download? Ketik instruksi AI di sini..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={isRefining || !aiInstruction.trim()}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isRefining ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Update Preview dengan AI</span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {refineMessage && (
              <span className="text-xs text-emerald-700 font-medium">{refineMessage}</span>
            )}
            {refineError && <span className="text-xs text-red-600 font-medium">{refineError}</span>}
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium whitespace-nowrap cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kode Tersalin' : 'Salin HTML'}</span>
            </button>
            <button
              type="button"
              onClick={handleResetHtml}
              title="Reset ke kode awal"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </form>

        {/* Main Studio Body */}
        <div className="flex-1 flex overflow-hidden bg-slate-200/80">
          {/* Code Editor Pane (Shown in 'code' or 'split' mode) */}
          {(viewMode === 'code' || viewMode === 'split') && (
            <div
              className={`${
                viewMode === 'split' ? 'w-1/2 border-r border-slate-300' : 'w-full'
              } h-full flex flex-col bg-slate-950 text-slate-100`}
            >
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">
                  Editor Kode Sumber ({app.fileName}) — Perubahan langsung tampil di Live Preview
                </span>
                <span className="font-mono tabular-nums">{editableHtml.split('\n').length} baris</span>
              </div>
              <textarea
                value={editableHtml}
                onChange={(e) => setEditableHtml(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full p-4 bg-slate-950 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>
          )}

          {/* Live Preview Iframe Pane (Shown in 'preview' or 'split' mode) */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div
              className={`${
                viewMode === 'split' ? 'w-1/2' : 'w-full'
              } h-full flex items-center justify-center p-0 sm:p-3 overflow-auto`}
            >
              <div className={`${viewportWidthClass} bg-white overflow-hidden transition-all duration-200`}>
                <iframe
                  key={iframeKey}
                  title={`Live Preview ${app.title}`}
                  srcDoc={editableHtml}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-modals allow-forms"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
