import React, { useState, useMemo, useEffect } from 'react';

// Icon assets - Updated to use public folder references
const imgVector = "/help-icon.svg";
const imgVectorDark = "/help-icon-dark.svg";
const imgVectorPressed = "/help-icon-pressed.svg";
const imgPound = "/X.svg";
const tooltipBg = "/tooltip-bg.svg";
const tooltipBgDark = "/tooltip-bg-dark.svg";

// Tooltip data
const tooltipData = {
  frequency: {
    title: "Rental Frequency",
    content: "Choose whether you want to charge rent per week or per month. This sets how the rental price is displayed and calculated."
  },
  deposit: {
    title: "How Deposits Work",
    content: "Select how many weeks' worth of rent you'd like to charge as a deposit. This will be calculated using your selected rent."
  },
  rental: {
    title: "Monthly Rental",
    content: "Select how many weeks' worth of rent you'd like to charge as a deposit. This will be calculated using your selected rent."
  },
  letlyFee: {
    title: "Monthly Letly Fee",
    content: "A monthly fee we deduct for managing rent, contracts, and support. Includes support, contracts, and rent handling."
  },
  youReceive: {
    title: "What You Get Monthly",
    content: "This is the amount you'll receive each month after Letly's service fee is deducted from your rental income."
  },
  depositTotal: {
    title: "How Deposits Work",
    content: "Select how many weeks' worth of rent you'd like to charge as a deposit. This will be calculated using your selected rent."
  }
};

// Utility function to format currency
const formatCurrency = (amount: number): string => {
  return `£${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// Tooltip Modal Component
interface TooltipModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
  theme: any;
}

const TooltipModal: React.FC<TooltipModalProps> = ({ isOpen, title, content, onClose, theme }) => {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // Add global mouse listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const currentY = e.clientY;
        const deltaY = currentY - startY;
        
        if (deltaY > 0) {
          setDragY(deltaY);
        }
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        
        if (dragY > 100) {
          handleAnimatedClose();
        }
        
        setDragY(0);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, startY, dragY, onClose]);

  if (!isOpen && !isClosing) return null;

  const handleAnimatedClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Faster close animation
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    
    // Only allow dragging down (positive deltaY)
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Close if dragged down more than 100px, otherwise snap back
    if (dragY > 100) {
      handleAnimatedClose();
    }
    
    setDragY(0);
  };

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentY = e.clientY;
    const deltaY = currentY - startY;
    
    // Only allow dragging down (positive deltaY)
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Close if dragged down more than 100px, otherwise snap back
    if (dragY > 100) {
      handleAnimatedClose();
    }
    
    setDragY(0);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={handleAnimatedClose}
      />
      
      {/* Tooltip Modal - EXACT Figma positioning */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center ${
          isClosing ? 'animate-slide-down' : 'animate-slide-up'
        }`}
        style={{ 
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        <div 
          className="relative h-[249px] mb-3 w-[375px] touch-none transition-opacity duration-200"
          style={{ 
            opacity: isDragging ? 0.8 : 1 
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {/* Background Image - Theme-aware */}
          <div
            className="absolute h-[249px] left-[11px] top-1 w-[353px]"
          >
            <img 
              alt="" 
              className="block max-w-none size-full" 
              src={theme.background === '#1c1a20' ? tooltipBgDark : tooltipBg} 
            />
          </div>
          
          {/* Handle - Theme-aware */}
          <div
            className="absolute h-1.5 left-[109px] rounded-[9px] top-px w-[157px] transition-all duration-200"
            style={{
              backgroundColor: isDragging 
                ? theme.primaryButton 
                : (theme.background === '#1c1a20' ? '#6a6a76' : '#aca0bb'),
              height: isDragging ? '8px' : '6px',
              top: isDragging ? '0px' : '1px'
            }}
          />
          
          {/* Title - Theme-aware */}
          <div
            className="absolute leading-[0] left-[187.5px] text-[26px] text-center top-[27px] translate-x-[-50%] w-[353px]"
            style={{ 
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700, // Bold
              color: theme.background === '#1c1a20' ? '#ffffff' : '#2f2a5f' 
            }}
          >
            <p className="block leading-[1.35]">{title}</p>
          </div>
          
          {/* Content - Theme-aware */}
          <div
            className="absolute leading-[0] left-[187px] not-italic text-[16px] text-center top-[73px] translate-x-[-50%] w-[316px]"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300, // Light
              color: theme.background === '#1c1a20' ? '#ffffff' : '#2f2a5f' 
            }}
          >
            <p className="block leading-[1.61]">{content}</p>
          </div>
          
          {/* Got it Button - Theme-aware */}
          <div
            className="absolute bottom-[25px] cursor-pointer h-[46px] left-1/2 translate-x-[-50%] w-[327px]"
            onClick={handleAnimatedClose}
          >
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{ backgroundColor: theme.primaryButton }}
            />
            <div 
              className="absolute bottom-[26.923%] flex flex-col justify-center leading-[0] left-0 right-0 text-[#ffffff] text-[16px] text-center top-1/4"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700 // Bold
              }}
            >
              <p className="block leading-[1.5]">Got it</p>
            </div>
            <div className="absolute inset-0 pointer-events-none shadow-[0px_2px_3px_0px_inset_rgba(255,255,255,0.36)]" />
          </div>
        </div>
      </div>
    </>
  );
};

