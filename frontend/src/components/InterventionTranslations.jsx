import { useState } from 'react';
import { Languages, Loader2, CheckCircle2 } from 'lucide-react';

import { LANGUAGES, translationLabels, getTranslations } from '../utils/interventionTranslations';

export default function InterventionTranslations({
  form, setForm, lang, busy, translating, onTranslate
}) {
  const tr = translationLabels(lang);
  const [active, setActive] = useState('fr');
  const items = getTranslations(form);
  const current = items[active] || {};
  const original = active === form.source_language;
  const count = LANGUAGES.filter(({ code }) =>
    items[code]?.title?.trim() && items[code]?.description?.trim()
  ).length;

  const inputClass = 'w-full rounded-xl border border-[#CDDCC4] bg-[#E8F0DF] px-4 py-3 text-sm outline-none focus:border-[#176B46] disabled:opacity-60';

  const changeSource = e => {
    const language = e.target.value;
    setForm(prev => ({
      ...prev, source_language: language, translations: {}
    }));
    setActive(language || 'fr');
  };

  const changeTranslation = (field, value) => {
    if (original) return;
    setForm(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [active]: { ...prev.translations[active], [field]: value }
      }
    }));
  };

  return (
    <section className="rounded-2xl border border-[#CDDCC4] bg-[#F0F5E9] p-4">
      <label htmlFor="source-language" className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#14532D]">
        <Languages size={18}/>{tr.source}
      </label>

      <select id="source-language" required value={form.source_language}
        disabled={busy} onChange={changeSource} className={inputClass}>
        <option value="">{tr.select}</option>
        {LANGUAGES.map(item => (
          <option key={item.code} value={item.code}>{item.flag} {item.label}</option>
        ))}
      </select>

      <button type="button" onClick={onTranslate}
        disabled={busy || !form.source_language || !form.title.trim() || !form.description.trim()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B46] px-4 py-3 text-sm font-semibold text-white hover:bg-[#103F30] disabled:opacity-50">
        {translating ? <Loader2 size={18} className="animate-spin"/> : <Languages size={18}/>}
        {translating ? tr.translating : tr.translate}
      </button>

      <div className="mb-2 mt-4 flex items-center justify-between text-xs font-medium text-[#14532D]">
        <span>{count}/4 {tr.completed}</span>
        {count === 4 && <CheckCircle2 size={18}/>}
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#CDDCC4]">
        <div className="h-full rounded-full bg-[#176B46] transition-all" style={{ width: `${count * 25}%` }}/>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {LANGUAGES.map(item => (
          <button key={item.code} type="button" onClick={() => setActive(item.code)}
            aria-pressed={active === item.code}
            className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${active === item.code ? 'bg-[#176B46] text-white' : 'bg-[#DCE9D3] text-[#14532D]'}`}>
            {item.flag} {item.code.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#14532D]">
          {tr.title}
          <input value={current.title || ''} readOnly={original} disabled={busy}
            onChange={e => changeTranslation('title', e.target.value)}
            className={`${inputClass} mt-1`}/>
        </label>
        <label className="block text-sm font-medium text-[#14532D]">
          {tr.description}
          <textarea rows={5} value={current.description || ''} readOnly={original}
            disabled={busy} onChange={e => changeTranslation('description', e.target.value)}
            className={`${inputClass} mt-1 resize-y`}/>
        </label>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[#64748B]">{tr.review}</p>
    </section>
  );
}
