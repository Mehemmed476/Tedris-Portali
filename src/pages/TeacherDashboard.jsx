import React, { useState } from 'react';
import ClassManager from '../components/ClassManager.jsx';
import ClassDetail from '../components/ClassDetail.jsx';
import { ICONS } from '../components/Icon.jsx';
import { ModeToggle } from '../components/theme-toggle';
import { Button } from '@/components/ui/button.jsx';

const TeacherDashboard = ({ user, onLogout, showToast }) => {
  const [selectedClass, setSelectedClass] = useState(null);

  const renderContent = () => {
    if (selectedClass) {
      return (
        <ClassDetail
          selectedClass={selectedClass}
          user={user}
          onBack={() => setSelectedClass(null)}
          showToast={showToast}
        />
      );
    }
    return (
      <ClassManager
        user={user}
        onSelectClass={(cls) => setSelectedClass(cls)}
        showToast={showToast}
      />
    );
  };

  return (
    <div className="min-h-screen w-full bg-muted/40">
      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-card border-b sticky top-0 z-30">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    {ICONS.classIcon}
                  </div>
                  <h1 className="text-lg font-bold text-foreground">Tədris Portalı</h1>
              </div>
              <div className="text-sm text-muted-foreground hidden md:block border-l pl-4">
                {selectedClass ? (
                  <>
                    <button onClick={() => setSelectedClass(null)} className="hover:underline">
                      Siniflərim
                    </button>
                    <span className="mx-2">/</span>
                    <span className="text-foreground font-medium">{selectedClass.className}</span>
                  </>
                ) : (
                  <span className="text-foreground font-medium">Siniflərim</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-sm text-muted-foreground">{user?.email}</span>
              <ModeToggle />
              <Button variant="ghost" size="icon" onClick={onLogout} title="Çıxış">
                {ICONS.logout}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;