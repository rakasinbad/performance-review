import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteProps,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Option } from "../types/option";

type AutocompleteSingleProps = AutocompleteProps<Option, false, false, false>;

type Props<T extends FieldValues> = {
  name: Path<T>;
  options?: Option[];
  label: string;
  loading?: boolean;
  inputCustomProps?: AutocompleteSingleProps;
  customOnChange?: (value: Option | null) => void;
  [key: string]: any;
};

export function RHFAutocompleteSingle<T extends FieldValues>({
  name,
  options = [],
  label,
  loading = false,
  customOnChange,
  required,
  disabled,
  ...inputCustomProps
}: Props<T>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
        const selected = options.find((o) => o.id === value) || null;

        return (
          <Autocomplete
            {...inputCustomProps}
            options={options}
            value={selected}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            onChange={(_, newValue) => {
              customOnChange ? customOnChange(newValue) : null;
              onChange(newValue?.id ?? null);
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.label}
              </li>
            )}
            disabled={disabled}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  disabled={disabled}
                  required={required}
                  label={label}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress size={20} sx={{ mr: 2 }} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              );
            }}
          />
        );
      }}
    />
  );
}