// Help Tooltip Component
interface HelpTooltipProps {
  isDarkMode?: boolean;
  tooltipKey: string;
  onTooltipOpen: (key: string) => void;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ isDarkMode = false, tooltipKey, onTooltipOpen }) => {
  return (
    <div 
      className="cursor-pointer relative size-4 hover:opacity-80 transition-opacity"
      onClick={() => onTooltipOpen(tooltipKey)}
    >
      <img 
        alt="Help" 
        className="block max-w-none size-full" 
        src={isDarkMode ? imgVectorDark : imgVector} 
      />
    </div>
  );
};

// Multi-week Selector Component
interface MultiSelectorProps {
  value: number;
  onChange: (value: number) => void;
  theme: {
    cardBackground: string;
    cardBorder: string;
    primaryButton: string;
    textMuted: string;
  };
}

const MultiSelector: React.FC<MultiSelectorProps> = ({ value, onChange, theme }) => {
  const weeks = [1, 2, 3, 4, 5];
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  
  // Calculate the position and width of the active selector
  const getSliderStyle = () => {
    const index = value - 1;
    const totalButtons = 5;
    
    // Account for the px-1 padding (4px on each side) in the buttons container
    // Container width without padding: calc(100% - 8px)
    // Each button takes 20% of the available space
    const buttonWidth = 100 / totalButtons; // 20% each
    const baseLeft = index * buttonWidth;
    
    // Add small padding to account for the px-1 container padding
    const paddingAdjustment = 0.3; // Small adjustment for visual centering
    const sliderWidth = buttonWidth - (paddingAdjustment * 2);
    const sliderLeft = baseLeft + paddingAdjustment;
    
    return {
      left: `${sliderLeft}%`,
      width: `${sliderWidth}%`
    };
  };

  // Get button background style based on state
  const getButtonStyle = (week: number) => {
    if (week === value) {
      return {}; // Selected button has no individual background (uses slider)
    }
    if (hoveredWeek === week) {
      return {
        backgroundColor: 'rgba(121,103,169,0.09)'
      };
    }
    return {};
  };
  
  return (
    <div 
      className="relative h-12 rounded-2xl border transition-all duration-300" 
      style={{ 
        backgroundColor: theme.cardBackground,
        borderColor: theme.cardBorder
      }}
    >
      <div 
        className="absolute top-[4.167%] bottom-[4.167%] rounded-[14px] shadow-[0px_2px_2px_0px_inset_rgba(255,255,255,0.25)] transition-all duration-300 ease-out"
        style={{ 
          backgroundColor: theme.primaryButton,
          ...getSliderStyle()
        }}
      />
      <div className="flex h-full items-center justify-between px-1 relative">
        {weeks.map((week) => (
          <button
            key={week}
            onClick={() => onChange(week)}
            onMouseEnter={() => setHoveredWeek(week)}
            onMouseLeave={() => setHoveredWeek(null)}
            className="flex-1 h-10 rounded-[14px] text-center transition-all duration-200 relative z-10 text-[20px]"
            style={{ 
              fontFamily: 'Manrope, sans-serif',
              color: value === week ? '#ffffff' : theme.textMuted,
              fontWeight: value === week ? 'bold' : 'normal',
              ...getButtonStyle(week)
            }}
          >
            {week}
          </button>
        ))}
      </div>
    </div>
  );
};

