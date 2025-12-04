import { useForm, Controller, Path, FieldValues } from "react-hook-form";
import { Typography, Rating, Box, styled } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

interface Props<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;
}

// Define a map of labels for each value
const labels: any = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
};

const IconContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // ADD SPACING HERE: Add margin to the right of each container
  marginRight: "20px",

  // Ensure the last item in the list doesn't have a right margin
  "&:last-child": {
    marginRight: 0,
  },
});

// Create a custom icon container component
function CustomIconContainer(props: any) {
  const { value, ...other } = props;
  const labelText = labels[value];

  return (
    <IconContainer {...other}>
      {/* Position the Typography component above the icon */}
      <Typography
        key={labelText}
        sx={{
          width: { md: 48, sm: 48, xs: 2 },
          textAlign: "center",
          fontSize: 16,
          mx: 2,
          mb: 2,
          color: "black",
        }}
      >
        {labelText}
      </Typography>
      {/* The StarIcon size is controlled by the 'fontSize' prop passed to the Rating component below */}
      <StarIcon fontSize="inherit" />
    </IconContainer>
  );
}

export default function RHFRating<T extends FieldValues>({
  name,
  label,
  required,
}: Props<T>) {
  const { control } = useForm();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Wajib memberikan penilaian" }}
      render={({ field }) => (
        <Box>
          {/* Label */}
          <Typography>
            {label} <span style={{ color: "red" }}>*</span>
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Rating
              name="labeled-rating-large"
              value={field.value || 0}
              precision={1}
              onChange={(_, value) => field.onChange(value)}
              IconContainerComponent={CustomIconContainer}
              emptyIcon={
                <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
              }
              // MAKE ICONS BIGGER: Control the size of the icons via this prop
              sx={{
                // flexDirection: { md: "row", sm: "row", xs: "column" },
                "& .MuiRating-icon": {
                  fontSize: { md: 32, sm: 32, xs: 24 },
                  mx: { md: 1, sm: 1, xs: 0.1 },
                },
              }}
            />
          </Box>
        </Box>
      )}
    />
  );
}
