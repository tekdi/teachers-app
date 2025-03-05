"use client"

import type React from "react"

import { useState } from "react"
import { TextField, InputAdornment } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useDebouncedCallback } from "use-debounce"

interface SearchInputProps {
  placeholder?: string
  defaultValue?: string
  onSearch: (term: string) => void
}

export function SearchInput({ placeholder = "Search...", defaultValue = "", onSearch }: SearchInputProps) {
  const [value, setValue] = useState(defaultValue)

  const debouncedSearch = useDebouncedCallback((term: string) => {
    onSearch(term)
  }, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    debouncedSearch(newValue)
  }

  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      variant="outlined"
      fullWidth
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  )
}

