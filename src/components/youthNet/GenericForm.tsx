import React from "react";
import {
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    Box,
} from "@mui/material";

interface Field {
    type: any;
    label: string;
    options?: { label: string; value: string }[];
}

interface GenericFormProps {
    fields: Field[];
}

const GenericForm: React.FC<GenericFormProps> = ({ fields }) => {
    return (
        <Box
            component="form"
            sx={{
                maxWidth: 400,
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: 2,
                border: "1px solid #ddd",
                borderRadius: "8px",
            }}
        >
            {fields.map((field, index) => {
                switch (field.type) {
                    case "text":
                    case "email":
                    case "number":
                        return (
                            <TextField
                                key={index}
                                label={field.label}
                                type={field.type}
                                variant="outlined"
                                fullWidth
                            />
                        );
                    case "radio":
                        return (
                            <Box key={index}>
                                <FormLabel>{field.label}</FormLabel>
                                <RadioGroup row>
                                    {field.options?.map((option, i) => (
                                        <FormControlLabel
                                            key={i}
                                            value={option.value}
                                            control={<Radio />}
                                            label={option.label}
                                        />
                                    ))}
                                </RadioGroup>
                            </Box>
                        );
                    default:
                        return null;
                }
            })}
        </Box>
    );
};

export default GenericForm;