import React, { createContext, useContext, useState, useCallback } from 'react';

interface SidebarContextType {
  expanded: boolean;
  activeItem: string | null;
  setExpanded: (expanded: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleExpanded: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        activeItem,
        setExpanded,
        setActiveItem,
        toggleExpanded,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export type { SidebarContextType };
