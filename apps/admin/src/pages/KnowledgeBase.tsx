import React, { useState } from 'react';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { BookOpen, Upload, CheckCircle2, ShieldCheck, Database, Cpu, Search, Sparkles, Filter } from 'lucide-react';

interface KnowledgeDoc {
  id: string;
  sourceName: string;
  category: string;
  title: string;
  content: string;
  madhhab: string;
  version: string;
  isApproved: boolean;
  uploadedAt: string;
}

const initialDocs: KnowledgeDoc[] = [
  {
    id: 'doc_101',
    sourceName: 'Al-Fiqh ala al-Madhahib al-Arbaah',
    category: 'FIQH_BOOK',
    title: 'Comparative Fiqh of Zakat & Mirath across 4 Sunni Schools',
    content: 'Standard reference text covering classical differences between Hanafi, Maliki, Shafi\'i, and Hanbali schools.',
    madhhab: 'ALL',
    version: '1.2.0',
    isApproved: true,
    uploadedAt: '2026-07-26 14:00',
  },
  {
    id: 'doc_102',
    sourceName: 'Wasa\'il al-Shia (Ja\'fari Jurisprudence)',
    category: 'FIQH_BOOK',
    title: 'Ja\'fari Fiqh of Inheritance and Real Estate Distribution',
    content: 'Authentic Ja\'fari reference covering land valuation and 3-class heir priority.',
    madhhab: 'JAFARI',
    version: '1.0.0',
    isApproved: true,
    uploadedAt: '2026-07-26 15:30',
  },
  {
    id: 'doc_103',
    sourceName: 'Surah An-Nisa Tafsir (Ibn Kathir)',
    category: 'QURAN_TAFSIR',
    title: 'Exegesis on Fixed Inheritance Fractions (Fard 4:11-12)',
    content: 'Detailed scholarly tafsir on Quranic fixed share fractions and agnatic priority.',
    madhhab: 'ALL',
    version: '2.0.0',
    isApproved: true,
    uploadedAt: '2026-07-27 10:15',
  },
  {
    id: 'doc_104',
    sourceName: 'Sahih al-Bukhari & Muslim Zakat Kitab',
    category: 'HADITH_SAHIH',
    title: 'Authentic Hadiths on Nisab Thresholds and 2.5% Rate',
    content: 'Complete collection of sahih hadiths establishing 85g gold and 595g silver Nisab rates.',
    madhhab: 'ALL',
    version: '1.5.0',
    isApproved: true,
    uploadedAt: '2026-07-27 12:45',
  },
];

