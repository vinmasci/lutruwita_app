# Custom Material UI Sidebar

## Overview
Custom expandable sidebar implementation using Material UI with Shadcn-inspired design.

## Component Structure

### Base Component
```typescript
// packages/ui/navigation/Sidebar.tsx
interface SidebarProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  expanded,
  onExpand,
  onCollapse,
  children
}) => {
  return (
    <Drawer
      variant="permanent"
      className={clsx(styles.sidebar, {
        [styles.expanded]: expanded
      })}
    >
      {/* Implementation */}
    </Drawer>
  );
};
```

### Navigation Items
```typescript
// packages/ui/navigation/SidebarItem.tsx
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  expanded?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  onClick,
  active,
  disabled,
  expanded
}) => {
  return (
    <ListItem
      button
      disabled={disabled}
      className={clsx(styles.item, {
        [styles.active]: active
      })}
      onClick={onClick}
    >
      {/* Implementation */}
    </ListItem>
  );
};
```

## Implementation Examples

### Basic Usage
```tsx
// apps/web/app/map/page.tsx
export default function MapPage() {
  return (
    <SidebarProvider>
      <MapLayout>
        <MainSidebar />
        <MapComponent />
      </MapLayout>
    </SidebarProvider>
  );
}
```

### With Upload Box
```tsx
// components/map/UploadSidebar.tsx
export const UploadSidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <Sidebar expanded={expanded}>
      <SidebarSection title="Create">
        <SidebarItem
          icon={<UploadIcon />}
          label="Add GPX"
          onClick={() => setShowUpload(true)}
        />
        {showUpload && expanded && (
          <UploadBox
            onUpload={handleUpload}
            onClose={() => setShowUpload(false)}
          />
        )}
      </SidebarSection>
    </Sidebar>
  );
};
```

### Route Management
```tsx
// components/map/RouteSidebar.tsx
export const RouteSidebar: React.FC = () => {
  const { routes } = useRoutes();
  
  return (
    <SidebarSection title="Routes">
      {routes.map(route => (
        <RouteItem
          key={route.id}
          route={route}
          onColorChange={handleColorChange}
          onToggleVisibility={handleToggleVisibility}
        />
      ))}
    </SidebarSection>
  );
};
```

## Event Handling

### Click Events
```typescript
const handleItemClick = (event: React.MouseEvent) => {
  event.stopPropagation();
  if (!expanded) {
    onExpand();
  }
  onClick?.();
};
```

### Hover Events
```typescript
const handleHover = (event: React.MouseEvent) => {
  if (!expanded) {
    // Show tooltip
    showTooltip(event.currentTarget, label);
  }
};
```

## Animation States

### Transition Management
```typescript
// hooks/useTransition.ts
export const useTransition = (expanded: boolean) => {
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    setTransitioning(true);
    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 300); // Match transition duration

    return () => clearTimeout(timer);
  }, [expanded]);

  return transitioning;
};
```

### CSS Transitions
```scss
.sidebar {
  transition: width 0.3s ease-in-out;
  
  &.transitioning {
    overflow: hidden;
  }
  
  .item {
    transition: padding 0.3s ease-in-out;
  }
}
```

## State Management

### Context Provider
```typescript
// contexts/SidebarContext.tsx
export const SidebarContext = createContext<SidebarContextType>({
  expanded: false,
  setExpanded: () => {},
  activeItem: null,
  setActiveItem: () => {},
});

export const SidebarProvider: React.FC = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        setExpanded,
        activeItem,
        setActiveItem,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
```

### Hook Usage
```typescript
// hooks/useSidebar.ts
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};
```

## Responsive Behavior

### Media Queries
```scss
.sidebar {
  @media (max-width: 768px) {
    position: fixed;
    z-index: 1200;
    
    &.expanded {
      width: 100%;
      max-width: 300px;
    }
  }
}
```

### Responsive Hook
```typescript
// hooks/useResponsive.ts
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    setIsMobile(query.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return { isMobile };
};
```

## Accessibility

### Keyboard Navigation
```typescript
// hooks/useSidebarKeyboard.ts
export const useSidebarKeyboard = (
  itemRefs: RefObject<HTMLElement>[],
  activeIndex: number,
  setActiveIndex: (index: number) => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          setActiveIndex((prev) => Math.min(prev + 1, itemRefs.length - 1));
          break;
        case 'ArrowUp':
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [itemRefs, setActiveIndex]);
};
```

## Testing

### Unit Tests
```typescript
// __tests__/Sidebar.test.tsx
describe('Sidebar', () => {
  it('expands on hover', () => {
    const { getByRole } = render(<Sidebar />);
    fireEvent.mouseEnter(getByRole('complementary'));
    expect(getByRole('complementary')).toHaveClass('expanded');
  });

  it('shows tooltips when collapsed', () => {
    const { getByRole } = render(<Sidebar expanded={false} />);
    fireEvent.mouseEnter(getByRole('button'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
```

## Related Documentation
- [MAP.md](MAP.md) - Map component integration
- [GPX.md](../FEATURES/GPX.md) - GPX upload integration
- [FEATURES/POI.md](../FEATURES/POI.md) - POI system integration