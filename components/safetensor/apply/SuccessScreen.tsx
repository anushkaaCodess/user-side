interface Props {
  referenceId: string;
  onClose: () => void;
}

export default function SuccessScreen({ referenceId, onClose }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-2">
      {/* Animated checkmark */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-blue-900 mb-2">Application Submitted!</h2>
      <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
        Your loan application has been received and is under review. We&apos;ll get back to you within 24 hours.
      </p>

      {/* Reference ID */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 mb-6 w-full max-w-xs">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">Reference ID</p>
        <p className="text-xl font-bold text-blue-900 font-mono tracking-wider">{referenceId}</p>
        <p className="text-xs text-gray-400 mt-1">Save this for your records</p>
      </div>

      {/* What's next */}
      <div className="w-full max-w-xs space-y-3 mb-8 text-left">
        <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">What happens next?</p>
        {[
          { step: '1', text: 'Our team will review your application within 24 hours' },
          { step: '2', text: 'You will receive a call/SMS with the loan offer details' },
          { step: '3', text: 'On acceptance, funds are disbursed to your bank account' },
        ].map((s) => (
          <div key={s.step} className="flex items-start gap-3">
            <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
              {s.step}
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-md shadow-blue-200"
      >
        Done
      </button>

      <p className="text-xs text-gray-400 mt-4">
        Questions?{' '}
        <a href="#support" onClick={onClose} className="text-blue-500 hover:underline">
          Contact our support team
        </a>
      </p>
    </div>
  );
}
