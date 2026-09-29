import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { VisitorTable } from './components/VisitorTable';
import { VisitorModal } from './components/VisitorModal';
import { VisitorPassModal } from './components/VisitorPassModal';
import { AuthPage } from './components/AuthPage';
import { exportToCSV } from './services/exportService';
import { isToday } from './utils/dateUtils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api/visitors';

export default function App() {
  // Authentication state (persisted in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('visitor_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'inPremises' | 'today' | 'checkedOut'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [selectedPassVisitor, setSelectedPassVisitor] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  // Safe response parser to avoid 'Unexpected end of JSON input'
  const parseResponse = async (res) => {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { message: text || 'Invalid server response' };
    }
  };

  // 1. Fetch visitors from backend (only if logged in)
  const fetchVisitors = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Failed to load visitors');
      setVisitors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast(
        'Backend offline. Please start backend on port 5000 (run start.bat or cd backend && npm start)',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchVisitors();
    }
  }, [user]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('visitor_user');
    localStorage.removeItem('visitor_auth_token');
    setUser(null);
    setVisitors([]);
  };

  // 2. Add or Update visitor
  const handleSaveVisitor = async (formData) => {
    try {
      if (editingVisitor) {
        // Edit (PUT)
        const id = editingVisitor._id || editingVisitor.id;
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await parseResponse(res);
        if (!res.ok) throw new Error(data.message || 'Update failed');
        setVisitors((prev) => prev.map((v) => ((v._id || v.id) === id ? data : v)));
        showToast('Visitor details updated successfully');
      } else {
        // Add (POST)
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await parseResponse(res);
        if (!res.ok) throw new Error(data.message || 'Failed to register visitor');
        setVisitors((prev) => [data, ...prev]);
        showToast('Visitor registered and checked in successfully');
        // Auto-show pass preview for newly registered visitor
        setSelectedPassVisitor(data);
      }

      setIsModalOpen(false);
      setEditingVisitor(null);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // 3. Check out visitor (PATCH)
  const handleCheckOut = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/checkout`, { method: 'PATCH' });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Checkout failed');
      setVisitors((prev) => prev.map((v) => ((v._id || v.id) === id ? data : v)));
      showToast(`${data.name || 'Visitor'} marked as Checked Out`);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // 4. Delete visitor (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this visitor record?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setVisitors((prev) => prev.filter((v) => (v._id || v.id) !== id));
      showToast('Visitor record deleted');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // 5. Export to CSV
  const handleExportCSV = () => {
    if (filteredVisitors.length === 0) {
      alert('No visitor records to export.');
      return;
    }
    exportToCSV(filteredVisitors, 'Visitor_Log');
    showToast(`Exported ${filteredVisitors.length} records to CSV`);
  };

  // Counts calculation
  const inPremisesCount = visitors.filter((v) => v.status === 'In Premises').length;
  const todayCount = visitors.filter((v) => isToday(v.checkInTime)).length;
  const checkedOutCount = visitors.filter((v) => v.status === 'Checked Out').length;
  const totalCount = visitors.length;

  const counts = {
    all: totalCount,
    inPremises: inPremisesCount,
    today: todayCount,
    checkedOut: checkedOutCount,
  };

  // Multi-tier filtering (Tab Filter + Search Text)
  const filteredVisitors = visitors.filter((v) => {
    // 1. Tab filter
    if (activeFilter === 'inPremises' && v.status !== 'In Premises') return false;
    if (activeFilter === 'today' && !isToday(v.checkInTime)) return false;
    if (activeFilter === 'checkedOut' && v.status !== 'Checked Out') return false;

    // 2. Search term
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (v.name || '').toLowerCase().includes(q) ||
      (v.mobile || '').includes(q) ||
      (v.company || '').toLowerCase().includes(q) ||
      (v.personToMeet || '').toLowerCase().includes(q) ||
      (v.purpose || '').toLowerCase().includes(q)
    );
  });

  // IF NOT LOGGED IN, RENDER RECEPTION AUTH PORTAL
  if (!user) {
    return <AuthPage onAuthSuccess={(userData) => setUser(userData)} />;
  }

  // IF LOGGED IN, RENDER RECEPTION DESK
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar Header */}
      <Navbar
        onOpenRegister={() => {
          setEditingVisitor(null);
          setIsModalOpen(true);
        }}
        onExportCSV={handleExportCSV}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* KPI Stats Overview Bar */}
        <StatsBar
          inPremisesCount={inPremisesCount}
          todayCount={todayCount}
          checkedOutCount={checkedOutCount}
          totalCount={totalCount}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* Main Visitors Table with Search & Actions */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-xs">
            <div className="inline-block w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading visitor records...</p>
            <p className="text-xs text-slate-400 mt-1">Fetching live data from database</p>
          </div>
        ) : (
          <VisitorTable
            visitors={filteredVisitors}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            onEdit={(visitor) => {
              setEditingVisitor(visitor);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
            onCheckOut={handleCheckOut}
            onViewPass={(visitor) => setSelectedPassVisitor(visitor)}
            onOpenRegister={() => {
              setEditingVisitor(null);
              setIsModalOpen(true);
            }}
            counts={counts}
          />
        )}
      </main>

      {/* Add / Edit Form Modal */}
      <VisitorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVisitor(null);
        }}
        onSave={handleSaveVisitor}
        visitorToEdit={editingVisitor}
      />

      {/* Digital Visitor Pass / Printable Badge Modal */}
      <VisitorPassModal
        isOpen={Boolean(selectedPassVisitor)}
        onClose={() => setSelectedPassVisitor(null)}
        visitor={selectedPassVisitor}
      />

      {/* Floating Toast Notification */}
      {toast.message && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg border text-xs sm:text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
