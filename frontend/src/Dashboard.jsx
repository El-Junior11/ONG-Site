import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-[80vh] bg-sky-50/30 p-6 md:p-12 text-left">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-sky-100 mb-8">
          <span className="text-sky-600 font-bold text-xs uppercase tracking-[0.3em]">Espace Gestionnaire</span>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mt-1">Dashboard Admin</h1>
          <p className="text-sm text-slate-600 mt-2">Tongasoa soa eto amin'ny sehatra fitantanana ny ONG Tsinjo Aina Fianarantsoa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600">Total Interventions</h3>
            <p className="text-3xl font-black text-slate-900 mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600">Groupes de Solidarité</h3>
            <p className="text-3xl font-black text-slate-900 mt-2">24</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600">Membres Actifs</h3>
            <p className="text-3xl font-black text-slate-900 mt-2">350+</p>
          </div>
        </div>
      </div>
    </div>
  );
}