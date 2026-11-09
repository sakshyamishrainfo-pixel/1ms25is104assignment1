import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ResearchMate AI',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Download project archive for GitHub
app.get('/api/project/download-zip', (_req, res) => {
  const zipPath = path.resolve(__dirname, 'researchmate-ai-github.zip');
  if (!fs.existsSync(zipPath)) {
    return res.status(404).json({ error: 'Project archive not found.' });
  }
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="researchmate-ai-github.zip"');
  return res.sendFile(zipPath);
});

async function callGeminiWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1500
): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isRetryable =
        err?.status === 503 ||
        err?.status === 429 ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.message?.includes('RESOURCE_EXHAUSTED');

      if (isRetryable && attempt < maxRetries) {
        console.warn(`[Gemini API] Retryable error (${err?.message || err?.status}) on attempt ${attempt}. Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

const researchPaperSchema = {
  type: Type.OBJECT,
  properties: {
    paperTitle: {
      type: Type.STRING,
      description: 'Formal scholarly title for the research paper',
    },
    abstract: {
      type: Type.STRING,
      description: 'Comprehensive academic abstract (200-280 words)',
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4-6 academic keywords or MeSH/ACM index terms',
    },
    introduction: {
      type: Type.STRING,
      description: 'Detailed introduction outlining scientific context, significance, and scope',
    },
    problemStatement: {
      type: Type.STRING,
      description: 'Rigorous articulation of the specific problem, bottlenecks, and research gap',
    },
    researchObjectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3-5 concrete, actionable research objectives',
    },
    literatureReview: {
      type: Type.STRING,
      description: 'Thematic synthesis of existing literature and theoretical foundations',
    },
    researchMethodology: {
      type: Type.OBJECT,
      properties: {
        approach: {
          type: Type.STRING,
          description: 'Methodological framework (e.g. experimental, observational, computational simulation)',
        },
        dataCollectionOrSetup: {
          type: Type.STRING,
          description: 'Data sets, sample population, laboratory apparatus, or simulation configuration',
        },
        analyticalProcedure: {
          type: Type.STRING,
          description: 'Step-by-step analytical algorithm, pipeline, or experimental protocol',
        },
        evaluationMetrics: {
          type: Type.STRING,
          description: 'Quantitative benchmarks, statistical significance thresholds, and evaluation criteria',
        },
        ethicalAndValidityConsiderations: {
          type: Type.STRING,
          description: 'Threats to internal/external validity and ethical compliance measures',
        },
      },
      required: [
        'approach',
        'dataCollectionOrSetup',
        'analyticalProcedure',
        'evaluationMetrics',
        'ethicalAndValidityConsiderations',
      ],
    },
    expectedResults: {
      type: Type.OBJECT,
      properties: {
        hypothesizedOutcomes: {
          type: Type.STRING,
          description: 'Predicted outcomes framed strictly as hypotheses and expected trends',
        },
        theoreticalSignificance: {
          type: Type.STRING,
          description: 'Theoretical, computational, or clinical significance of findings if confirmed',
        },
        prospectiveDistinction: {
          type: Type.STRING,
          description: 'Explicit statement emphasizing that these are hypothesized predictions, not empirical measurements',
        },
      },
      required: [
        'hypothesizedOutcomes',
        'theoreticalSignificance',
        'prospectiveDistinction',
      ],
    },
    conclusion: {
      type: Type.STRING,
      description: 'Scholarly synthesis, limitations summary, and prospective research directions',
    },
    references: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Ref identifier e.g. [1], [2]' },
          authors: { type: Type.STRING, description: 'Real verified authors or author group' },
          year: { type: Type.STRING, description: 'Year of publication' },
          title: { type: Type.STRING, description: 'Authentic title of work' },
          source: { type: Type.STRING, description: 'Journal, conference, or institutional repository' },
          doiOrUrl: { type: Type.STRING, description: 'Verified DOI/URL or empty string if unverified' },
          verificationStatus: {
            type: Type.STRING,
            description: 'Either "verified_landmark" or "proposed_benchmark_unverified"',
          },
          verificationNote: {
            type: Type.STRING,
            description: 'Explanation of landmark verification or database verification instructions',
          },
        },
        required: [
          'id',
          'authors',
          'year',
          'title',
          'source',
          'verificationStatus',
          'verificationNote',
        ],
      },
    },
    academicRigorNotice: {
      type: Type.STRING,
      description: 'Mandatory statement regarding academic honesty and citation verification requirement',
    },
  },
  required: [
    'paperTitle',
    'abstract',
    'keywords',
    'introduction',
    'problemStatement',
    'researchObjectives',
    'literatureReview',
    'researchMethodology',
    'expectedResults',
    'conclusion',
    'references',
    'academicRigorNotice',
  ],
};

// Endpoint: Generate complete structured research paper proposal
app.post('/api/research/generate', async (req, res) => {
  console.log('[API] /api/research/generate called. Body:', req.body);
  try {
    const { topic, field, customField } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({
        error: 'A valid research topic is required.',
      });
    }

    const effectiveField = field === 'Other' && customField ? customField.trim() : field || 'General Science';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in server environment. Please configure your key in Settings > Secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are an elite academic research advisor and senior scholar for premier journals (IEEE, Nature, ACM, Lancet, Harvard Business Review).
Your mission is to generate a comprehensive, publication-grade research paper proposal for students and academic researchers.

STRICT RESEARCH ACCURACY & INTEGRITY RULES:
1. CITATION INTEGRITY: NEVER fabricate, hallucinate, or invent authors, papers, conference titles, DOIs, or citations.
2. VERIFICATION STATUS:
   - Mark a reference as "verified_landmark" ONLY if it is an authentic, universally recognized seminal paper in scientific literature (e.g. Vaswani et al. 2017 for Transformers, Shannon 1948 for Information Theory, Rumelhart et al. 1986 for Backprop, He et al. 2016 for ResNet, Watson & Crick 1953, etc.). Include true authors, true title, and real source.
   - For all other references where exact details cannot be independently verified with 100% certainty, set "verificationStatus" to "proposed_benchmark_unverified". In the "verificationNote", explicitly instruct the researcher to search for this recommended literature query in databases such as Google Scholar, IEEE Xplore, PubMed, or Scopus prior to final submission.
3. PROPOSED VS EMPIRICAL FINDINGS:
   - You MUST clearly distinguish proposed/hypothesized research from actual empirical findings.
   - In "Expected Results", explicitly formulate hypotheses and predicted trends (e.g. "The proposed architecture is hypothesized to reduce computational overhead by...", "Anticipated results suggest..."). State unmistakably that empirical validation is pending physical/computational experimentation.
4. RIGOROUS SCHOLARLY TONE:
   - Provide depth, precise domain terminology, clear mathematical/methodological formulations, and concrete experimental designs rather than generic platitudes.
   - Structure the methodology with concrete setup, parameters, evaluation metrics, and threats to validity.`;

    const prompt = `Generate a rigorous, graduate-level research paper proposal for the following topic and field:

Topic: "${topic.trim()}"
Academic Field: ${effectiveField}

Ensure all required sections are thoroughly detailed:
- Formal academic Paper Title
- Scholarly Abstract (concise, 200-280 words, stating context, problem, proposed methodology, and hypothesized impact)
- 4-6 academic Keywords
- Introduction (background, motivation, scientific significance)
- Problem Statement (precise formulation of the core research challenge and current gaps in literature)
- Research Objectives (3-5 concrete, bulleted, measurable goals)
- Literature Review (thematic critique of existing paradigms and what remains unaddressed)
- Research Methodology (comprehensive design including: paradigm/approach, data/materials/experimental setup, analytical procedure/algorithms, evaluation metrics, and validity/ethical considerations)
- Expected Results (hypothesized outcomes, theoretical contributions, and explicit prospective distinction confirming experimental verification is required)
- Conclusion (synthesis, academic roadmap, and future research vectors)
- References (genuine landmark publications marked "verified_landmark" or recommended literature benchmarks marked "proposed_benchmark_unverified" with clear verification notes. Never invent fake DOIs or authors!)
- Academic Rigor Notice (reminder regarding empirical validation and citation verification)`;

    const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let rawJson: string | undefined;
    let lastError: any;

    for (const model of models) {
      try {
        console.log(`[API] Attempting research generation with model: ${model}...`);

        // Generous 25s timeout per candidate to prevent hanging connections while allowing thorough synthesis
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout with model ${model}`)), 25000)
        );

        const callPromise = ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: researchPaperSchema,
          },
        });

        const resp = await Promise.race([callPromise, timeoutPromise]);
        if (resp && resp.text) {
          rawJson = resp.text;
          console.log(`[API] Generation succeeded with model: ${model}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[API] Model ${model} encountered issue (${err?.message || err}). Trying next model...`);
        lastError = err;
      }
    }

    if (!rawJson) {
      throw lastError || new Error('Failed to generate research proposal from AI service.');
    }

    const parsedData = JSON.parse(rawJson);

    // Assemble final response with ID and metadata
    const generatedPaper = {
      id: `paper-${Date.now()}`,
      topic: topic.trim(),
      field,
      customField: customField?.trim() || undefined,
      createdAt: new Date().toISOString(),
      ...parsedData,
    };

    return res.json({
      success: true,
      paper: generatedPaper,
    });
  } catch (err: any) {
    console.error('Error generating research paper proposal:', err);
    const errorMessage = err?.message || 'An unexpected error occurred during research generation.';
    return res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV !== 'production' ? String(err) : undefined,
    });
  }
});

// Production vs Development static and middleware serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  // Vite dev middleware
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`ResearchMate AI server listening on http://0.0.0.0:${port}`);
});
