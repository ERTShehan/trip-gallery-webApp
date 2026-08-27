import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Trip, TravelLog, } from '../types';
import { tripApi, travelLogApi, mediaApi } from '../services/api';
import { ArrowLeft, MapPin, DollarSign, Edit2, Image as ImageIcon, Upload, Plus, Trash2, Loader2, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [logs, setLogs] = useState<TravelLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Trip State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Trip>>({});

  // Add Log State (Now a modal)
  const [showLogModal, setShowLogModal] = useState(false);
  const [logNote, setLogNote] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [savingLog, setSavingLog] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);

  useEffect(() => {
    if (id) fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const tripId = parseInt(id!);
      const [tripRes, logsRes] = await Promise.all([
        tripApi.getById(tripId),
        travelLogApi.getByTripId(id!)
      ]);
      setTrip(tripRes.data);
      setEditData(tripRes.data);
      setLogs(logsRes.data);
    } catch {
      toast.error('Failed to load data!');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTrip = async () => {
    try {
      setSavingTrip(true);
      const tripId = parseInt(id!);
      const res = await tripApi.update(tripId, editData);
      setTrip(res.data);
      setIsEditing(false);
      toast.success('Trip updated successfully!');
    } catch {
      toast.error('Failed to update trip.');
    } finally {
      setSavingTrip(false);
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingLog(true);
      let uploadedMediaLinks: string[] = [];

      if (selectedFile) {
        const uploadRes = await mediaApi.upload(selectedFile);
        uploadedMediaLinks.push(uploadRes.data.fileUrl);
      }

      await travelLogApi.create({
        tripId: id!,
        note: logNote,
        mediaLinks: uploadedMediaLinks,
      });

      setLogNote('');
      setSelectedFile(null);
      setShowLogModal(false);
      toast.success('Experience logged successfully!');

      const logsRes = await travelLogApi.getByTripId(id!);
      setLogs(logsRes.data);
    } catch {
      toast.error('Failed to save travel log or upload media.');
    } finally {
      setSavingLog(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    const result = await Swal.fire({
      title: 'Delete this log?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it',
      customClass: { popup: 'rounded-2xl', confirmButton: 'px-5 py-2 rounded-xl', cancelButton: 'px-5 py-2 rounded-xl' }
    });

    if (result.isConfirmed) {
      try {
        await travelLogApi.delete(logId);
        setLogs(logs.filter(l => l.id !== logId));
        toast.success('Log deleted!');
      } catch {
        toast.error('Failed to delete log.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg font-medium">Loading details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Trip Not Found</h2>
        <button onClick={() => navigate('/')} className="text-blue-600 font-medium hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-slate-500 font-medium hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 w-fit"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </button>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="h-56 sm:h-72 w-full relative bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-30"></div>
          
          {!isEditing && (
             <div className="z-10 flex items-center gap-6 bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 text-white shadow-lg">
                <div className="text-center">
                   <p className="text-sm text-blue-100 font-medium uppercase tracking-widest mb-1">Start Date</p>
                   <p className="text-2xl font-bold">{trip.startDate || 'Not Set'}</p>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                   <p className="text-sm text-blue-100 font-medium uppercase tracking-widest mb-1">End Date</p>
                   <p className="text-2xl font-bold">{trip.endDate || 'Not Set'}</p>
                </div>
             </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          {isEditing ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl max-w-2xl">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wider">Title</label>
                  <input
                    value={editData.title || ''}
                    onChange={e => setEditData({ ...editData, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-lg font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wider">Destination</label>
                    <input
                      value={editData.destination || ''}
                      onChange={e => setEditData({ ...editData, destination: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-blue-500 focus:ring-4 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wider">Budget ($)</label>
                    <input
                      type="number"
                      value={editData.budget || 0}
                      onChange={e => setEditData({ ...editData, budget: parseFloat(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-blue-500 focus:ring-4 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wider">Start Date</label>
                    <input
                      type="date"
                      value={editData.startDate || ''}
                      onChange={e => setEditData({ ...editData, startDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-blue-500 focus:ring-4 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wider">End Date</label>
                    <input
                      type="date"
                      value={editData.endDate || ''}
                      onChange={e => setEditData({ ...editData, endDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-blue-500 focus:ring-4 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={handleUpdateTrip} disabled={savingTrip} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 flex justify-center items-center gap-2">
                    {savingTrip ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl py-3">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">{trip.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                  <span className="flex items-center gap-1.5 bg-white/10 text-white backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                    <MapPin className="w-4 h-4 text-blue-300" /> {trip.destination}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 text-white backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                    <DollarSign className="w-4 h-4 text-emerald-300" /> {trip.budget?.toLocaleString() ?? '—'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-800 font-bold rounded-xl shadow-lg hover:bg-slate-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit Trip
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Travel Logs Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Travel Logs & Media</h2>
            <p className="text-slate-500 text-sm mt-1">Record your memories and photos here</p>
          </div>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" /> Add Log
          </button>
        </div>

        {/* Logs List */}
        {logs.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ImageIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">No logs yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">Start documenting your journey by adding your first travel log and photos.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {logs.map(log => (
              <div key={log.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg">{log.note}</p>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {log.mediaLinks && log.mediaLinks.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {log.mediaLinks.map((link, idx) => (
                      <a key={idx} href={link} target="_blank" rel="noreferrer" className="block relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-blue-400 transition-colors shadow-sm">
                        <img src={link} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Glassmorphism Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Add New Experience</h3>
              <button 
                onClick={() => setShowLogModal(false)}
                className="p-2 bg-white hover:bg-slate-100 text-slate-400 rounded-xl shadow-sm border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddLog} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Note / Description</label>
                  <textarea
                    required
                    value={logNote}
                    onChange={e => setLogNote(e.target.value)}
                    placeholder="Write about your experience today..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 min-h-[120px] resize-y outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Upload Photo (Optional)</label>
                  <label className="block cursor-pointer">
                    <div className={`border-2 border-dashed rounded-2xl px-6 py-10 text-center transition-all ${selectedFile ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50'}`}>
                      <Upload className={`w-8 h-8 mx-auto mb-3 ${selectedFile ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className={`text-base font-medium ${selectedFile ? 'text-blue-700' : 'text-slate-500'}`}>
                        {selectedFile ? selectedFile.name : 'Click to browse and upload an image'}
                      </span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setShowLogModal(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={savingLog} className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center min-w-[150px]">
                  {savingLog ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}