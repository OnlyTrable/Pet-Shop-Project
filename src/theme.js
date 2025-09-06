import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
  palette: {
    primary: {
      main: "#0d50ff",
    },
    // Додаємо новий колір. Назвемо його 'tertiary' для прикладу.
    tertiary: {
      main: "#8B8B8B", // третій колір
    },
    text: {
      primary: "#282828",
      secondary: "#555",
    },
  },
});

export default theme;