// Calculation Card Component
interface CalculationCardProps {
  label: string;
  value: string;
  showHelp?: boolean;
  theme: any;
  tooltipKey: string;
  onTooltipOpen: (key: string) => void;
}

const CalculationCard: React.FC<CalculationCardProps> = ({ label, value, showHelp = true, theme, tooltipKey, onTooltipOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Get interaction state styles
  const getCardStyles = () => {
    if (isPressed) {
      return {
        backgroundColor: 'rgba(83,64,132,0.16)',
        borderColor: theme.cardBorder
      };
    }
    if (isHovered) {
      return {
        backgroundColor: 'rgba(121,103,169,0.09)',
        borderColor: theme.cardBorder
      };
    }
    return {
      backgroundColor: theme.cardBackground,
      borderColor: theme.cardBorder
    };
  };

  const getTextColor = () => {
    return isPressed ? '#534084' : theme.textMuted;
  };

  const getLabelColor = () => {
    // If there's a real calculated value (not £0.00), use Figma filled state color
    if (value !== '£0.00' && value !== '£0') {
      return theme.background === '#1c1a20' ? '#ffffff' : '#aca0bb'; // White in dark mode, gray in light mode
    }
    return getTextColor();
  };

  const getPriceColor = () => {
    // If there's a real calculated value (not £0.00), use Figma filled state color
    if (value !== '£0.00' && value !== '£0') {
      return theme.background === '#1c1a20' ? '#e3d1ff' : '#8850e2'; // Light purple in dark mode, darker purple in light mode
    }
    return getTextColor();
  };

  const getPriceFontWeight = () => {
    // If there's a real calculated value, use semibold as per Figma
    if (value !== '£0.00' && value !== '£0') {
      return 'font-semibold';
    }
    return 'font-medium';
  };

  const getLabelFontWeight = () => {
    // If there's a real calculated value, use normal as per Figma
    if (value !== '£0.00' && value !== '£0') {
      return 'font-normal';
    }
    return '';
  };

  const getPriceFontSize = () => {
    // Calculate font size based on text length to prevent overflow
    // Only scale down when text is actually too long for the card
    const textLength = value.length;
    
    // Be more conservative - card width can handle more text at 24px
    if (textLength <= 10) return '24px'; // Normal text like "£10,000.00"
    if (textLength <= 13) return '22px'; // Longer text like "£100,000.00"
    if (textLength <= 16) return '20px'; // Very long text like "£1,000,000.00"
    return '18px'; // Extremely long text
  };

  const getPriceTopPosition = () => {
    // Adjust top position based on font size to maintain visual centering
    const fontSize = getPriceFontSize();
    if (fontSize === '24px') return '26px';
    if (fontSize === '22px') return '27px';
    if (fontSize === '20px') return '28px';
    return '29px'; // 18px font
  };

  const getHelpIcon = () => {
    if (isPressed) return imgVectorPressed;
    return theme.background === '#1c1a20' ? imgVectorDark : imgVector;
  };

  return (
    <div 
      className="cursor-pointer relative rounded-2xl border h-[68px] transition-all duration-200 md:h-[80px] md:desktop-card-hover"
      style={getCardStyles()}
      onClick={() => onTooltipOpen(tooltipKey)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <div 
        className={`absolute top-[9px] left-4 text-[14px] md:top-[12px] ${getLabelFontWeight()} transition-colors duration-200`}
        style={{ 
          fontFamily: 'Manrope, sans-serif',
          color: getLabelColor()
        }}
      >
        {label}
      </div>
      <div 
        className={`absolute left-[15px] md:top-[42px] ${getPriceFontWeight()} transition-all duration-200`}
        style={{ 
          fontFamily: 'Manrope, sans-serif',
          color: getPriceColor(),
          fontSize: getPriceFontSize(),
          top: getPriceTopPosition()
        }}
      >
        {value}
      </div>
      {showHelp && (
        <div 
          className="absolute top-[7.5px] right-[8.5px] w-[15px] h-[15px]"
          onClick={(e) => {
            e.stopPropagation();
            onTooltipOpen(tooltipKey);
          }}
        >
          <img 
            alt="Help" 
            className="block max-w-none size-full cursor-pointer transition-opacity duration-200 hover:opacity-80" 
            src={getHelpIcon()} 
          />
        </div>
      )}
    </div>
  );
};

// Theme detection hook
const useThemeDetection = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Use saved preference
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      updateDocumentTheme(isDark);
    } else {
      // Use system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const isDark = mediaQuery.matches;
      setIsDarkMode(isDark);
      updateDocumentTheme(isDark);
      
      // Listen for changes to system theme
      const handleChange = (e: MediaQueryListEvent) => {
        // Only update if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
          setIsDarkMode(e.matches);
          updateDocumentTheme(e.matches);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  const updateDocumentTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update theme-color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#1c1a20' : '#fcfcff');
    } else {
      // Create a new meta tag if it doesn't exist
      const newMeta = document.createElement('meta');
      newMeta.name = 'theme-color';
      newMeta.content = isDark ? '#1c1a20' : '#fcfcff';
      document.head.appendChild(newMeta);
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    updateDocumentTheme(newIsDark);
    // Save user preference
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return { isDarkMode, toggleTheme };
};

// Main Component - Add isDesktop prop
interface PricingDepositProps {
  isDesktop?: boolean;
}

const PricingDeposit: React.FC<PricingDepositProps> = ({ isDesktop = false }) => {
  const [weeklyRent, setWeeklyRent] = useState<string>('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [depositWeeks, setDepositWeeks] = useState<number>(1);
  const { isDarkMode, toggleTheme } = useThemeDetection(); // Use the theme detection hook
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [rentError, setRentError] = useState<string>('');

  // Theme configuration based on Figma design
  const theme = {
    background: isDarkMode ? '#1c1a20' : '#fcfcff',
    cardBackground: isDarkMode ? '#212124' : '#ffffff',
    cardBorder: isDarkMode ? '#303030' : '#e9dfdf',
    textPrimary: isDarkMode ? '#ffffff' : '#2f2a5f',
    textSecondary: isDarkMode ? '#6a6f73' : '#6a6f73', // Same in both modes
    textMuted: isDarkMode ? '#6a6a76' : '#aca0bb',
    inputPlaceholder: isDarkMode ? '#6a6a76' : '#aca0bb',
    progressBarInactive: isDarkMode ? '#303030' : '#e9dfdf',
    primaryButton: isDarkMode ? '#7f55c3' : '#8850e2', // Darker purple in dark mode
  };

  // Calculations
  const calculations = useMemo(() => {
    const rentAmount = parseFloat(weeklyRent) || 0;
    
    // Convert to monthly if needed
    const monthlyRent = frequency === 'weekly' 
      ? rentAmount * 52 / 12 
      : rentAmount;
    
    // Calculate Letly fee (5% of monthly rent)
    const letlyFee = monthlyRent * 0.05;
    
    // Amount landlord receives
    const landlordAmount = monthlyRent - letlyFee;
    
    // Deposit amount (based on weekly rent)
    const weeklyAmount = frequency === 'weekly' ? rentAmount : rentAmount * 12 / 52;
    const depositAmount = weeklyAmount * depositWeeks;
    
    return {
      monthlyRent,
      letlyFee,
      landlordAmount,
      depositAmount
    };
  }, [weeklyRent, frequency, depositWeeks]);

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      // Prevent input if it would exceed 99999
      const numValue = parseFloat(value);
      
      // Check if the value would exceed maximum - prevent the input
      if (numValue > 99999) {
        return; // Don't update state, effectively blocking the input
      }
      
      // Clear any existing error and update the value
      setRentError('');
      setWeeklyRent(value);
    }
  };

  const handleTooltipOpen = (key: string) => {
    setActiveTooltip(key);
  };

  const handleTooltipClose = () => {
    setActiveTooltip(null);
  };

  // Desktop-specific tooltip component
  const DesktopTooltip: React.FC<{
    title: string;
    content: string;
    children: React.ReactNode;
  }> = ({ title, content, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (isOpen && triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        // Position tooltip above the trigger element
        const top = triggerRect.top - tooltipRect.height - 10;
        const left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        
        // Ensure tooltip stays within viewport
        const adjustedLeft = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
        const adjustedTop = top < 10 ? triggerRect.bottom + 10 : top;
        
        setPosition({ top: adjustedTop, left: adjustedLeft });
      }
    }, [isOpen]);

    return (
      <>
        <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
          {children}
        </div>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <div
              ref={tooltipRef}
              className="fixed z-50 p-6 rounded-2xl shadow-xl max-w-sm transition-all duration-200"
              style={{
                backgroundColor: theme.cardBackground,
                border: `1px solid ${theme.cardBorder}`,
                top: `${position.top}px`,
                left: `${position.left}px`,
              }}
            >
              <h3 
                className="text-lg font-bold mb-2"
                style={{ color: theme.textPrimary }}
              >
                {title}
              </h3>
              <p 
                className="text-sm"
                style={{ color: theme.textSecondary }}
              >
                {content}
              </p>
            </div>
          </>
        )}
      </>
    );
  };

  if (isDesktop) {
    return (
      <div 
        className={`min-h-screen relative transition-all duration-300 ${isDarkMode ? 'dark' : ''}`}
        style={{ 
          backgroundColor: theme.background,
          paddingTop: 0,
          marginTop: 0 
        }}
      >
        {/* Desktop Layout */}
        <div className="max-w-6xl mx-auto p-8">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="h-1 max-w-md mx-auto mb-12 flex gap-2">
              <div 
                className="flex-1 h-1 rounded-sm transition-all duration-300"
                style={{ backgroundColor: theme.primaryButton }}
              ></div>
              <div 
                className="flex-1 h-1 rounded-sm transition-all duration-300"
                style={{ backgroundColor: theme.primaryButton }}
              ></div>
              <div 
                className="flex-1 h-1 rounded-sm transition-all duration-300"
                style={{ backgroundColor: theme.progressBarInactive }}
              ></div>
            </div>
            
            <h1 
              className="text-4xl font-bold mb-3 cursor-pointer transition-all duration-300 hover:opacity-80" 
              style={{ 
                fontFamily: 'Manrope, sans-serif',
                color: theme.textPrimary
              }}
              onClick={toggleTheme}
            >
              Set Your Rental Terms
            </h1>
            <p 
              className="text-lg font-light" 
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                letterSpacing: '0.5px',
                color: theme.textSecondary
              }}
            >
              Configure terms that work for you
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Input Section */}
            <div className="space-y-8">
              {/* Frequency Toggle */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <label 
                    className="text-lg font-semibold transition-all duration-300" 
                    style={{ 
                      fontFamily: 'Manrope, sans-serif',
                      color: theme.textPrimary
                    }}
                  >
                    Frequency
                  </label>
                  <DesktopTooltip
                    title={tooltipData.frequency.title}
                    content={tooltipData.frequency.content}
                  >
                    <HelpTooltip 
                      isDarkMode={isDarkMode} 
                      tooltipKey="frequency"
                      onTooltipOpen={() => {}}
                    />
                  </DesktopTooltip>
                </div>
                <div 
                  className="relative rounded-2xl border p-1.5 transition-all duration-300"
                  style={{ 
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.cardBorder
                  }}
                >
                  <div
                    className={`absolute top-1.5 h-[calc(100%-12px)] rounded-[14px] shadow-[0px_2px_2px_0px_inset_rgba(255,255,255,0.25)] transition-all duration-300 ease-out ${
                      frequency === 'weekly' ? 'left-1.5 w-[calc(50%-3px)]' : 'left-[calc(50%+3px)] w-[calc(50%-9px)]'
                    }`}
                    style={{ backgroundColor: theme.primaryButton }}
                  />
                  <div className="relative flex">
                    <button
                      onClick={() => setFrequency('weekly')}
                      className="flex-1 py-3 rounded-[14px] transition-all duration-300 relative z-10 text-lg"
                      style={{ 
                        fontFamily: 'Manrope, sans-serif',
                        color: frequency === 'weekly' ? '#ffffff' : theme.textMuted,
                        fontWeight: frequency === 'weekly' ? '600' : '300'
                      }}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setFrequency('monthly')}
                      className="flex-1 py-3 rounded-[14px] transition-all duration-300 relative z-10 text-lg"
                      style={{ 
                        fontFamily: 'Manrope, sans-serif',
                        color: frequency === 'monthly' ? '#ffffff' : theme.textMuted,
                        fontWeight: frequency === 'monthly' ? '600' : '300'
                      }}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
              </div>

              {/* Rent Input */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label 
                    className="text-lg font-semibold transition-all duration-300" 
                    style={{ 
                      fontFamily: 'Manrope, sans-serif',
                      color: theme.textPrimary
                    }}
                  >
                    {frequency === 'weekly' ? 'Weekly Rent' : 'Monthly Rent'}
                  </label>
                  {rentError && (
                    <span 
                      className="text-sm font-medium transition-all duration-300"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: '#ef4444'
                      }}
                    >
                      {rentError}
                    </span>
                  )}
                </div>
                <div 
                  className="rounded-2xl border flex items-center px-6 h-14 transition-all duration-300"
                  style={{ 
                    backgroundColor: theme.cardBackground,
                    borderColor: rentError ? '#ef4444' : (isInputFocused ? theme.primaryButton : theme.cardBorder)
                  }}
                >
                  <div className="w-6 h-6 mr-3">
                    <img alt="Pound" className="w-full h-full" src={imgPound} />
                  </div>
                  <input
                    type="text"
                    value={weeklyRent}
                    onChange={handleRentChange}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder={`What tenants will pay per ${frequency === 'weekly' ? 'week' : 'month'}`}
                    className="pricing-input flex-1 outline-none text-lg bg-transparent transition-all duration-300"
                    style={{ 
                      fontFamily: 'Manrope, sans-serif',
                      color: theme.textPrimary
                    }}
                  />
                </div>
              </div>

              {/* Deposit Amount */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <label 
                    className="text-lg font-semibold transition-all duration-300" 
                    style={{ 
                      fontFamily: 'Manrope, sans-serif',
                      color: theme.textPrimary
                    }}
                  >
                    Deposit Amount
                  </label>
                  <DesktopTooltip
                    title={tooltipData.deposit.title}
                    content={tooltipData.deposit.content}
                  >
                    <HelpTooltip 
                      isDarkMode={isDarkMode} 
                      tooltipKey="deposit"
                      onTooltipOpen={() => {}}
                    />
                  </DesktopTooltip>
                </div>
                <MultiSelector value={depositWeeks} onChange={setDepositWeeks} theme={theme} />
              </div>
            </div>

            {/* Right Column - Calculations */}
            <div>
              <h2 
                className="text-lg font-semibold mb-6 transition-all duration-300" 
                style={{ 
                  fontFamily: 'Manrope, sans-serif',
                  color: theme.textPrimary
                }}
              >
                Calculations
              </h2>
                             <div className="grid grid-cols-2 gap-2">
                 <div className="col-span-2">
                   <DesktopTooltip
                     title={tooltipData.rental.title}
                     content={tooltipData.rental.content}
                   >
                     <CalculationCard 
                       label="Monthly Rental:" 
                       value={formatCurrency(calculations.monthlyRent)} 
                       theme={theme}
                       tooltipKey="rental"
                       onTooltipOpen={() => {}}
                       showHelp={false}
                     />
                   </DesktopTooltip>
                 </div>
                 <DesktopTooltip
                   title={tooltipData.letlyFee.title}
                   content={tooltipData.letlyFee.content}
                 >
                   <CalculationCard 
                     label="Letly fee:" 
                     value={formatCurrency(calculations.letlyFee)} 
                     theme={theme}
                     tooltipKey="letlyFee"
                     onTooltipOpen={() => {}}
                     showHelp={false}
                   />
                 </DesktopTooltip>
                 <DesktopTooltip
                   title={tooltipData.depositTotal.title}
                   content={tooltipData.depositTotal.content}
                 >
                   <CalculationCard 
                     label="Deposit total:" 
                     value={formatCurrency(calculations.depositAmount)} 
                     theme={theme}
                     tooltipKey="depositTotal"
                     onTooltipOpen={() => {}}
                     showHelp={false}
                   />
                 </DesktopTooltip>
                 <div className="col-span-2">
                   <DesktopTooltip
                     title={tooltipData.youReceive.title}
                     content={tooltipData.youReceive.content}
                   >
                     <CalculationCard 
                       label="You receive:" 
                       value={formatCurrency(calculations.landlordAmount)} 
                       theme={theme}
                       tooltipKey="youReceive"
                       onTooltipOpen={() => {}}
                       showHelp={false}
                     />
                   </DesktopTooltip>
                 </div>
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="max-w-md mx-auto space-y-4">
            <button 
              className="w-full text-white py-4 rounded-2xl text-lg shadow-[0px_2px_3px_0px_inset_rgba(255,255,255,0.36)] transition-all duration-300 hover:opacity-90"
              style={{ 
                fontFamily: 'Manrope, sans-serif',
                backgroundColor: theme.primaryButton,
                fontWeight: '600'
              }}
            >
              Continue
            </button>

            <button 
              className="w-full text-lg font-medium py-3 transition-all duration-300 hover:opacity-70"
              style={{ 
                fontFamily: 'Manrope, sans-serif',
                color: theme.textSecondary
              }}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Original mobile layout
  return (
    <div 
      className={`min-h-screen relative transition-all duration-300 ${isDarkMode ? 'dark' : ''}`}
      style={{ 
        backgroundColor: theme.background,
        paddingTop: 0,
        marginTop: 0 
      }}
    >
      {/* Header */}
      <div className="h-[32px] relative pt-2">
        {/* Progress Indicator */}
        <div className="h-1 mx-5 flex gap-1">
          <div 
            className="flex-1 h-1 rounded-sm transition-all duration-300"
            style={{ backgroundColor: theme.primaryButton }}
          ></div>
          <div 
            className="flex-1 h-1 rounded-sm transition-all duration-300"
            style={{ backgroundColor: theme.primaryButton }}
          ></div>
          <div 
            className="flex-1 h-1 rounded-sm transition-all duration-300"
            style={{ backgroundColor: theme.progressBarInactive }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5">
        {/* Title */}
        <h1 
          className="text-[26px] font-bold mb-1 cursor-pointer transition-all duration-300 hover:opacity-80" 
          style={{ 
            fontFamily: 'Manrope, sans-serif',
            color: theme.textPrimary
          }}
          onClick={toggleTheme} // Use the toggleTheme function instead of manual state toggle
        >
          Set Your Rental Terms
        </h1>
        <p 
          className="text-[15px] font-light mb-6 transition-all duration-300" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            letterSpacing: '0.5px',
            color: theme.textSecondary
          }}
        >
          Configure terms that work for you
        </p>

        {/* Frequency Toggle */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <label 
              className="text-[15px] font-semibold transition-all duration-300" 
              style={{ 
                fontFamily: 'Manrope, sans-serif',
                color: theme.textPrimary
              }}
            >
              Frequency
            </label>
            <HelpTooltip 
              isDarkMode={isDarkMode} 
              tooltipKey="frequency"
              onTooltipOpen={handleTooltipOpen}
            />
          </div>
          <div 
            className="relative rounded-2xl border p-1 transition-all duration-300"
            style={{ 
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder
            }}
          >
            <div
              className={`absolute top-1 h-[calc(100%-8px)] rounded-[14px] shadow-[0px_2px_2px_0px_inset_rgba(255,255,255,0.25)] transition-all duration-300 ease-out ${
                frequency === 'weekly' ? 'left-1 w-[calc(50%-2px)]' : 'left-[calc(50%+2px)] w-[calc(50%-6px)]'
              }`}
              style={{ backgroundColor: theme.primaryButton }}
            />
            <div className="relative flex">
              <button
                onClick={() => setFrequency('weekly')}
                className="flex-1 py-2 rounded-[14px] transition-all duration-300 relative z-10"
                style={{ 
                  fontFamily: 'Manrope, sans-serif',
                  color: frequency === 'weekly' ? '#ffffff' : theme.textMuted,
                  fontWeight: frequency === 'weekly' ? '600' : '300' // Semibold when selected, light when unselected
                }}
              >
                Weekly
              </button>
              <button
                onClick={() => setFrequency('monthly')}
                className="flex-1 py-2 rounded-[14px] transition-all duration-300 relative z-10"
                style={{ 
                  fontFamily: 'Manrope, sans-serif',
                  color: frequency === 'monthly' ? '#ffffff' : theme.textMuted,
                  fontWeight: frequency === 'monthly' ? '600' : '300' // Semibold when selected, light when unselected
                }}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Rent Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label 
              className="text-[15px] font-semibold transition-all duration-300" 
              style={{ 
                fontFamily: 'Manrope, sans-serif',
                color: theme.textPrimary
              }}
            >
              {frequency === 'weekly' ? 'Weekly Rent' : 'Monthly Rent'}
            </label>
            {rentError && (
              <span 
                className="text-[13px] font-medium transition-all duration-300"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#ef4444' // Red color for error
                }}
              >
                {rentError}
              </span>
            )}
          </div>
          <div 
            className="rounded-2xl border flex items-center px-4 h-12 transition-all duration-300"
            style={{ 
              backgroundColor: theme.cardBackground,
              borderColor: rentError ? '#ef4444' : (isInputFocused ? theme.primaryButton : theme.cardBorder)
            }}
          >
            <div className="w-5 h-5 mr-2">
              <img alt="Pound" className="w-full h-full" src={imgPound} />
            </div>
            <input
              type="text"
              value={weeklyRent}
              onChange={handleRentChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder={`What tenants will pay per ${frequency === 'weekly' ? 'week' : 'month'}`}
              className="pricing-input flex-1 outline-none text-[16px] bg-transparent transition-all duration-300"
              style={{ 
                fontFamily: 'Manrope, sans-serif',
                color: theme.textPrimary
              }}
            />
          </div>
        </div>

        {/* Deposit Amount */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <label 
              className="text-[15px] font-semibold transition-all duration-300" 
              style={{ 
                fontFamily: 'Manrope, sans-serif',
                color: theme.textPrimary
              }}
            >
              Deposit Amount
            </label>
            <HelpTooltip 
              isDarkMode={isDarkMode} 
              tooltipKey="deposit"
              onTooltipOpen={handleTooltipOpen}
            />
          </div>
          <MultiSelector value={depositWeeks} onChange={setDepositWeeks} theme={theme} />
        </div>

        {/* Calculations */}
        <div className="mb-8">
          <h2 
            className="text-[15px] font-semibold mb-3 transition-all duration-300" 
            style={{ 
              fontFamily: 'Manrope, sans-serif',
              color: theme.textPrimary
            }}
          >
            Calculations
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <CalculationCard 
              label="Rental:" 
              value={formatCurrency(calculations.monthlyRent)} 
              theme={theme}
              tooltipKey="rental"
              onTooltipOpen={handleTooltipOpen}
            />
            <CalculationCard 
              label="Letly fee:" 
              value={formatCurrency(calculations.letlyFee)} 
              theme={theme}
              tooltipKey="letlyFee"
              onTooltipOpen={handleTooltipOpen}
            />
            <CalculationCard 
              label="You receive:" 
              value={formatCurrency(calculations.landlordAmount)} 
              theme={theme}
              tooltipKey="youReceive"
              onTooltipOpen={handleTooltipOpen}
            />
            <CalculationCard 
              label="Deposit total:" 
              value={formatCurrency(calculations.depositAmount)} 
              theme={theme}
              tooltipKey="depositTotal"
              onTooltipOpen={handleTooltipOpen}
            />
          </div>
        </div>

        {/* Continue Button */}
        <button 
          className="w-full text-white py-4 rounded-2xl text-[16px] shadow-[0px_2px_3px_0px_inset_rgba(255,255,255,0.36)] mb-4 transition-all duration-300"
          style={{ 
            fontFamily: 'Manrope, sans-serif',
            backgroundColor: theme.primaryButton,
            fontWeight: '600' // Semibold to match Figma design
          }}
        >
          Continue
        </button>

        {/* Go Back Link */}
        <button 
          className="w-full text-[16px] font-medium py-2 transition-all duration-300 hover:opacity-80"
          style={{ 
            fontFamily: 'Manrope, sans-serif',
            color: theme.textSecondary
          }}
        >
          Go back
        </button>
      </div>
      
      {/* Tooltip Modal */}
      {activeTooltip && (
        <TooltipModal
          isOpen={!!activeTooltip}
          title={tooltipData[activeTooltip as keyof typeof tooltipData]?.title || ''}
          content={tooltipData[activeTooltip as keyof typeof tooltipData]?.content || ''}
          onClose={handleTooltipClose}
          theme={theme}
        />
      )}
    </div>
  );
};

export default PricingDeposit; 