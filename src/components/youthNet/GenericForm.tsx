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
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
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
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        color: '#4D4639',
                                        fontSize:'12px',
                                        fontWeight:'400'
                                    },
                                }}
                            />
                        );
                    case "radio":
                        return (
                            <Box key={index}>
                                <FormLabel sx={{
                                    color: '#4D4639',
                                    fontSize: '12px',
                                    fontWeight: '400'
                                }}>{field.label}</FormLabel>
                                <RadioGroup row>
                                    {field.options?.map((option, i) => (
                                        <FormControlLabel
                                            sx={{
                                                color: '#4D4639',
                                                fontSize: '12px',
                                                fontWeight: '400'
                                            }}
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