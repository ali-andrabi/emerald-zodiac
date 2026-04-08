import { useState, useMemo, useRef } from 'react';
import { Search, Upload, Book, Download, FileText, X, CheckCircle2, UserCircle2, Filter, LogOut, FileImage } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_SUBJECTS = ['Physics', 'Chemistry', 'Math', 'Computer Science', 'Biology', 'History'];
const MOCK_GRADES = ['O Level', 'AS Level', 'A2 Level', 'University'];

const INITIAL_RESOURCES = [
  { id: 1, title: 'Physics 9702 Chapter 1: Kinematics', uploader: 'Senior Sam', type: 'PDF', subject: 'Physics', grade: 'AS Level', date: '2025-10-12', downloads: 142, url: '#' },
  { id: 2, title: 'A2 Chemistry Organic Synthesis Map', uploader: 'Alice P.', type: 'Image', subject: 'Chemistry', grade: 'A2 Level', date: '2025-11-04', downloads: 89, url: '#' },
  { id: 3, title: 'Data Structures Cheatsheet - Trees', uploader: 'Code Ninja', type: 'PDF', subject: 'Computer Science', grade: 'University', date: '2026-01-15', downloads: 304, url: '#' },
  { id: 4, title: 'O Level History: Cold War Timeline', uploader: 'HistoryBuff99', type: 'PDF', subject: 'History', grade: 'O Level', date: '2026-02-20', downloads: 56, url: '#' },
  { id: 5, title: 'A2 Level Thermodynamics Notes', uploader: 'ChemWizard', type: 'PDF', subject: 'Chemistry', grade: 'A2 Level', date: '2026-03-01', downloads: 211, url: '#' },
  { id: 6, title: 'AS Math: Integration Basics', uploader: 'MathGenius21', type: 'PDF', subject: 'Math', grade: 'AS Level', date: '2026-03-10', downloads: 412, url: '#' },
  { id: 7, title: 'O Level Biology Diagrams', uploader: 'BioHacker', type: 'Image', subject: 'Biology', grade: 'O Level', date: '2026-03-15', downloads: 13, url: '#' },
  { id: 8, title: 'CS50 Intro to Python Summary', uploader: 'PyMaster', type: 'PDF', subject: 'Computer Science', grade: 'University', date: '2026-03-22', downloads: 87, url: '#' },
  { id: 9, title: 'AS Physics: Waves Full Revision', uploader: 'WaveRider', type: 'PDF', subject: 'Physics', grade: 'AS Level', date: '2026-04-01', downloads: 48, url: '#' },
  { id: 10, title: 'A2 Math: Further Probability', uploader: 'Senior Stats', type: 'PDF', subject: 'Math', grade: 'A2 Level', date: '2026-04-05', downloads: 92, url: '#' },
];

