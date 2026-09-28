import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi di server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // Endpoint 1: Generate a complete standalone HTML5 web app from prompt
  app.post('/api/ai/generate-app', async (req, res) => {
    try {
      const { prompt, category, title } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt aplikasi wajib diisi.' });
        return;
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Buatkan aplikasi web satu file HTML lengkap (single-file HTML5 dengan CSS modern di dalam <style> dan JavaScript interaktif di dalam <script>) berdasarkan permintaan berikut:
Judul Aplikasi: ${title || 'Aplikasi Web AI'}
Kategori: ${category || 'Utility App'}
Deskripsi / Fitur yang diminta: ${prompt}

Persyaratan Wajib:
1. Kode HTML harus 100% lengkap dari <!DOCTYPE html> hingga </html> dan siap dijalankan langsung di browser atau diunduh sebagai index.html.
2. Desain antarmuka harus modern, rapi, responsif (nyaman di desktop maupun HP), menggunakan palet warna profesional yang bersih.
3. Semua tombol, kalkulasi, input, dan fitur di dalam aplikasi harus benar-benar berfungsi secara interaktif menggunakan JavaScript murni (vanilla JS), bukan sekadar tampilan statis.
4. Sertakan data contoh awal yang realistis dalam Bahasa Indonesia agar pengguna bisa langsung mencoba aplikasinya saat Live Preview.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Nama aplikasi web yang menarik dan relevan',
              },
              category: {
                type: Type.STRING,
                description: 'Kategori singkat aplikasi, misal Web 3D App, Utility App, Business Web, atau EdTech Web',
              },
              version: {
                type: Type.STRING,
                description: 'Versi aplikasi, misal v1.0 Ready',
              },
              description: {
                type: Type.STRING,
                description: 'Deskripsi singkat 1-2 kalimat tentang fungsi utama aplikasi dalam Bahasa Indonesia',
              },
              highlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 fitur unggulan dari aplikasi yang dibuat',
              },
              htmlCode: {
                type: Type.STRING,
                description: 'Kode sumber lengkap single-file HTML5 mulai dari <!DOCTYPE html> sampai </html>',
              },
            },
            required: ['title', 'category', 'version', 'description', 'highlights', 'htmlCode'],
          },
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (error: any) {
      console.error('Error generating web app:', error);
      res.status(500).json({
        error: error?.message || 'Gagal membuat aplikasi dengan AI. Silakan coba lagi.',
      });
    }
  });

  // Endpoint 2: Modify / refine an existing HTML app inside Live Preview
  app.post('/api/ai/refine-app', async (req, res) => {
    try {
      const { currentHtml, instruction, title } = req.body;
      if (!currentHtml || !instruction) {
        res.status(400).json({ error: 'Kode HTML dan instruksi perubahan wajib diisi.' });
        return;
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Berikut adalah kode sumber HTML aplikasi "${title || 'Web App'}":
\`\`\`html
${currentHtml}
\`\`\`

Tolong perbarui dan modifikasi kode HTML di atas sesuai instruksi pengguna berikut:
"${instruction}"

Pastikan seluruh fitur sebelumnya tetap berjalan baik dan kembalikan kode HTML lengkap dari <!DOCTYPE html> hingga </html>.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Penjelasan singkat perubahan yang telah diterapkan',
              },
              htmlCode: {
                type: Type.STRING,
                description: 'Kode HTML lengkap yang sudah diperbarui dari <!DOCTYPE html> hingga </html>',
              },
            },
            required: ['summary', 'htmlCode'],
          },
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (error: any) {
      console.error('Error refining web app:', error);
      res.status(500).json({
        error: error?.message || 'Gagal memodifikasi kode HTML dengan AI.',
      });
    }
  });

  // Endpoint 3: AI Prompt Coach for beginners ("Belajar Bikin App dengan AI")
  app.post('/api/ai/prompt-coach', async (req, res) => {
    try {
      const { idea } = req.body;
      if (!idea) {
        res.status(400).json({ error: 'Ide aplikasi wajib diisi.' });
        return;
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Pengguna pemula ingin belajar membuat aplikasi web dengan AI. Ide awal mereka adalah: "${idea}".
Bantu susun prompt yang sangat terstruktur, jelas, dan siap pakai agar hasil koding AI bebas error, lengkap dengan saran fitur dan penjelasan arsitektur sederhana.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              structuredPrompt: {
                type: Type.STRING,
                description: 'Kalimat prompt lengkap yang siap disalin atau dijalankan di AI App Builder',
              },
              recommendedFeatures: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 fitur utama yang disarankan untuk aplikasi tersebut',
              },
              learningTip: {
                type: Type.STRING,
                description: 'Tips belajar singkat agar pemula paham cara kerja kode aplikasi ini',
              },
            },
            required: ['structuredPrompt', 'recommendedFeatures', 'learningTip'],
          },
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in prompt coach:', error);
      res.status(500).json({
        error: error?.message || 'Gagal menyusun prompt AI.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
