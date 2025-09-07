import { createTheme } from "@mui/material/styles";

export default createTheme({
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
    background: {
      default: "#FFFFFF",
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "cta" }, // Call-to-action button (Hero, NotFound)
          style: ({ theme }) => ({
            height: "58px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            fontSize: "20px",
            padding: "16px 56px",
            borderRadius: "6px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }),
        },
        {
          props: { variant: "all-categories" },
          style: ({ theme }) => ({
            width: "142px",
            height: "36px",
            color: theme.palette.tertiary.main,
            fontWeight: 500,
            fontSize: "16px",
            padding: "8px 10px",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "6px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.text.primary,
              color: theme.palette.common.white,
              borderColor: theme.palette.text.primary,
            },
          }),
        },
        {
          props: { variant: "breadcrumb" },
          style: ({ theme }) => ({
            height: "36px",
            color: theme.palette.tertiary.main,
            fontWeight: 500,
            fontSize: "16px",
            padding: "8px 16px",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "6px",
            textTransform: "none",
            width: "auto",
            minWidth: "auto",
            "&:hover": {
              backgroundColor: theme.palette.text.primary,
              color: theme.palette.common.white,
              borderColor: theme.palette.text.primary,
            },
          }),
        },
        {
          props: { variant: "discount" },
          style: ({ theme }) => ({
            width: "100%",
            height: "58px",
            backgroundColor: theme.palette.common.white,
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: "20px",
            borderRadius: "6px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.grey[200],
            },
          }),
        },
      ],
    },
  },
});
