import { getCategories, getSkills, getLocation, getLocationCode } from "@/lib/api"
import { Box, FormControl, InputLabel, MenuItem, Select, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "next-i18next";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "Archived", value: "archived" },
]

interface OpportunityFiltersProps {
  selectedCategory?: string
  selectedSkills?: string
  selectedStatus?: string
  onFilterChange: (name: string, value: string) => void
}

interface options {
  id: string
  name: string
  country: string
  state: string
  city: string
}

export function OpportunityFilters({
  selectedCategory,
  selectedSkills,
  selectedStatus,
  onFilterChange,
}: OpportunityFiltersProps) {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);

  // Location-based states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [locationCode, setLocationCode] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const [categoryList, skillList] = await Promise.all([
          getCategories(),
          getSkills(),
        ]);
        setCategories(categoryList?.result);
        setSkills(skillList?.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Fetch Countries
  useEffect(() => {
    async function fetchCountries() {
      try {
        const countriesResponse = await getLocation();
        setCountries(countriesResponse.result);
      } catch (e) {
        console.error("Error fetching countries:", e);
      }
    }
    fetchCountries();
  }, []);

  // Fetch States based on selected Country
  useEffect(() => {
    if (selectedCountry) {
      getLocation({ country: selectedCountry })
        .then((data) => setStates(data.result))
        .catch((err) => console.error("Error fetching states:", err));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  // Fetch Cities based on selected State
  useEffect(() => {
    if (selectedCountry && selectedState) {
      getLocation({ country: selectedCountry, state: selectedState })
        .then((data) => setCities(data.result))
        .catch((err) => console.error("Error fetching cities:", err));
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  // Fetch Location Code based on Country, State, and City
  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      getLocationCode({ country: selectedCountry, state: selectedState, city: selectedCity })
        .then((data) => {
          const code = data.result[0]?.id || "";
          setLocationCode(code);
          onFilterChange("location", code);
        })
        .catch((err) => console.error("Error fetching location code:", err));
    } else {
      setLocationCode("");
    }
  }, [selectedCountry, selectedState, selectedCity]);


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        width: { xs: "100%", md: "auto" },
      }}
    >
      {/* Category Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('OPPORTUNITY.CATEGORY')}</InputLabel>
        <Select
          value={selectedCategory || "all"}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <MenuItem value="all">{t('OPPORTUNITY.ALL_CATEGORY')}</MenuItem>
          {categories.map((option:options) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Skills Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('OPPORTUNITY.SKILLS')}</InputLabel>
        <Select
          value={selectedSkills || "all"}
          onChange={(e) => onFilterChange("skills", e.target.value)}
        >
          <MenuItem value="all">{t('OPPORTUNITY.ALL_SKILLS')}</MenuItem>
          {skills.map((option:options) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('OPPORTUNITY.STATUS')}</InputLabel>
        <Select
          value={selectedStatus || "all"}
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          <MenuItem value="all">{t('OPPORTUNITY.ALL_STATUS')}</MenuItem>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Country Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('OPPORTUNITY.COUNTRY')}</InputLabel>
        <Select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countries.map((item:options) => (
            <MenuItem key={item.country} value={item.country}>
              {item.country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* State Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('OPPORTUNITY.COUNTY')}</InputLabel>
        <Select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          disabled={!selectedCountry}
        >
          {states.map((item:options) => (
            <MenuItem key={item.state} value={item.state}>
              {item.state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* City Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('OPPORTUNITY.SUBCOUNTY')}</InputLabel>
        <Select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
        >
          {cities.map((item:options) => (
            <MenuItem key={item.city} value={item.city}>
              {item.city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
