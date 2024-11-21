import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField } from "../utils/schemaValidator";

interface FormPreviewProps {
  schema: FormField[];
}

const FormPreview: React.FC<FormPreviewProps> = ({ schema }) => {
  const validationSchema = schema.reduce((acc, field) => {
    if (field.required) {
      acc[field.id] = Yup.string().required(`${field.label} is required`);
      if (field.validation?.pattern) {
        acc[field.id] = acc[field.id].matches(
          new RegExp(field.validation.pattern),
          field.validation.message
        );
      }
    }
    return acc;
  }, {} as any);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(Yup.object().shape(validationSchema)),
  });

  const onSubmit: SubmitHandler<any> = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {schema.map((field) => {
        if (field.type === "select" || field.type === "radio") {
          return (
            <div key={field.id} className="flex flex-col">
              <label className="font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select {...register(field.id)} className="p-2 border rounded">
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                field.options?.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      {...register(field.id)}
                      type="radio"
                      value={option.value}
                      className="mr-2"
                    />
                    <span>{option.label}</span>
                  </label>
                ))
              )}
              {errors[field.id] && (
                <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
              )}
            </div>
          );
        }

        return (
          <div key={field.id} className="flex flex-col">
            <label htmlFor={field.id} className="font-medium">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                {...register(field.id)}
                id={field.id}
                className="p-2 border rounded"
                placeholder={field.placeholder}
              />
            ) : (
              <input
                {...register(field.id)}
                id={field.id}
                type={field.type}
                className="p-2 border rounded"
                placeholder={field.placeholder}
              />
            )}
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );
      })}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default FormPreview;