export default function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState(null); // null means logged out
  
  // Data State
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  
  // Filter/Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  
  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadGrade, setUploadGrade] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  // --- LOGIC ---
  
  const handleMockLogin = () => {
    setCurrentUser({
      name: 'Google User',
      email: 'user@gmail.com'
    });
  };

  const handleMockLogout = () => {
    setCurrentUser(null);
  };

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
      const matchesGrade = selectedGrade === 'All' || res.grade === selectedGrade;
      return matchesSearch && matchesSubject && matchesGrade;
    });
  }, [resources, searchQuery, selectedSubject, selectedGrade]);

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setDroppedFile(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setDroppedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadSubject || !uploadGrade || !droppedFile) return;

    const fileType = droppedFile.type.includes('image') ? 'Image' : 'PDF';

    const newResource = {
      id: Date.now(),
      title: uploadTitle,
      uploader: currentUser ? currentUser.name : 'Unknown User',
      type: fileType, 
      subject: uploadSubject,
      grade: uploadGrade,
      date: new Date().toISOString().split('T')[0],
      downloads: 0,
      url: '#'
    };

    setResources([newResource, ...resources]);
    setUploadSuccess(true);
    
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadModalOpen(false);
      setUploadTitle('');
      setUploadSubject('');
      setUploadGrade('');
      setDroppedFile(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 pb-20">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl text-primary border border-primary/20">
              <Book className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Seniors2Juniors
            </span>
          </div>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full font-medium transition-all active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Note</span>
                </button>
                <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground border-l border-border/50 pl-4">
                  <UserCircle2 className="h-5 w-5" />
                  <span>{currentUser.name}</span>
                </div>
                <button onClick={handleMockLogout} className="text-muted-foreground hover:text-destructive flex items-center gap-2 text-sm" title="Sign Out">
                  <LogOut className="h-4 w-4"/>
                </button>
              </>
            ) : (
              <button 
                onClick={handleMockLogin}
                className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-full font-medium transition-all active:scale-95 shadow-md"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 pointer-events-none" alt="Google Logo" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        
        {/* Hero Section & Dashboard Controls */}
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            The Free <span className="text-primary">Resource Library</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
            {currentUser ? "Welcome back! Browse notes or share your own to help other students." : "Sign in to upload your own notes, or browse the complete library below."}
          </p>
          
          <div className="w-full max-w-4xl pt-8 space-y-4">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
              <div className="relative flex items-center bg-card border border-border/50 rounded-2xl p-2 shadow-2xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <Search className="h-6 w-6 text-muted-foreground ml-3" />
                <input 
                  type="text"
                  placeholder="Search notes by title or phrase..."
                  className="w-full bg-transparent border-none outline-none px-4 py-3 text-lg placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <select 
                className="bg-card border border-border text-sm rounded-lg px-3 py-2 cursor-pointer outline-none focus:ring-1 focus:ring-primary/50"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="All">All Subjects</option>
                {MOCK_SUBJECTS.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
              </select>

              <select 
                className="bg-card border border-border text-sm rounded-lg px-3 py-2 cursor-pointer outline-none focus:ring-1 focus:ring-primary/50"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="All">All Grades</option>
                {MOCK_GRADES.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Resource Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Available Notes</h2>
            <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">Showing {filteredResources.length} files</span>
          </div>
          
          {filteredResources.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/50">
              <p className="text-muted-foreground text-lg mb-2">No notes found.</p>
              <p className="text-sm text-muted-foreground/70">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResources.map((res) => (
                <div key={res.id} className="group flex flex-col relative bg-card border border-border hover:border-primary/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1">
                  
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                      {res.subject}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                      {res.grade}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 leading-tight flex-grow">{res.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">By {res.uploader} &bull; {res.date}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex bg-background/50 rounded-md px-2 py-1 items-center gap-1.5 text-xs text-muted-foreground border border-border/50">
                      {res.type === 'PDF' ? <FileText className="h-3.5 w-3.5" /> : <FileImage className="h-3.5 w-3.5" />}
                      {res.type}
                    </div>
                    <a href={res.url} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal Overlay */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border/50">
              <h2 className="text-xl font-semibold">Upload a Note</h2>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {uploadSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                  <div className="h-16 w-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-green-500">File Uploaded!</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your notes have automatically been added to the library.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Document Title</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g., Computer Science Chapter 2"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <select 
                        required
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={uploadSubject}
                        onChange={(e) => setUploadSubject(e.target.value)}
                      >
                         <option value="" disabled>Select Subject...</option>
                         {MOCK_SUBJECTS.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Grade Level</label>
                      <select 
                        required
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={uploadGrade}
                        onChange={(e) => setUploadGrade(e.target.value)}
                      >
                         <option value="" disabled>Select Grade...</option>
                         {MOCK_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  {/* Drag and Drop Zone */}
                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium">File Upload</label>
                    <div 
                      className={`border-2 border-dashed transition-all rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer
                        ${isDragging ? 'border-primary bg-primary/10' : 'border-border bg-muted/20 hover:border-primary/50'}
                        ${droppedFile ? 'border-green-500/50 bg-green-500/5' : ''}
                      `}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileSelect}
                        accept="application/pdf,image/*"
                      />
                      
                      {droppedFile ? (
                         <>
                            <FileText className="h-8 w-8 text-green-500 mb-3" />
                            <p className="text-sm font-medium text-green-500 truncate max-w-[250px]">{droppedFile.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{(droppedFile.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
                         </>
                      ) : (
                         <>
                            <Upload className={`h-8 w-8 mb-3 ${isDragging ? 'text-primary animate-bounce' : 'text-muted-foreground'}`} />
                            <p className="text-sm font-medium">
                              {isDragging ? 'Drop file here!' : 'Drag and drop a file, or click to browse'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Accepts PDF or Images (max 50MB)</p>
                         </>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={!droppedFile}
                      className="w-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 font-medium py-3 rounded-xl transition-all active:scale-[0.98]"
                    >
                      {droppedFile ? 'Publish Note' : 'Select a File to Continue'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
