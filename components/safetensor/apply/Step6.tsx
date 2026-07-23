'use client';

import { useState } from 'react';
import Toast from '../Toast';
import { addRelations, RelationEntry } from '@/lib/safetensor/mockApis';

export interface Step6Data {
  added: boolean;
}

interface Props {
  onNext: (data: Step6Data) => void;
  onBack: () => void;
}

type ToastState = { message: string; type: 'error' | 'success' | 'info' } | null;

const RELATIONSHIP_OPTIONS = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'friend', label: 'Friend' },
];

const EMPTY_RELATION: RelationEntry = { name: '', phone: '', relationship_type: '' };

function RelationForm({
  index,
  relation,
  onChange,
}: {
  index: number;
  relation: RelationEntry;
  onChange: (r: RelationEntry) => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-blue-100 bg-white p-4 space-y-3">
      <p className="text-xs font-bold text-blue-900">Reference {index + 1}</p>

      <div>
        <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Name *</label>
        <input
          value={relation.name}
          onChange={(e) => onChange({ ...relation, name: e.target.value })}
          placeholder="Full name"
          className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Mobile Number *</label>
        <input
          value={relation.phone}
          onChange={(e) => onChange({ ...relation, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
          placeholder="10-digit mobile number"
          inputMode="numeric"
          className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Relation *</label>
        <select
          value={relation.relationship_type}
          onChange={(e) => onChange({ ...relation, relationship_type: e.target.value })}
          className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all bg-white"
        >
          <option value="" disabled>Select relation</option>
          {RELATIONSHIP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function Step6({ onNext, onBack }: Props) {
  const [relations, setRelations] = useState<RelationEntry[]>([EMPTY_RELATION, EMPTY_RELATION, EMPTY_RELATION]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  function updateRelation(i: number, r: RelationEntry) {
    setRelations((prev) => prev.map((existing, idx) => (idx === i ? r : existing)));
  }

  function validate(): string | null {
    for (let i = 0; i < relations.length; i++) {
      const r = relations[i];
      if (r.name.trim().length < 2) return `Reference ${i + 1}: please enter a valid name.`;
      if (!/^[6-9]\d{9}$/.test(r.phone)) return `Reference ${i + 1}: please enter a valid 10-digit mobile number.`;
      if (!r.relationship_type) return `Reference ${i + 1}: please select a relation.`;
    }
    return null;
  }

  async function handleSubmit() {
    const error = validate();
    if (error) {
      setToast({ message: error, type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await addRelations(relations);
      if (!res.success) {
        setToast({ message: res.message || 'Failed to save references. Please try again.', type: 'error' });
        return;
      }
      onNext({ added: true });
    } catch {
      setToast({ message: 'Something went wrong while saving. Please check your connection and try again.', type: 'error' });
    } finally {
      setSubmitting(false);
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
        Please provide 3 references who can vouch for you. We may contact them only if we&apos;re unable to reach you.
      </p>

      <div className="space-y-3">
        {relations.map((relation, i) => (
          <RelationForm key={i} index={i} relation={relation} onChange={(r) => updateRelation(i, r)} />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 border-2 border-blue-200 text-blue-600 font-semibold py-3.5 rounded-xl hover:bg-blue-50 disabled:opacity-40 transition-colors text-sm"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              Submitting…
            </>
          ) : (
            'Submit Application →'
          )}
        </button>
      </div>
    </div>
  );
}