export const KnowledgeBase: React.FC = () => {
  const [docs, setDocs] = useState<KnowledgeDoc[]>(initialDocs);
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newSourceName, setNewSourceName] = useState('');
  const [newCategory, setNewCategory] = useState('FIQH_BOOK');
  const [newMadhhab, setNewMadhhab] = useState('ALL');
  const [newContent, setNewContent] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSourceName || !newContent) return;

    const newDoc: KnowledgeDoc = {
      id: 'doc_' + Date.now(),
      sourceName: newSourceName,
      category: newCategory,
      title: newTitle,
      content: newContent,
      madhhab: newMadhhab,
      version: '1.0.0',
      isApproved: true,
      uploadedAt: new Date().toLocaleString(),
    };

    setDocs([newDoc, ...docs]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewSourceName('');
    setNewContent('');
  };

  const filteredDocs = docs.filter(
    d => d.title.toLowerCase().includes(search.toLowerCase()) ||
         d.sourceName.toLowerCase().includes(search.toLowerCase()) ||
         d.madhhab.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'Title & Reference',
      accessor: (d: KnowledgeDoc) => (
        <div>
          <p className="font-bold text-white leading-snug">{d.title}</p>
          <p className="text-xs text-[#C9A84C]">{d.sourceName}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (d: KnowledgeDoc) => (
        <Badge variant="info">{d.category}</Badge>
      ),
    },
    {
      header: 'Madhhab',
      accessor: (d: KnowledgeDoc) => (
        <Badge variant={d.madhhab === 'ALL' ? 'gold' : 'neutral'}>
          {d.madhhab}
        </Badge>
      ),
    },
    { header: 'Version', accessor: 'version' as const },
    {
      header: 'Status',
      accessor: (d: KnowledgeDoc) => (
        <Badge variant={d.isApproved ? 'success' : 'warning'}>
          {d.isApproved ? 'Approved & Indexed' : 'Pending Review'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#12291E] via-[#1A3328] to-[#12291E] p-8 rounded-2xl border border-[#1F4D36]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1 mb-1">
            <Sparkles size={14} /> Dual-RAG Vector Index
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Islamic Knowledge Base Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage indexed Islamic references, Fiqh books, and App Navigation sitemaps.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Upload size={18} className="mr-2 inline" /> Upload Reference Document
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Indexed Documents" value={docs.length.toString()} icon={<BookOpen size={22} />} trend={{ value: 12, isPositive: true }} />
        <StatCard title="Islamic RAG Hit Rate" value="96.4%" icon={<Database size={22} />} trend={{ value: 2.1, isPositive: true }} />
        <StatCard title="App Navigation Hit Rate" value="98.1%" icon={<Cpu size={22} />} trend={{ value: 1.5, isPositive: true }} />
        <StatCard title="Hallucination Rate" value="0.05%" icon={<ShieldCheck size={22} />} trend={{ value: 0.01, isPositive: false }} />
      </div>

      {/* Main Table Card */}
      <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or school..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <CheckCircle2 size={14} /> Vector Index Active (Dual-RAG Synchronized)
          </div>
        </div>

        <Table columns={columns} data={filteredDocs} onRowClick={doc => setSelectedDoc(doc)} />
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Reference Passage Details">
        {selectedDoc && (
          <div className="space-y-4">
            <div className="bg-[#091711] p-4 rounded-xl border border-[#1F4D36]">
              <p className="text-xs text-[#C9A84C] uppercase font-bold tracking-wider mb-1">{selectedDoc.sourceName}</p>
              <h4 className="text-lg font-bold text-white">{selectedDoc.title}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#091711] p-3 rounded-xl border border-[#1F4D36]">
                <span className="text-xs text-gray-400 block">Madhhab Attribution:</span>
                <span className="text-sm font-bold text-[#C9A84C]">{selectedDoc.madhhab}</span>
              </div>
              <div className="bg-[#091711] p-3 rounded-xl border border-[#1F4D36]">
                <span className="text-xs text-gray-400 block">Document Version:</span>
                <span className="text-sm font-bold text-white">{selectedDoc.version}</span>
              </div>
            </div>

            <div className="bg-[#091711] p-4 rounded-xl border border-[#1F4D36]">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Passage Content</p>
              <p className="text-sm text-gray-300 leading-relaxed font-mono">{selectedDoc.content}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload New Reference Document">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Document Title</label>
            <input
              type="text"
              required
              className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C]"
              placeholder="e.g. Al-Majmu' Zakat Ornaments Chapter"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Source Name</label>
              <input
                type="text"
                required
                className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C]"
                placeholder="e.g. Imam al-Nawawi"
                value={newSourceName}
                onChange={e => setNewSourceName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Madhhab Attribution</label>
              <select
                className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C]"
                value={newMadhhab}
                onChange={e => setNewMadhhab(e.target.value)}
              >
                <option value="ALL">ALL (Consensus)</option>
                <option value="HANAFI">Hanafi</option>
                <option value="MALIKI">Maliki</option>
                <option value="SHAFII">Shafi'i</option>
                <option value="HANBALI">Hanbali</option>
                <option value="JAFARI">Ja'fari</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Passage Content</label>
            <textarea
              rows={4}
              required
              className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C]"
              placeholder="Paste exact Quranic commentary or Fiqh text..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Upload & Index Document</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
