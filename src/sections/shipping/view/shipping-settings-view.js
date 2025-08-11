import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LoadingButton } from "@mui/lab";

import { useSettingsContext } from "src/components/settings";
import { useSnackbar } from "src/components/snackbar";

// ----------------------------------------------------------------------

export default function ShippingSettingsView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveSettings = async () => {
    try {
      enqueueSnackbar("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      enqueueSnackbar("Error saving settings", { variant: "error" });
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Shipping Settings
      </Typography>

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable shipping calculations"
          />

          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Show estimated delivery time"
          />

          <FormControlLabel
            control={<Switch />}
            label="Enable international shipping"
          />

          <LoadingButton variant="contained" onClick={handleSaveSettings}>
            Save Settings
          </LoadingButton>
        </Stack>
      </Card>
    </Container>
  );
}
