'use client'

import React from 'react'
import { XIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface FilterSidebarProps {
  filters: {
    specialties: Array<{ id: string; title: string }>
    languages: Array<{ id: string; name: string }>
  }
  selected: {
    specialty?: string
    language?: string
    format?: string
    minPrice?: number
    maxPrice?: number
  }
  onChange: (filters: FilterSidebarProps['selected']) => void
  className?: string
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  selected,
  onChange,
  className,
}) => {
  const hasActiveFilters = Object.values(selected).some(
    (v) => v !== undefined && v !== '' && v !== null,
  )

  return (
    <aside className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({})}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Specialty */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Specialty</h4>
        <div className="space-y-2">
          {filters.specialties.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="radio"
                name="specialty"
                checked={selected.specialty === s.id}
                onChange={() =>
                  onChange({ ...selected, specialty: selected.specialty === s.id ? undefined : s.id })
                }
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              />
              {s.title}
            </label>
          ))}
        </div>
      </div>

      {/* Session Format */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Session format</h4>
        <div className="space-y-2">
          {['online', 'in-person'].map((format) => (
            <label key={format} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="radio"
                name="format"
                checked={selected.format === format}
                onChange={() =>
                  onChange({ ...selected, format: selected.format === format ? undefined : format })
                }
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              />
              {format === 'online' ? 'Online' : 'In-person'}
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Language</h4>
        <div className="space-y-2">
          {filters.languages.map((l) => (
            <label key={l.id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="radio"
                name="language"
                checked={selected.language === l.id}
                onChange={() =>
                  onChange({ ...selected, language: selected.language === l.id ? undefined : l.id })
                }
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              />
              {l.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">
          Price range
          {(selected.minPrice || selected.maxPrice) && (
            <span className="ml-2 text-xs text-muted-foreground">
              RM{selected.minPrice || 0} - RM{selected.maxPrice || '500+'}
            </span>
          )}
        </h4>
        <input
          type="range"
          min={0}
          max={500}
          step={10}
          value={selected.maxPrice || 500}
          onChange={(e) =>
            onChange({ ...selected, maxPrice: Number(e.target.value) || undefined })
          }
          className="w-full accent-primary"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>RM0</span>
          <span>RM500+</span>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selected.specialty && (
            <FilterChip
              label={filters.specialties.find((s) => s.id === selected.specialty)?.title || ''}
              onRemove={() => onChange({ ...selected, specialty: undefined })}
            />
          )}
          {selected.format && (
            <FilterChip
              label={selected.format === 'online' ? 'Online' : 'In-person'}
              onRemove={() => onChange({ ...selected, format: undefined })}
            />
          )}
          {selected.language && (
            <FilterChip
              label={filters.languages.find((l) => l.id === selected.language)?.name || ''}
              onRemove={() => onChange({ ...selected, language: undefined })}
            />
          )}
          {selected.maxPrice && selected.maxPrice < 500 && (
            <FilterChip
              label={`Up to RM${selected.maxPrice}`}
              onRemove={() => onChange({ ...selected, maxPrice: undefined })}
            />
          )}
        </div>
      )}
    </aside>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      {label}
      <button onClick={onRemove} className="hover:text-primary/70">
        <XIcon className="h-3 w-3" />
      </button>
    </span>
  )
}
