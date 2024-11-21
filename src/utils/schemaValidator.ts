export interface FormField {
    id: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
    validation?: { pattern: string; message: string };
  }
  
  export interface FormSchema {
    formTitle: string;
    formDescription: string;
    fields: FormField[];
  }
  
  export const validateSchema = (
    json: string
  ): { valid: boolean; data: FormSchema | null; error: string | null } => {
    try {
      const parsed = JSON.parse(json);
  
      // Validate top-level properties
      if (
        typeof parsed.formTitle !== "string" ||
        typeof parsed.formDescription !== "string" ||
        !Array.isArray(parsed.fields)
      ) {
        return { valid: false, data: null, error: "Schema must include `formTitle`, `formDescription`, and `fields` as an array" };
      }
  
      // Validate each field
      const isValid = parsed.fields.every((field: FormField) =>
        typeof field.id === "string" &&
        typeof field.label === "string" &&
        typeof field.type === "string" &&
        typeof field.required === "boolean" &&
        (field.placeholder === undefined || typeof field.placeholder === "string") &&
        (field.options === undefined || Array.isArray(field.options)) &&
        (field.validation === undefined ||
          (typeof field.validation.pattern === "string" &&
            typeof field.validation.message === "string"))
      );
  
      if (!isValid) {
        return { valid: false, data: null, error: "Invalid field structure in `fields` array" };
      }
  
      return { valid: true, data: parsed, error: null };
    } catch (error) {
      return { valid: false, data: null, error: "Invalid JSON format" };
    }
  };
  