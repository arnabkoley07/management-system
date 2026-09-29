import React from 'react';
import { UserCheck, Calendar, CheckCircle2, Users } from 'lucide-react';

export const StatsBar = ({
  inPremisesCount,
  todayCount,
  checkedOutCount,
  totalCount,
  activeFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'inPremises',
      label: 'Inside Building',
      sublabel: 'Active visitors now',
      value: inPremisesCount,
      icon: UserCheck,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/40',
      badge: 'Live',
      isLive: true,
    },
    {
      id: 'today',
      label: "Today's Check-ins",
      sublabel: 'Visits logged today',
      value: todayCount,
      icon: Calendar,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      activeRing: 'ring-2 ring-indigo-500 border-indigo-300 bg-indigo-50/40',
    },
    {
      id: 'checkedOut',
      label: 'Checked Out',
      sublabel: 'Completed visits',
      value: checkedOutCount,
      icon: CheckCircle2,
      iconColor: 'text-slate-600 bg-slate-100 border-slate-200',
      activeRing: 'ring-2 ring-slate-500 border-slate-300 bg-slate-50',
    },
    {
      id: 'all',
      label: 'Total Registered',
      sublabel: 'Lifetime records',
      value: totalCount,
      icon: Users,
      iconColor: 'text-violet-600 bg-violet-50 border-violet-200',
      activeRing: 'ring-2 ring-violet-500 border-violet-300 bg-violet-50/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(isActive && card.id !== 'all' ? 'all' : card.id)}
            className={`text-left p-4 rounded-xl border bg-white shadow-xs transition-all duration-150 hover:shadow-sm hover:border-slate-300 cursor-pointer relative overflow-hidden group ${
              isActive ? card.activeRing : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </span>

              {card.isLive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              {card.sublabel}
            </p>

            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        );
      })}
    </div>
  );
};
