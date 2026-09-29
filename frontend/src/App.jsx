import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VisitorTable } from './components/VisitorTable';
import { VisitorModal } from './components/VisitorModal';
import { AuthPage } from './components/AuthPage';
import { exportToCSV } from './services/exportService';
import { isToday } from './utils/dateUtils';

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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
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
      showToast('Backend offline. Please start backend on port 5000 (run start.bat or cd backend && npm start)');
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
        showToast('Visitor updated successfully');
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
        showToast('Visitor registered successfully');
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
      showToast(`${data.name || 'Visitor'} checked out`);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // 4. Delete visitor (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this visitor record?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setVisitors((prev) => prev.filter((v) => (v._id || v.id) !== id));
      showToast('Record deleted');
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

  // Filter by name or mobile number
  const filteredVisitors = visitors.filter((v) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (v.name || '').toLowerCase().includes(q) ||
      (v.mobile || '').includes(q)
    );
  });

  // Calculate quick stats
  const todayCount = visitors.filter((v) => isToday(v.checkInTime)).length;
  const inPremisesCount = visitors.filter((v) => v.status === 'In Premises').length;

  // IF NOT LOGGED IN, RENDER SIMPLE AUTH PAGE (LOGIN / SIGN UP)
  if (!user) {
    return <AuthPage onAuthSuccess={(userData) => setUser(userData)} />;
  }

  // IF LOGGED IN, RENDER RECEPTION DESK
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Simple Clean Header with User Info & Logout */}
      <Navbar
        onOpenRegister={() => {
          setEditingVisitor(null);
          setIsModalOpen(true);
        }}
        onExportCSV={handleExportCSV}
        visitorsCount={visitors.length}
        todayCount={todayCount}
        inPremisesCount={inPremisesCount}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading visitor records...
          </div>
        ) : (
          <VisitorTable
            visitors={filteredVisitors}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEdit={(visitor) => {
              setEditingVisitor(visitor);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
            onCheckOut={handleCheckOut}
          />
        )}
      </main>

      {/* Add / Edit Modal */}
      <VisitorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVisitor(null);
        }}
        onSave={handleSaveVisitor}
        visitorToEdit={editingVisitor}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-medium shadow-md">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
