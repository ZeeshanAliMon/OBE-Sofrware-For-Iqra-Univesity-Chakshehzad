import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Department, Program, GA, OBEData, ProgramObjective } from '../types';
import { apiService } from '../services/apiService';
import { LayoutDashboard, Users, Building2, ChevronRight, Save, Undo2, CheckSquare, Square, LogOut, Target, Loader2, AlertCircle } from 'lucide-react';

interface QADashboardProps {
  onLogout: () => void;
}

export default function QADashboard({ onLogout }: QADashboardProps) {
  const [data, setData] = useState<OBEData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'departments' | 'instructors'>('departments');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Edit states for department
  const [isEditingDept, setIsEditingDept] = useState(false);
  const [editDeptVision, setEditDeptVision] = useState('');
  const [editDeptMission, setEditDeptMission] = useState('');

  // Edit states for program objectives
  const [editPOs, setEditPOs] = useState<ProgramObjective[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const fetchedData = await apiService.getAllData();
      setData(fetchedData);
      setError(null);
    } catch (err) {
      setError('Could not connect to Django backend. Ensure it is running and accessible.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProgram) {
      const currentPOs = JSON.parse(JSON.stringify(selectedProgram.pos)) as ProgramObjective[];
      const paddedPOs = [...currentPOs];
      
      // Always ensure exactly 4 slots
      while (paddedPOs.length < 4) {
        paddedPOs.push({
          id: `PO${paddedPOs.length + 1}`,
          text: '',
          mappedGAs: []
        });
      }
      
      setEditPOs(paddedPOs.slice(0, 4));
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedDept) {
      setEditDeptVision(selectedDept.vision);
      setEditDeptMission(selectedDept.mission);
    }
  }, [selectedDept]);

  const handleSaveDepartment = async () => {
    if (!selectedDept || !data) return;
    try {
      setIsSaving(true);
      const updated = await apiService.updateDepartment(selectedDept.id, {
        vision: editDeptVision,
        mission: editDeptMission
      });
      
      const updatedDepts = data.departments.map(d => 
        d.id === selectedDept.id ? updated : d
      );
      setData({ ...data, departments: updatedDepts });
      setSelectedDept(updated);
      setIsEditingDept(false);
    } catch (err) {
      alert('Failed to save to backend.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProgram = async () => {
    if (!selectedProgram || !data) return;
    try {
      setIsSaving(true);
      const updated = await apiService.updateProgram(selectedProgram.id, { pos: editPOs });
      
      const updatedPrograms = data.programs.map(p => 
        p.id === selectedProgram.id ? updated : p
      );

      setData({ ...data, programs: updatedPrograms });
      setSelectedProgram(updated);
      alert('Changes saved to backend successfully!');
    } catch (err) {
      alert('Failed to save program changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePOToggleGA = (poIdx: number, gaId: string) => {
    setEditPOs(prev => prev.map((po, idx) => {
      if (idx !== poIdx) return po;
      const isMapped = po.mappedGAs.includes(gaId);
      return {
        ...po,
        mappedGAs: isMapped 
          ? po.mappedGAs.filter(id => id !== gaId) 
          : [...po.mappedGAs, gaId]
      };
    }));
  };

  const handlePOTextChange = (poIdx: number, text: string) => {
    setEditPOs(prev => prev.map((po, idx) => 
      idx === poIdx ? { ...po, text } : po
    ));
  };

  return (
    <div className="flex h-screen bg-[#E4E3E0] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#141414] flex flex-col bg-[#E4E3E0]">
        <div className="p-6 border-bottom border-[#141414] mb-8">
          <h2 className="text-xl font-display font-medium text-[#141414] italic">QA Control</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => { setActiveTab('departments'); setSelectedDept(null); setSelectedProgram(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
              activeTab === 'departments' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-black/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            DEPARTMENTS
          </button>
          <button
            onClick={() => { setActiveTab('instructors'); setSelectedDept(null); setSelectedProgram(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
              activeTab === 'instructors' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-black/5'
            }`}
          >
            <Users className="w-4 h-4" />
            INSTRUCTORS
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm hover:bg-red-500 hover:text-white transition-all text-red-600"
          >
            <LogOut className="w-4 h-4" />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex">
        {loading ? (
          <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-40" />
            <p className="font-mono text-xs opacity-50 uppercase tracking-widest">Hydrating data from server...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mb-6" />
            <h3 className="text-2xl font-display font-medium mb-4">Connection Failed</h3>
            <p className="font-sans text-gray-500 mb-8">{error}</p>
            <button 
              onClick={fetchInitialData}
              className="px-8 py-3 bg-[#141414] text-[#E4E3E0] font-mono text-xs uppercase tracking-widest"
            >
              Retry Connection
            </button>
          </div>
        ) : !data ? null : (
          <div className="flex-1 flex overflow-hidden">
            <AnimatePresence mode="wait">
            {/* View 1: List of Departments or Instructors */}
            {activeTab === 'instructors' ? (
               <motion.div 
               key="instructors"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="p-8 w-full"
             >
               <h3 className="font-display italic text-xs uppercase tracking-widest opacity-50 mb-6">Instructor Reports</h3>
               <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
                 <p className="font-sans text-orange-800">Instructor evaluation and mapping profiles are coming soon.</p>
               </div>
             </motion.div>
            ) : !selectedDept ? (
              <motion.div 
                key="dept-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 w-full"
              >
                <h3 className="font-display italic text-xs uppercase tracking-widest opacity-50 mb-6">University Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.departments.map(dept => (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDept(dept)}
                      className="group flex flex-col p-6 bg-white border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs opacity-50">UNIT ID: {dept.id.toUpperCase()}</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                      <span className="font-display text-2xl font-medium">{dept.name}</span>
                      <span className="font-mono text-xs mt-2 opacity-50">
                        {data.programs.filter(p => p.departmentId === dept.id).length} PROGRAMS ACTIVE
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : !selectedProgram ? (
              <motion.div 
                key="program-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 w-full"
              >
                <div className="flex items-center gap-2 mb-8">
                  <button onClick={() => setSelectedDept(null)} className="font-mono text-xs hover:underline uppercase tracking-wider opacity-50">DEPARTMENTS</button>
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <span className="font-mono text-xs uppercase tracking-wider">{selectedDept.name}</span>
                </div>
                
                <h3 className="font-display italic text-xs uppercase tracking-widest opacity-50 mb-6">Department Programs</h3>
                
                {/* Department Vision/Mission Summary */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display italic text-xs uppercase tracking-widest opacity-50">Department Identity</h3>
                    {!isEditingDept ? (
                      <button onClick={() => setIsEditingDept(true)} className="font-mono text-[10px] underline uppercase tracking-widest opacity-40 hover:opacity-100 italic transition-opacity">Edit Identity</button>
                    ) : (
                      <div className="flex gap-4">
                         <button onClick={() => setIsEditingDept(false)} className="font-mono text-[10px] underline uppercase tracking-widest opacity-40 hover:opacity-100 italic transition-opacity">Cancel</button>
                         <button onClick={handleSaveDepartment} className="font-mono text-[10px] underline uppercase tracking-widest text-green-600 font-bold italic transition-opacity">Save Identity</button>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-white border border-[#141414] rounded-sm">
                      <span className="block font-mono text-[10px] opacity-40 mb-2 uppercase tracking-tighter">Department Vision</span>
                      {isEditingDept ? (
                        <textarea
                          value={editDeptVision}
                          onChange={(e) => setEditDeptVision(e.target.value)}
                          className="w-full p-2 font-sans text-sm bg-gray-50 border border-black/10 outline-none focus:border-black"
                          rows={2}
                        />
                      ) : (
                        <p className="font-sans text-sm leading-relaxed text-[#141414]">{selectedDept.vision}</p>
                      )}
                    </div>
                    <div className="p-6 bg-white border border-[#141414] rounded-sm">
                      <span className="block font-mono text-[10px] opacity-40 mb-2 uppercase tracking-tighter">Department Mission</span>
                      {isEditingDept ? (
                        <textarea
                          value={editDeptMission}
                          onChange={(e) => setEditDeptMission(e.target.value)}
                          className="w-full p-2 font-sans text-sm bg-gray-50 border border-black/10 outline-none focus:border-black"
                          rows={2}
                        />
                      ) : (
                        <p className="font-sans text-sm leading-relaxed text-[#141414]">{selectedDept.mission}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.programs.filter(p => p.departmentId === selectedDept.id).map(prog => (
                    <button
                      key={prog.id}
                      onClick={() => setSelectedProgram(prog)}
                      className="w-full flex items-center justify-between p-6 bg-white border border-[#141414] hover:border-r-[8px] transition-all text-left"
                    >
                      <div className="flex gap-6 items-center">
                        <span className="font-mono text-sm p-2 bg-gray-100 rounded">{prog.code}</span>
                        <div>
                          <span className="block font-display text-xl font-medium">{prog.name}</span>
                          <span className="font-mono text-[10px] opacity-50 uppercase">
                            {prog.pos.filter(po => po.text.trim()).length} / 4 OBJECTIVES DEFINED
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Program Detail View (Editor) */
              <motion.div 
                key="program-edit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col h-full w-full"
              >
                {/* Header with Navigation Breadcrumb */}
                <div className="p-8 pb-4 border-b border-[#141414]/10">
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setSelectedDept(null)} className="font-mono text-[10px] hover:underline uppercase tracking-widest opacity-40">DEPARTMENTS</button>
                    <ChevronRight className="w-2 h-2 opacity-20" />
                    <button onClick={() => setSelectedProgram(null)} className="font-mono text-[10px] hover:underline uppercase tracking-widest opacity-40">{selectedDept.name}</button>
                    <ChevronRight className="w-2 h-2 opacity-20" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">{selectedProgram.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-display font-medium">{selectedProgram.name}</h2>
                      <p className="font-mono text-xs opacity-50">PROGRAM CONFIGURATION | CODE: {selectedProgram.code}</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        disabled={isSaving}
                        onClick={() => setSelectedProgram(null)}
                        className="flex items-center gap-2 px-4 py-2 border border-[#141414] font-mono text-xs hover:bg-black/5 disabled:opacity-50"
                      >
                        <Undo2 className="w-3 h-3" /> CANCEL
                      </button>
                      <button 
                         disabled={isSaving}
                         onClick={handleSaveProgram}
                         className="flex items-center gap-2 px-4 py-2 bg-[#141414] text-[#E4E3E0] font-mono text-xs hover:bg-[#141414]/90 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Save className="w-3 h-3" />
                        )}
                        {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-white/50">
                  <div className="max-w-4xl mx-auto space-y-16 pb-20">
                    
                    {editPOs.map((po, poIdx) => (
                      <section key={po.id} className="relative">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="flex items-center justify-center w-10 h-10 bg-[#141414] text-white rounded-full font-display font-medium text-lg italic">
                            {poIdx + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-display italic text-sm uppercase tracking-[0.2em] opacity-40">PROGRAM OBJECTIVE {poIdx + 1}</h4>
                            <div className="h-[1px] bg-[#141414] opacity-20 mt-1"></div>
                          </div>
                        </div>

                        <div className="space-y-6 ml-14">
                          {/* PO Text Editor */}
                          <div>
                            <span className="block font-mono text-[10px] uppercase tracking-widest opacity-30 mb-2">Objective Text</span>
                            <textarea
                              rows={2}
                              value={po.text}
                              onChange={(e) => handlePOTextChange(poIdx, e.target.value)}
                              className="w-full p-6 bg-white border border-[#141414] font-sans text-base resize-none outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                              placeholder={`Define PO ${poIdx + 1}...`}
                            />
                          </div>

                          {/* GA Mapping for this PO */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="block font-mono text-[10px] uppercase tracking-widest opacity-30">Map to attributes</span>
                              <span className="font-mono text-[10px] text-gray-400 italic">Select one or more from 10 GAs</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                              {data.gas.map(ga => (
                                <button
                                  key={ga.id}
                                  onClick={() => handlePOToggleGA(poIdx, ga.id)}
                                  className={`relative group flex items-center justify-center p-3 border transition-all text-center h-16 ${
                                    po.mappedGAs.includes(ga.id)
                                      ? 'bg-amber-400 border-black text-black z-10 scale-[1.02] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                      : 'bg-white border-black/10 hover:border-black/30'
                                  }`}
                                >
                                  <span className={`font-mono text-[10px] font-bold leading-tight ${
                                    po.mappedGAs.includes(ga.id) ? 'opacity-100' : 'opacity-40'
                                  }`}>
                                    {ga.name.toUpperCase()}
                                  </span>
                                  {/* Tooltip on hover */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black text-white text-[8px] rounded opacity-0 group-hover:opacity-100 pointer-events-none w-32 z-50 transition-opacity">
                                    {ga.description}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </section>
                    ))}

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      </main>
    </div>
  );
}
