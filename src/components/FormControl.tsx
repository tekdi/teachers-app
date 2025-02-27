import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "next-i18next";
import { useMediaQuery } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultipleSelectCheckmarksProps {
  names: string[];
  codes: string[];
  tagName: string;
  selectedCategories: string[];
  onCategoryChange: (selectedNames: string[], selectedCodes: string[], selectedCohortId?: any) => void;
  disabled?: boolean;
  overall?: boolean;
  defaultValue?: string;
  width?:any
  cohortIds?:any
}

const MultipleSelectCheckmarks: React.FC<MultipleSelectCheckmarksProps> = ({
  names,
  codes,
  tagName,
  selectedCategories,
  onCategoryChange,
  disabled = false,
  overall = false,
  defaultValue,
  width,
  cohortIds
}) => {
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );
  const isMediumScreen = useMediaQuery("(max-width:900px)");

  const handleChange = (
    event: SelectChangeEvent<typeof selectedCategories>
  ) => {
    const {
      target: { value },
    } = event;

    let selectedNames = typeof value === "string" ? value.split(",") : value;

    if (selectedNames.includes("all")) {
      selectedNames = defaultValue ? [defaultValue] : [];
    }

    const selectedCodes = selectedNames?.map(
      (name) => codes[names?.indexOf(name)]
    );
    const selectedCohortId = selectedNames?.map(
      (name) => cohortIds?.[names?.indexOf(name)]
    ); 
//const selectedCohortId="";
    onCategoryChange(selectedNames, selectedCodes, selectedCohortId);
  };

  return (
    <div>
      <FormControl sx={{ width: "100%" }} disabled={disabled}>
        <InputLabel id="multiple-checkbox-label">{tagName}</InputLabel>
        <Select
          labelId="multiple-checkbox-label"
          id="multiple-checkbox"
          value={
            selectedCategories?.length === 0 || selectedCategories[0] === ""
              ? defaultValue
                ? [defaultValue]
                : ""
              : selectedCategories
          }
          sx={{ width: width? width:undefined }}
          onChange={handleChange}
          input={<OutlinedInput label={tagName} />}
          renderValue={(selected) => {
            const selectedArray = Array.isArray(selected)
              ? selected
              : [selected];
            return selectedArray.join(", ");
          }}
          MenuProps={MenuProps}
        >
          {overall && (
            <MenuItem value="all">
              <em>{t("COMMON.ALL")}</em>
            </MenuItem>
          )}

          {names?.map((name) => (
            <MenuItem key={name} value={name}>
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleSelectCheckmarks;
