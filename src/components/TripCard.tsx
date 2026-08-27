import { Link } from 'react-router-dom';
import type { Trip } from '../types';
import { MapPin, DollarSign, Trash2, ArrowRight } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onDelete: (id: number) => void;
}

export default function TripCard({ trip, onDelete }: TripCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(trip.id);
  };

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
    >
      {/* Date Range Display (Replaces Cover Image) */}
      <div className="relative h-44 w-full bg-gradient-to-br from-blue-500 to-blue-700 flex flex-col items-center justify-center text-white p-4">
         <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <div className="flex flex-col items-center">
               <span className="text-xs font-medium text-blue-100 uppercase tracking-wider mb-1">Start</span>
               <span className="font-bold">{trip.startDate || 'TBD'}</span>
            </div>
            <div className="w-px h-8 bg-white/30 mx-2"></div>
            <div className="flex flex-col items-center">
               <span className="text-xs font-medium text-blue-100 uppercase tracking-wider mb-1">End</span>
               <span className="font-bold">{trip.endDate || 'TBD'}</span>
            </div>
         </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 p-2 bg-white/90 shadow-sm hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
          title="Delete Trip"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {trip.title}
        </h3>

        <div className="flex items-center text-slate-500 text-sm mb-5 line-clamp-1">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-blue-500" />
          <span>{trip.destination}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-lg">
            <DollarSign className="w-4 h-4 text-emerald-500 mr-0.5" />
            <span>{trip.budget?.toLocaleString() ?? '—'}</span>
          </div>

          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}