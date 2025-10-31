import { NumberInput as HeroNumberInput } from "@heroui/react";
import { useFormContext, Controller } from "react-hook-form";

import { FormFieldWrapper } from "../Form/FormFieldWrapper";

// import { FormFieldWrapper } from "./FormFieldWrapper";

export const NumberInput = ({
  name,
  label,
  min,
  max,
  disabled = false,
  required = true,
}: {
  name: string;
  label?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  required?: boolean;
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <FormFieldWrapper label={label} name={name} required={required}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <HeroNumberInput
            aria-label={label}
            errorMessage={error}
            isDisabled={disabled}
            isInvalid={!!error}
            isRequired={required}
            maxValue={max}
            minValue={min}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
      />
    </FormFieldWrapper>
  );
};
