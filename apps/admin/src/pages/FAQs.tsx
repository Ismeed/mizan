import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit2, Trash2, HelpCircle, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const mockFaqs = [
  { id: '1', question: 'What is Nisab and how is it calculated?', answer: 'Nisab is the minimum threshold of wealth a Muslim must possess for one full lunar year (Hawl) before Zakat becomes obligatory. It is equivalent to 85 grams of pure gold or 595 grams of pure silver.', category: 'Zakat' },
  { id: '2', question: 'How are inheritance shares computed under Awl & Radd?', answer: 'Awl reduces all shares proportionally when total fixed Quranic shares exceed 1 (100%). Radd returns surplus remaining estate to eligible non-spouse Fard heirs when no agnates exist.', category: 'Inheritance' },
  { id: '3', question: 'Can I give Zakat to my siblings or relatives?', answer: 'Yes, giving Zakat to eligible poor brothers, sisters, uncles, or aunts yields double reward: Sadaqah and strengthening family ties (Silat al-Rahim). You cannot give Zakat to direct ascendants or descendants.', category: 'Zakat' },
];

export const FAQs: React.FC = () => {
  const [faqs, setFaqs] = useState(mockFaqs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'Zakat' });

  const handleSave = () => {
    if (!form.question || !form.answer) return;
    if (editingId) {
      setFaqs(faqs.map(f => f.id === editingId ? { ...f, ...form } : f));
    } else {
      setFaqs([...faqs, { id: Date.now().toString(), ...form }]);
    }
    setIsModalOpen(false);
    setForm({ question: '', answer: '', category: 'Zakat' });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#12291E] via-[#1A3328] to-[#12291E] p-8 rounded-2xl border border-[#1F4D36]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1 mb-1">
            <Sparkles size={14} /> Mobile Help Center
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions (FAQs)</h1>
          <p className="text-gray-400 text-sm mt-1">Manage expandable Q&A items displayed in the mobile app Learn tab.</p>
        </div>
        <Button onClick={() => { setEditingId(null); setForm({ question: '', answer: '', category: 'Zakat' }); setIsModalOpen(true); }}>
          <Plus size={18} className="mr-2 inline" /> Add FAQ Item
        </Button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="glass-card glass-card-hover rounded-2xl p-6 border-[#1F4D36] space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#1F4D36]/40 border border-[#1F4D36] text-[#C9A84C]">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <Badge variant="gold" className="mb-1">{faq.category}</Badge>
                  <h3 className="text-lg font-bold text-white leading-tight">{faq.question}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingId(faq.id); setForm(faq); setIsModalOpen(true); }}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1F4D36]/50 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-11">{faq.answer}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit FAQ Item' : 'Add New FAQ Item'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="Zakat">Zakat & Nisab</option>
              <option value="Inheritance">Inheritance (Mirath)</option>
              <option value="General">General Shariah Finance</option>
              <option value="App Navigation">App Features</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Question</label>
            <input
              type="text"
              required
              className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C]"
              placeholder="e.g. Is Zakat due on rented property?"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Answer</label>
            <textarea
              rows={4}
              required
              className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C] resize-none"
              placeholder="Provide clear Fiqh answer with scholarly reference..."
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#1F4D36]">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save FAQ Item</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
