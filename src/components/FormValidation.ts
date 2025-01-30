import { RJSFSchema, FormValidation } from "@rjsf/utils";

// Get fields that have dob validation
const getFieldsWithDobValidation = (schemaProperties: any): string[] => 
    Object.keys(schemaProperties || {}).filter(
        (key) => schemaProperties?.[key]?.validation?.includes("dob")
    );

// Validate DOB against min and max dates
const validateDob = (formData: Record<string, any>, errors: FormValidation, field: string, t: any) => {
    const minDate = "1950-01-01";
    
    // Calculate yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const maxDate = yesterday.toISOString().split("T")[0];

    if (formData[field] && formData[field] < minDate) {
        errors[field]?.addError(t(`FORM_ERROR_MESSAGES.DATE_MUST_BE_ON_OR_AFTER`, { date: minDate }));
    }
    if (formData[field] && formData[field] > maxDate) {
        errors[field]?.addError(t(`FORM_ERROR_MESSAGES.DATE_MUST_BE_ON_OR_BEFORE`, { date: maxDate }));
    }

    return errors;
};

// Custom validation function that matches the expected RJSF signature
export const customValidation = (schema: RJSFSchema, t: any) => 
    (formData: Record<string, any>, errors: FormValidation, uiSchema: any): FormValidation => {
        if (!schema?.properties) return errors;

        const fields = getFieldsWithDobValidation(schema.properties);

        fields.forEach((field) => {
            if (!errors[field]) errors[field] = {} as FormValidation[string]; // Ensures `errors[field]` exists
            validateDob(formData, errors, field, t);
        });

        return errors;
    };
