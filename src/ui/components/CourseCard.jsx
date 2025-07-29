import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Rating,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import imgCourse from "../../assets/hussien_resized.jpg";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
export default function CourseCard({ id }) {
  const [course, setCourse] = useState({});
  useEffect(() => {
    async function fetchData() {
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
      id,
      lessons (
        id
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
    }
    fetchData();
  }, [id]);
  const lessonsCount = course?.modules?.reduce(
    (total, module) => total + (module?.lessons ? module.lessons?.length : 0),
    0
  );
  console.log("Course Data:", course);
  return (
    <Card
      sx={{
        height: "320px",
        maxWidth: "50%",
        minWidth: "320px",
        borderRadius: 3,
        boxShadow: 2,
        p: 2,

        bgcolor: "white",
        transition:
          "box-shadow 0.3s, background 0.3s, color 0.3s, transform 0.3s",
        position: "relative",
        "& .course-card-overlay": {
          position: "absolute",
          opacity: 0,
          width: "100%",
          height: "100%",
          top: 0,
          backgroundColor: "#32323f",
          color: "white",
        },
        "&:hover": {
          transform: "translateY(-3px) scale(1.01)",

          "& .course-card-overlay": {
            opacity: 1,
            transition: "opacity 0.3s ease-in-out",
          },
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CardMedia
        sx={{
          width: "95%",
          height: "110px",
          borderRadius: 3,
          boxShadow: 4,
          objectFit: "fill",
        }}
        component="img"
        alt="green iguana"
        image={course?.image_url}
      />
      <CardContent className="flex flex-col gap-2 justify-between w-full h-full">
        <Box className="flex items-center justify-between">
          <Typography variant="subtitle1" component="div">
            {" "}
            {course?.category_name ? course?.category_name : "Programming"}
          </Typography>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <PeopleAltOutlinedIcon sx={{ color: "gray" }} />
              <Typography variant="subtitle1" component="div">
                {" "}
                {course?.enrollments?.length}
              </Typography>
            </div>{" "}
            <div className="flex items-center gap-1">
              <StarIcon sx={{ color: "#efb034" }} />
              <Typography variant="subtitle1" component="div">
                {course?.rating}
              </Typography>
            </div>
          </div>
        </Box>
        <Typography gutterBottom variant="subtitle1" component="div">
          {course?.title}
        </Typography>

        <div className="flex items-center gap-4">
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Typography gutterBottom variant="subtitle1" component="div">
            {course?.users?.first_name} {course?.users?.last_name}
          </Typography>
        </div>
      </CardContent>
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
              <div className="flex items-center gap-1 px-2 rounded-4xl bg-white">
                <PeopleAltOutlinedIcon sx={{ color: "gray" }} />
                <Typography
                  variant="subtitle1"
                  component="div"
                  className="text-gray-600"
                >
                  {" "}
                  {course?.enrollments?.length}
                </Typography>
              </div>{" "}
              <div className="flex items-center gap-1 px-4 rounded-4xl bg-white">
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
        <div></div>
        <CardActions className="flex items-center justify-around w-full">
          <Typography variant="h5" component="div">
            $ {course?.price}
          </Typography>
          <Button variant="contained">View Details</Button>
        </CardActions>
      </div>
    </Card>
  );
}
