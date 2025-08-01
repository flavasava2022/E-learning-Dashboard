import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  List,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import imgCourse from "../../assets/hussien_resized.jpg";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { use, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router";
export default function CourseCard({ id, alignment, page = "courses" }) {
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(false);
  const isList = alignment === "list";
  const instructorName = `${course.users?.first_name ?? ""} ${course.users?.last_name ?? ""}`;
  const Navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
    *,
    categories (
      name
    ),
    users (
      first_name,last_name,avatar_url),
      modules (
        *,
        lessons (
          *
        )
      ),
    enrollments (
      user_id,
      users (
        first_name,
        last_name,
        avatar_url
      )
    )
  `
        )
        .eq("id", id);

      if (error) {
        console.error(error);
      } else {
        setCourse(data[0] || []); // Assuming data is an array and we want the first course
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);
  const lessonsCount = course?.modules?.reduce(
    (total, module) => total + (module?.lessons ? module.lessons?.length : 0),
    0
  );
  return (
    <Card
      sx={{
        display: "flex",
        // Responsive flexDirection based on alignment
        flexDirection: isList ? { xs: "column", sm: "row" } : "column",
        width: isList ? "100%" : "280px",

        height: isList ? "fit-content" : "380px", // Let content define height, alignItems="stretch" on parent helps
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
        position: "relative",
        transition: "box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out",

        "&:hover": {
          boxShadow: 8,
          transform: "translateY(-4px)",
        },
        // Apply overlay styles only for grid view
        "& .course-card-overlay": {
          display: isList ? "none" : "flex", // Hide overlay in list view
          position: "absolute",
          opacity: 0,
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          backgroundColor: "rgba(48,48,65,0.96)",
          color: "white",
          zIndex: 2,
          transition: "opacity 0.3s ease-in-out",
          borderRadius: "inherit", // Inherit border radius
          p: 2,
          flexDirection: "column",
          justifyContent: "space-between",
        },
        "&:hover .course-card-overlay": {
          opacity: 1,
        },
      }}
    >
      {loading ? (
        <Box
          sx={{
            minHeight: 160,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {" "}
          <CardMedia
            component="img"
            image={course.image_url}
            alt={course.title}
            sx={{
              // Conditional styling for the image
              width: isList ? { xs: "100%", sm: 200 } : "100%",
              height: isList ? { xs: 180, sm: "auto" } : 160,
              borderRadius: 2,
              objectFit: "cover",
              flexShrink: 0, // Prevent image from shrinking in flex row
            }}
          />
          {/* --- CARD CONTENT (VISIBLE) --- */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
            }}
          >
            <CardContent
              sx={{ flexGrow: 1, p: isList ? { xs: 2, sm: "8px 16px" } : 2 }}
            >
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    {course.categories?.name ?? "General"}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PeopleAltOutlinedIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {course.enrollments?.length ?? 0}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <StarIcon fontSize="small" sx={{ color: "#ffb400" }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.rating ?? "N/A"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Typography variant="body2" component="div" fontWeight="bold">
                  {course.title ?? "Untitled Course"}
                </Typography>
                {/* Show description in list view */}
                {isList && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: { xs: "none", md: "block" } }}
                  >
                    {`${course.description?.substring(0, 100) ?? ""}...`}
                  </Typography>
                )}
              </Stack>
            </CardContent>

            <Divider variant="middle" />

            <CardActions sx={{ p: 2, justifyContent: "space-between", flexDirection:{xs:'column',md:'row'},gap:2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar src={course.users?.avatar_url} />
                <Typography variant="body2">{instructorName}</Typography>
              </Stack>
              {/* Show price directly in list view */}
              {isList ?  page === "mycourses" ? (
<div className="flex items-center justify-between gap-2">
                <Button
                  onClick={() =>
                    Navigate(`/dashboard/mycourses/${course.id}/edit`)
                  }
                  variant="contained"
                                    size="small"
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => Navigate(`/dashboard/courses/${course.id}`)}
                >
                  View Details
                </Button>
</div>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => Navigate(`/dashboard/courses/${course.id}`)}
                >
                  View Details
                </Button>
              ) : (
                <Typography variant="h6" color="primary">
                  ${course.price ?? "0.00"}
                </Typography>
              )}
            </CardActions>
          </Box>
          {/* --- OVERLAY (GRID VIEW ONLY) --- */}
          <div className="course-card-overlay flex flex-col justify-between w-full h-full p-4">
            <div className="flex items-center gap-4">
              <Avatar
                sx={{ borderRadius: "8px", width: 60, height: 60 }}
                alt={`${course?.users?.first_name} ${course?.users?.last_name}`}
                src={course?.users?.avatar_url}
              />
              <div>
                <Typography gutterBottom variant="body" component="div">
                  {course?.users?.first_name} {course?.users?.last_name}
                </Typography>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-4  rounded-4xl bg-white">
                    <StarIcon sx={{ color: "#efb034" }} />
                    <Typography
                      variant="subtitle1"
                      component="div"
                      className="text-[#efb034]"
                    >
                      {course?.rating}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <Typography
              variant="body2"
              sx={{ overflow: "auto", maxHeight: "10rem" }}
            >
              {course?.description}
            </Typography>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <PeopleAltOutlinedIcon sx={{ color: "white" }} />
                <Typography variant="subtitle1" component="div">
                  {" "}
                  {course?.enrollments?.length}
                </Typography>
              </div>{" "}
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ background: "white" }}
              />
              <div className="flex items-center gap-1">
                <StarIcon sx={{ color: "#efb034" }} />
                <Typography variant="subtitle1" component="div">
                  {course?.rating}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <AutoAwesomeMotionIcon sx={{ color: "white" }} />
                <Typography variant="subtitle1" component="div">
                  {" "}
                  {course?.modules?.length} Modules
                </Typography>
              </div>{" "}
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ background: "white" }}
              />
              <div className="flex items-center gap-1">
                <ImportContactsIcon sx={{ color: "white" }} />
                <Typography variant="subtitle1" component="div">
                  {lessonsCount} Lessons
                </Typography>
              </div>
            </div>

            <CardActions className="flex items-center justify-around w-full">
              {page === "mycourses" ? (
                <Button
                  onClick={() =>
                    Navigate(`/dashboard/mycourses/${course.id}/edit`)
                  }
                  variant="contained"
                >
                  Edit
                </Button>
              ) : (
                <Typography variant="h5" component="div">
                  $ {course?.price}
                </Typography>
              )}

              <Button
                onClick={() => Navigate(`/dashboard/courses/${course.id}`)}
                variant="contained"
              >
                View Details
              </Button>
            </CardActions>
          </div>
        </>
      )}
    </Card>
  );
}
