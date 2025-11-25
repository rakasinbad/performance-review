import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

import { TextField, TextFieldProps } from "@mui/material";

type Props<T extends FieldValues> = TextFieldProps & {
  name: Path<T>;
};

export function RHFTextField<T extends FieldValues>({
  name,
  ...props
}: Props<T>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}
