import React from 'react';
import { Search } from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';

export const VisitorTable = ({
  visitors,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onCheckOut,
}) => {

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by visitor name or mobile number..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Visitor</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Company / College</th>
                <th className="py-3 px-4">Person to Meet</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium text-slate-600">No visitors found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchTerm
                        ? 'No records match your search.'
                        : 'No visitors registered yet. Click "+ Register Visitor" above.'}
                    </p>
                  </td>
                </tr>
              ) : (
                visitors.map((visitor) => {
                  const isInPremises = visitor.status === 'In Premises';
                  const id = visitor._id || visitor.id;

                  return (
                    <tr key={id} className="hover:bg-slate-50 transition-colors">
                      {/* Name */}
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {visitor.name}
                      </td>

                      {/* Mobile */}
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        {visitor.mobile}
                      </td>

                      {/* Company / College */}
                      <td className="py-3 px-4 text-slate-600">
                        {visitor.company}
                      </td>

                      {/* Person to Meet */}
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {visitor.personToMeet}
                      </td>

                      {/* Purpose */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700">
                          {visitor.purpose}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                        <div>{formatDateTime(visitor.checkInTime)}</div>
                        {visitor.checkOutTime && (
                          <div className="text-[11px] text-slate-400">
                            Out: {formatDateTime(visitor.checkOutTime)}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isInPremises
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isInPremises ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {visitor.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {isInPremises && (
                            <button
                              onClick={() => onCheckOut(id)}
                              className="px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded transition-colors"
                            >
                              Check Out
                            </button>
                          )}
                          <button
                            onClick={() => onEdit(visitor)}
                            className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(id)}
                            className="px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          >
                            Delete
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

        {/* Count footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
          Showing <strong>{visitors.length}</strong> visitor{visitors.length === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  );
};
