'use client';

import { useRef, useState } from 'react';
import Toast from '../Toast';
import { uploadDocuments } from '@/lib/safetensor/mockApis';

export interface Step5Data {
  uploaded: boolean;
}

interface Props {
  loanId?: string;
  onNext: (data: Step5Data) => void;
  onBack: () => void;
}

type ToastState = { message: string; type: 'error' | 'success' | 'info' } | null;

interface DocSlot {
  key: string;
  label: string;
  hint: string;
}

const DOC_SLOTS: DocSlot[] = [
  { key: 'aadhaar_front', label: 'Aadhaar Card (Front)', hint: 'Clear photo or scan' },
  { key: 'aadhaar_back', label: 'Aadhaar Card (Back)', hint: 'Clear photo or scan' },
  { key: 'pan_card', label: 'PAN Card', hint: 'Clear photo or scan' },
  { key: 'bank_statement', label: 'Bank Statement', hint: 'Last 3 months, PDF preferred' },
  { key: 'salary_slip', label: 'Latest Salary Slip', hint: 'Most recent month' },
  { key: 'photo', label: 'Passport Size Photo', hint: 'Recent photograph' },
];

const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const ACCEPT_ATTR = '.jpg,.jpeg,.png,.webp,.pdf';
const MAX_FILE_BYTES = 20 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileSlot({
  slot,
  file,
  onSelect,
  onRemove,
  disabled,
}: {
  slot: DocSlot;
  file: File | null;
  onSelect: (f: File) => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!ACCEPTED_MIME.includes(f.type)) {
      setError('Only JPG, PNG, WEBP or PDF files are allowed.');
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError('File must be under 20 MB.');
      return;
    }
    setError('');
    onSelect(f);
  }

  const isImage = file && file.type.startsWith('image/');

  return (
    <div className={`rounded-2xl border-2 p-4 transition-all ${file ? 'border-green-300 bg-green-50' : 'border-blue-100 bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-semibold text-blue-800">{slot.label} *</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{slot.hint}</p>
        </div>
        {file && (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Added
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="w-full border-2 border-dashed border-blue-200 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-4 flex items-center justify-center gap-2 text-blue-500 text-xs font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Tap to upload
        </button>
      ) : (
        <div className="flex items-center gap-3 bg-white rounded-xl border border-green-200 px-3 py-2.5">
          <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0 overflow-hidden">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">{file.name}</p>
            <p className="text-[10px] text-gray-400">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="w-7 h-7 rounded-full hover:bg-red-50 disabled:opacity-40 flex items-center justify-center text-red-400 hover:text-red-600 shrink-0 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-medium mt-1.5">{error}</p>}
    </div>
  );
}

export default function Step5({ loanId, onNext, onBack }: Props) {
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const allSlotsFilled = DOC_SLOTS.every((s) => files[s.key]);

  async function handleSubmit() {
    if (!allSlotsFilled) {
      setToast({ message: 'Please upload all required documents.', type: 'error' });
      return;
    }
    if (!loanId) {
      setToast({ message: 'Missing loan reference — please restart your application.', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      const entries = DOC_SLOTS.map((s) => ({ documentType: s.key, file: files[s.key]! }));
      const res = await uploadDocuments(loanId, entries);
      if (!res.success) {
        setToast({ message: res.message || 'Failed to upload documents. Please try again.', type: 'error' });
        return;
      }
      onNext({ uploaded: true });
    } catch {
      setToast({ message: 'Something went wrong while uploading. Please check your connection and try again.', type: 'error' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="pt-2 pb-4 space-y-4">
      {toast && (
        <div className="sticky top-0 z-10 -mx-1">
          <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
        </div>
      )}

      <p className="text-xs text-gray-400 leading-relaxed">
        Upload clear photos or scans of the following documents to complete your application. JPG, PNG, WEBP or PDF · max 20 MB each.
      </p>

      <div className="space-y-3">
        {DOC_SLOTS.map((slot) => (
          <FileSlot
            key={slot.key}
            slot={slot}
            file={files[slot.key] ?? null}
            onSelect={(f) => setFiles((prev) => ({ ...prev, [slot.key]: f }))}
            onRemove={() => setFiles((prev) => ({ ...prev, [slot.key]: null }))}
            disabled={uploading}
          />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={uploading}
          className="flex-1 border-2 border-blue-200 text-blue-600 font-semibold py-3.5 rounded-xl hover:bg-blue-50 disabled:opacity-40 transition-colors text-sm"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={uploading || !allSlotsFilled}
          className="flex-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              Uploading…
            </>
          ) : (
            'Submit Application →'
          )}
        </button>
      </div>
    </div>
  );
}
