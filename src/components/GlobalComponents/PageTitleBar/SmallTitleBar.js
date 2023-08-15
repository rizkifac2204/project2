import { Button, Grid, Typography, Box, Container } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const SmallTitleBar = ({
  title,
  center = true,
  desc,
  buttonText,
  buttonLink,
  back = false,
}) => {
  const router = useRouter();
  return (
    <Box sx={{ backgroundColor: "primary.main", mb: 3 }}>
      <Container sx={{ p: "2rem" }}>
        <Box px={{ xs: "12px", lg: 0 }}>
          <Grid container spacing={3} direction="row">
            {center ? (
              <Grid item xs={12} sm={12}>
                <Box className="title-content" textAlign="center">
                  <Typography variant="h5" color={"white"}>
                    {title}
                  </Typography>

                  {desc && (
                    <Box fontSize="body2.fontSize" color={"white"}>
                      {desc}
                    </Box>
                  )}

                  {buttonText && (
                    <Box className="btn-wrap">
                      <Button
                        sx={{ mt: 1 }}
                        size="small"
                        variant="outlined"
                        component={Link}
                        href={buttonLink}
                        style={{
                          color: "#ffffff",
                          borderColor: "#ffffff",
                        }}
                      >
                        {buttonText}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={7}>
                  <Box
                    className="title-content"
                    textAlign={{ xs: "center", sm: "left" }}
                  >
                    <Typography variant="h5" color="white">
                      {title}
                    </Typography>

                    {desc && (
                      <Box pt="5px" fontSize="body2.fontSize">
                        {desc}
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {back ? (
                    <Box
                      className="btn-wrap"
                      textAlign={{ xs: "center", sm: "right" }}
                      mr={2}
                    >
                      <Button
                        sx={{}}
                        variant="outlined"
                        onClick={() => router.back()}
                        style={{
                          color: "#ffffff",
                          borderColor: "#ffffff",
                        }}
                      >
                        <i
                          className="material-icons"
                          style={{
                            transform: "rotate(180deg)",
                            display: "inline-block",
                            paddingLeft: 10,
                          }}
                        >
                          arrow_right_alt
                        </i>
                        Kembali
                      </Button>
                    </Box>
                  ) : null}

                  {buttonText ? (
                    <Box
                      className="btn-wrap"
                      textAlign={{ xs: "center", sm: "right" }}
                    >
                      <Button
                        sx={{}}
                        variant="outlined"
                        component={Link}
                        href={buttonLink}
                        style={{
                          color: "#ffffff",
                          borderColor: "#ffffff",
                        }}
                      >
                        {buttonText}
                      </Button>
                    </Box>
                  ) : null}
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
export default SmallTitleBar;
