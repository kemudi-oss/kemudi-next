'use client'

import React from 'react'
import { SearchIcon } from 'lucide-react'

interface SearchButtonProps {
  onClick: () => void
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Search"
    >
      <SearchIcon className="h-4 w-4" />
    </button>
  )
}
