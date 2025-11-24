'use client'

import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'

interface FilterSection {
  title: string
  type: 'checkbox' | 'range'
  options?: { label: string; value: string }[]
  min?: number
  max?: number
  defaultValue?: number[]
}

interface CategoryFilterProps {
  filters: FilterSection[]
  onFilterChange: (filterType: string, value: any) => void
  selectedFilters: Record<string, any>
}

export default function CategoryFilter({ filters, onFilterChange, selectedFilters }: CategoryFilterProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Expand all sections by default
    const defaultExpanded: Record<string, boolean> = {}
    filters.forEach((filter) => {
      defaultExpanded[filter.title] = true
    })
    setExpandedSections(defaultExpanded)
  }, [filters])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleCheckboxChange = (filterTitle: string, value: string, checked: boolean) => {
    const currentValues = selectedFilters[filterTitle] || []
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter((v: string) => v !== value)
    }

    onFilterChange(filterTitle, newValues)
  }

  const handleRangeChange = (filterTitle: string, values: number[]) => {
    onFilterChange(filterTitle, values)
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200">
      {filters.map((filter, index) => (
        <div key={index} className="border-b border-gray-200 last:border-b-0">
          {/* Filter Header */}
          <button
            onClick={() => toggleSection(filter.title)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">{filter.title}</h3>
            {expandedSections[filter.title] ? (
              <BiChevronUp className="text-gray-600" size={20} />
            ) : (
              <BiChevronDown className="text-gray-600" size={20} />
            )}
          </button>

          {/* Filter Content */}
          {expandedSections[filter.title] && (
            <div className="px-4 pb-4">
              {filter.type === 'checkbox' && filter.options && (
                <div className="space-y-3">
                  {filter.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${filter.title}-${option.value}`}
                        checked={(selectedFilters[filter.title] || []).includes(option.value)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(filter.title, option.value, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`${filter.title}-${option.value}`}
                        className="text-sm font-normal text-gray-700 cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {filter.type === 'range' && filter.min !== undefined && filter.max !== undefined && (
                <div className="space-y-4">
                  <Slider
                    min={filter.min}
                    max={filter.max}
                    step={1000}
                    value={selectedFilters[filter.title] || filter.defaultValue || [filter.min, filter.max]}
                    onValueChange={(values) => handleRangeChange(filter.title, values)}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <input
                      type="number"
                      value={(selectedFilters[filter.title] || filter.defaultValue || [filter.min])[0]}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || filter.min
                        const currentMax = (selectedFilters[filter.title] || filter.defaultValue || [filter.min, filter.max])[1]
                        handleRangeChange(filter.title, [newValue, currentMax])
                      }}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={(selectedFilters[filter.title] || filter.defaultValue || [filter.min, filter.max])[1]}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || filter.max
                        const currentMin = (selectedFilters[filter.title] || filter.defaultValue || [filter.min, filter.max])[0]
                        handleRangeChange(filter.title, [currentMin, newValue])
                      }}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
