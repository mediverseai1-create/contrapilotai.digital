'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const STAGES = [
  { title: 'Reading the contract…', msg: 'Extracting text from your document.' },
  { title: 'Scanning for risk…', msg: 'Comparing clauses against common contract patterns.' },
  { title: 'Writing up findings…', msg: 'Almost there — building your review.' },
];

export function NewReviewForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  async function submit(formData: FormData) {
    setError(null);
    setLimitReached(false);
    setAnalyzing(true);
    setStage(0);

    const stageTimer = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 4000);

    try {
      const res = await fetch('/api/contracts/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setLimitReached(res.status === 402);
        setAnalyzing(false);
        clearInterval(stageTimer);
        return;
      }

      if (data.contractId) {
        router.push(`/app/contracts/${data.contractId}`);
        return;
      }

      setError('Upload succeeded but no contract was returned.');
      setAnalyzing(false);
    } catch {
      setError('Network error — please try again.');
      setAnalyzing(false);
    } finally {
      clearInterval(stageTimer);
    }
  }

  function handleFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    submit(formData);
  }

  function handlePasteSubmit() {
    if (!pastedText.trim()) return;
    const formData = new FormData();
    formData.append('pastedText', pastedText);
    submit(formData);
  }

  if (analyzing) {
    return (
      <div className="upload-page">
        <div className="analyzing">
          <div className="spinner" />
          <h3>{STAGES[stage].title}</h3>
          <p>{STAGES[stage].msg}</p>
          <div className="stage">
            Stage {stage + 1} of {STAGES.length}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page">
      {error && (
        <div className="form-error" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <span>{error}</span>
          {limitReached && (
            <Link href="/pricing" className="btn btn-sm btn-primary" style={{ flexShrink: 0 }}>
              Upgrade
            </Link>
          )}
        </div>
      )}
      <div
        className={`upload-zone${dragging ? ' drag' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        <div className="drop-mark" />
        <h3>Drop a PDF or DOCX here</h3>
        <p>Or click to choose a file · Max 10 MB</p>
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.docx,.txt"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <button type="button" className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>
          Choose file
        </button>
      </div>

      <div className="upload-divider">Or paste the text</div>

      <div className="paste-box">
        <div className="field">
          <label htmlFor="paste-text">Contract text</label>
          <textarea
            id="paste-text"
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste the full contract text here — any prose contract in English works. The more complete the text, the more accurate the findings."
          />
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={handlePasteSubmit} disabled={!pastedText.trim()}>
          Analyze this contract
        </button>
      </div>
    </div>
  );
}
