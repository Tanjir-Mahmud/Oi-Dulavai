'use client';

import React, { useState } from 'react';
import { useAtelierStore } from '@/lib/store';
import { X, Ruler, CheckCircle } from 'lucide-react';

export function SizeGuideModal() {
  const { isSizeGuideOpen, closeSizeGuide } = useAtelierStore();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isSizeGuideOpen) return null;

  // Metric conversion multiplier
  const mult = unit === 'inches' ? 1 : 2.54;
  const round = (val: number) => (unit === 'inches' ? val.toFixed(1) : Math.round(val * 2.54));

  const rows = [
    { size: '38 (Small)', collar: 15.0, chest: 38.0, waist: 32.0, shoulder: 17.5, length: 40.0 },
    { size: '40 (Medium)', collar: 15.5, chest: 40.0, waist: 34.0, shoulder: 18.0, length: 42.0 },
    { size: '42 (Large)', collar: 16.0, chest: 42.0, waist: 36.0, shoulder: 18.5, length: 43.0 },
    { size: '44 (XL)', collar: 16.5, chest: 44.0, waist: 38.0, shoulder: 19.0, length: 44.0 },
    { size: '46 (XXL)', collar: 17.0, chest: 46.0, waist: 40.0, shoulder: 19.5, length: 45.0 },
  ];

  return (
    <>
      <div
        onClick={closeSizeGuide}
        className="fixed inset-0 bg-primary/70 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest max-w-2xl w-full border border-outline-variant shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-secondary" />
              <h3 className="font-headline-md text-headline-md uppercase tracking-tight font-bold text-on-surface">
                Atelier Sizing & Fitting Architecture
              </h3>
            </div>
            <button
              onClick={closeSizeGuide}
              className="text-on-surface-variant hover:text-primary transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-4 flex items-center justify-between">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Every garment cut adheres to the classical Savile Row-Dhaka architectural draft.
            </p>
            <div className="flex border border-outline-variant/60 font-spec-code-sm text-spec-code-sm">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 uppercase font-bold transition-colors ${
                  unit === 'inches' ? 'bg-secondary text-on-secondary' : 'hover:bg-surface-container-high'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 uppercase font-bold transition-colors ${
                  unit === 'cm' ? 'bg-secondary text-on-secondary' : 'hover:bg-surface-container-high'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-outline-variant/40">
            <table className="w-full text-left font-spec-code text-spec-code">
              <thead className="bg-surface-container-low border-b border-outline-variant/60 uppercase text-[11px] text-on-surface-variant">
                <tr>
                  <th className="p-3">Atelier Size</th>
                  <th className="p-3">Collar</th>
                  <th className="p-3">Chest</th>
                  <th className="p-3">Waist</th>
                  <th className="p-3">Shoulder</th>
                  <th className="p-3">Panjabi Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-on-surface">
                {rows.map((r) => (
                  <tr key={r.size} className="hover:bg-surface-container-low/50">
                    <td className="p-3 font-bold text-secondary">{r.size}</td>
                    <td className="p-3">{round(r.collar)}</td>
                    <td className="p-3">{round(r.chest)}</td>
                    <td className="p-3">{round(r.waist)}</td>
                    <td className="p-3">{round(r.shoulder)}</td>
                    <td className="p-3">{round(r.length)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-secondary-fixed/30 border border-secondary/30 p-4 space-y-2">
            <div className="flex items-center gap-2 font-label-caps text-label-caps uppercase text-secondary font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Complimentary 2-Size Dhaka Doorstep Trial</span>
            </div>
            <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
              Unsure between two sizes? Our Dhaka white-glove chauffeur will bring both sizes (e.g. Size 40 & 42) directly to your home or office. Try both, keep the perfect fit, and hand back the other with zero hassle.
            </p>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={closeSizeGuide}
              className="bg-primary text-on-primary px-6 py-2.5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SizeGuideModal;
