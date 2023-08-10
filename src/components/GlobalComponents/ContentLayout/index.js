import React from "react";
import { Grid, Box } from "@mui/material";

const ContentLayout = ({ title, children, half = false }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3} md={2} lg={half ? 3 : 2}>
          {title && title !== "" && (
            <Box
              fontWeight="500"
              display="inline-block"
              color="text.primary"
              fontSize="body2.fontSize"
              component="span"
            >
              {title}
            </Box>
          )}
        </Grid>
        <Grid item xs={12} sm={9} md={10} lg={half ? 9 : 10}>
          <Box
            mt={{ xs: "-10px", sm: 0 }}
            mr={{ xs: 0, md: "50px", lg: "100px" }}
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContentLayout;
