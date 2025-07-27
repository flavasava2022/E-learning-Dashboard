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
export default function CourseCard({ course }) {
  return (
    <Card
      sx={{
        height: "280px",
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
          height: "90px",
          borderRadius: 3,
          boxShadow: 4,
          objectFit: "fill",
        }}
        component="img"
        alt="green iguana"
        image={imgCourse}
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
                {course?.participants ? course?.participants : "1000"}
              </Typography>
            </div>{" "}
            <div className="flex items-center gap-1">
              <StarIcon sx={{ color: "#efb034" }} />
              <Typography variant="subtitle1" component="div">
                {course?.rating ? course?.rating : "4.5"}
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
            {course?.created_by ? course?.created_by : "Hussien Essam"}
          </Typography>
        </div>
      </CardContent>
      <div className="course-card-overlay flex flex-col justify-between w-full h-full p-4">
        <div className="flex items-center gap-4">
          <Avatar
            sx={{ borderRadius: "8px", width: 60, height: 60 }}
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
          />
          <div>
            <Typography gutterBottom variant="body" component="div">
              {course?.created_by ? course?.created_by : "Hussien Essam"}
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
                  {course?.participants ? course?.participants : "1000"}
                </Typography>
              </div>{" "}
              <div className="flex items-center gap-1 px-4 rounded-4xl bg-white">
                <StarIcon sx={{ color: "#efb034" }} />
                <Typography
                  variant="subtitle1"
                  component="div"
                  className="text-[#efb034]"
                >
                  {course?.rating ? course?.rating : "4.5"}
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
              {course?.participants ? course?.participants : "1000"}
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
              {course?.rating ? course?.rating : "4.5"}
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <AutoAwesomeMotionIcon sx={{ color: "white" }} />
            <Typography variant="subtitle1" component="div">
              {" "}
              {course?.participants ? course?.participants : "1000"} Modules
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
              {course?.rating ? course?.rating : "4.5"} Lessons
            </Typography>
          </div>
        </div>
        <div></div>
        <CardActions className="flex items-center justify-around w-full">
          <Typography variant="h5" component="div">
            $ {course?.price ? course?.price : "30"}
          </Typography>
          <Button variant="contained">View Details</Button>
        </CardActions>
      </div>
    </Card>
  );
}
