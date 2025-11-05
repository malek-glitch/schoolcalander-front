import React, { useMemo, useState } from "react";

// Inline SVG definition for Search Icon (assuming Lucide-react equivalent)
const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function Header({
  title,
  subtitle,
  meta = [], // array of { label, value }
  breadcrumbs = [], // array of { label, href }
  avatarUrl, // optional avatar at left of title
  userName, // optional explicit user name for right avatar
  showSearch = false,
  onSearch = () => {},
  searchPlaceholder = "Search...",

  // Sleek dark gray default background
  backgroundClass = "bg-gray-800",
}) {
  // Memoize the initial calculation to run only when dependencies change
  const initial = useMemo(() => {
    return (userName || title || "?").trim().charAt(0).toUpperCase();
  }, [userName, title]);

  // State to handle search input focus/hover effects
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Helper component for the user avatar/initials badge
  const UserBadge = () => (
    <div className="shrink-0 flex items-center">
      <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-base font-semibold ring-2 ring-white/50 cursor-pointer transition hover:bg-white/30">
        {initial}
      </div>
    </div>
  );

  return (
    <header className={`sticky top-0 z-30 ${backgroundClass} text-white shadow-lg`}>
      <div className="px-4 sm:px-6 py-3">
        
        {/* MAIN CONTAINER: Flex row for desktop, stacks/wraps on mobile */}
        <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">

          {/* LEFT BLOCK (Context): Avatar, Titles, Breadcrumbs. Takes priority on desktop (order-1) */}
          <div className="flex items-start gap-3 min-w-0 flex-1 order-2 sm:order-1 w-full sm:w-auto">
            
            {avatarUrl && (
              <img src={avatarUrl} alt="avatar" className="h-10 w-10 rounded-full ring-2 ring-white/50 object-cover mt-1.5 sm:mt-0" />
            )}
            
            <div className="min-w-0 py-1">
              
              {/* Breadcrumbs are now stacked above the title */}
              <nav aria-label="Breadcrumb">
                {breadcrumbs.length > 0 && (
                  <ol className="flex items-center flex-wrap gap-x-2 text-xs font-medium text-white/60 mb-1">
                    {breadcrumbs.map((bc, idx) => (
                      <li key={idx} className="flex items-center text-ellipsis overflow-hidden whitespace-nowrap">
                        {idx > 0 && <span className="opacity-60 mx-1">/</span>}
                        {bc.href ? (
                          <a href={bc.href} className="hover:text-white transition-colors">
                            {bc.label}
                          </a>
                        ) : (
                          <span className="text-white/95 truncate">{bc.label}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </nav>

              {/* Title and Subtitle */}
              <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold tracking-tight text-white truncate">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="hidden sm:block text-white/85 text-base font-medium truncate border-l border-white/30 pl-4">
                      {subtitle}
                    </p>
                  )}
              </div>
              
              {/* Meta tags for small utility info */}
              {meta.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  {meta.map((m, idx) => (
                    <span key={idx} className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/90 shadow-sm transition hover:bg-white/20">
                      <span className="font-medium mr-1 opacity-90">{m.label}:</span>
                      <span className="font-normal opacity-95">{m.value}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* RIGHT BLOCK (Actions): Search & User Badge. Takes priority on mobile (order-1) */}
          <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
            {showSearch && (
              <div className={`w-full sm:w-64 transition-all duration-300 ${isSearchFocused ? 'sm:w-80' : ''}`}>
                <div className="relative">
                  <input
                    type="search"
                    className={`w-full rounded-lg bg-white/10 text-white placeholder-white/50 pl-10 pr-4 py-2 shadow-inner outline-none text-sm border-2 transition-all duration-300 ${
                      isSearchFocused ? "border-white/50 bg-white/20" : "border-transparent focus:border-white/30"
                    }`}
                    placeholder={searchPlaceholder}
                    onChange={(e) => onSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-white/70 transition-colors duration-300 ${isSearchFocused ? 'text-white' : ''}`}>
                    <SearchIcon className="w-5 h-5" />
                  </span>
                </div>
              </div>
            )}
            
            <UserBadge />
          </div>

        </div>
      </div>
    </header>
  );
}
