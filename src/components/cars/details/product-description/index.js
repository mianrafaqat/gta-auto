import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function ProductDescription({ description = {} }) {
  const [details, setDetails] = useState([]);

  const displayData = () => {
    const data = [];
    for (const key in description) {
      if (description.hasOwnProperty(key)) {
        // Convert key from camelCase to normal text, if needed
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, function (str) {
            return str.toUpperCase();
          });
        data.push({ key: formattedKey, value: description[key] });
      }
    }

    setDetails(data);
  };

  useEffect(() => {
    if (description) {
      displayData();
    }
  }, [description]);

  return (
    <Box
      p={2}
      sx={{
        background: "#fff",
        borderTop: "1px solid lightgray",
        mt: "-1.2px",
      }}
    >
      <Grid container>
        {details.map((d) => (
          <Grid key={d.key} item xs={6} md={4}>
            <Typography variant="body1">
              <strong>{d.key}</strong>: {d.value}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
