import React, { useState } from 'react';
import {
  Search,
  X,
  Building2,
  User,
  Phone,
  Clock,
  CheckCircle,
  Edit2,
  Trash2,
  Ticket,
  Copy,
  Check,
  UserCheck,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import {
  formatDateTime,
  formatTime,
  formatTimeAgo,
  getDuration,
  getAvatarColor,
  getInitials,
} from '../utils/dateUtils';

export const VisitorTable = ({
  visitors,
  searchTerm,
  onSearchChange,
  activeFilter,
  onSelectFilter,
  onEdit,
  onDelete,
  onCheckOut,
  onViewPass,
  onOpenRegister,
  counts,
}) => {
  const [copiedId, setCopiedId] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name'

  // Copy phone number to clipboard helper
  const handleCopyPhone = (id, phone) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Purpose badge color map
  const getPurposeBadge = (purpose = '') => {
    switch (purpose) {
      case 'Client Meeting':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Job Interview':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Project Discussion':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Delivery / Vendor':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Campus / College Visit':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Personal Visit':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Sort visitors
  const sortedVisitors = [...visitors].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.checkInTime || 0) - new Date(a.checkInTime || 0);
    }
    if (sortBy === 'oldest') {
      return new Date(a.checkInTime || 0) - new Date(b.checkInTime || 0);
    }
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    }
    return 0;
  });

  const filterTabs = [
    { id: 'all', label: 'All Visitors', count: counts.all },
    { id: 'inPremises', label: 'In Premises', count: counts.inPremises, isLive: true },
    { id: 'today', label: 'Today', count: counts.today },
    { id: 'checkedOut', label: 'Checked Out', count: counts.checkedOut },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar & Filter Tabs Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by visitor name, mobile, or company..."
              className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100">
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.isLive && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-emerald-500 animate-pulse'
                    }`}
                  />
                )}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Visitor</th>
                <th className="py-3.5 px-4">Company / Org</th>
                <th className="py-3.5 px-4">Host (To Meet)</th>
                <th className="py-3.5 px-4">Purpose</th>
                <th className="py-3.5 px-4">Timing</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedVisitors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="max-w-xs mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">No visitors found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {searchTerm
                          ? `No records match "${searchTerm}". Try resetting search or filters.`
                          : activeFilter !== 'all'
                          ? 'No visitor records in this category.'
                          : 'No visitors recorded yet. Click below to register the first visitor.'}
                      </p>
                      {searchTerm ? (
                        <button
                          type="button"
                          onClick={() => onSearchChange('')}
                          className="mt-4 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          Clear Search
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onOpenRegister}
                          className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                        >
                          + Register First Visitor
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                sortedVisitors.map((visitor) => {
                  const isInPremises = visitor.status === 'In Premises';
                  const id = visitor._id || visitor.id;
                  const duration = getDuration(visitor.checkInTime, visitor.checkOutTime);

                  return (
                    <tr
                      key={id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Visitor Name & Mobile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${getAvatarColor(
                              visitor.name
                            )} flex-shrink-0 shadow-2xs`}
                          >
                            {getInitials(visitor.name)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-tight">
                              {visitor.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[11px] text-slate-500">
                                {visitor.mobile}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyPhone(id, visitor.mobile)}
                                title="Copy mobile number"
                                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                              >
                                {copiedId === id ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company / College */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{visitor.company}</span>
                        </div>
                      </td>

                      {/* Person to Meet */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{visitor.personToMeet}</span>
                        </div>
                      </td>

                      {/* Purpose */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-md border ${getPurposeBadge(
                            visitor.purpose
                          )}`}
                        >
                          {visitor.purpose}
                        </span>
                      </td>

                      {/* Timing */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="leading-tight">
                          <p className="font-medium text-slate-800">
                            {formatTime(visitor.checkInTime)}
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(visitor.checkInTime)}
                          </p>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-600 text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          {duration || '—'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            isInPremises
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isInPremises ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                          {visitor.status}
                        </span>
                      </td>

                      {/* Actions Toolbar */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick Check Out */}
                          {isInPremises && (
                            <button
                              type="button"
                              onClick={() => onCheckOut(id)}
                              title="Check out visitor"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Out</span>
                            </button>
                          )}

                          {/* Print / View Pass */}
                          <button
                            type="button"
                            onClick={() => onViewPass(visitor)}
                            title="Print / View Visitor Badge Pass"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details */}
                          <button
                            type="button"
                            onClick={() => onEdit(visitor)}
                            title="Edit visitor details"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Record */}
                          <button
                            type="button"
                            onClick={() => onDelete(id)}
                            title="Delete record"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Showing <strong>{sortedVisitors.length}</strong> of{' '}
            <strong>{counts.all}</strong> total registered visitors
          </span>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>
              Inside: <strong className="text-emerald-600">{counts.inPremises}</strong>
            </span>
            <span>•</span>
            <span>
              Today: <strong className="text-indigo-600">{counts.today}</strong>
            </span>
            <span>•</span>
            <span>
              Checked Out: <strong className="text-slate-600">{counts.checkedOut}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
