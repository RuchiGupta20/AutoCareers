import { useState } from "react";
import {
  Box,
  IconButton,
  Pagination,
  Typography,
  Card,
  CardContent,
  Button
} from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { dummyUsers } from "../data/dummyUsers";

const ITEMS_PER_PAGE = 7;

export default function UserList() {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const currentUsers = dummyUsers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageChange = (_: any, value: number) => setPage(value);

  const handleOpenResume = (user: any) => {
    setSelectedUser(user); // Open resume view for the selected user
  };

  const handleCloseResume = () => {
    setSelectedUser(null); // Close the resume view
  };

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="row"
      width="100%"
      maxWidth="95%" // Ensure the content takes full available width without overflow
      overflow="hidden" // Prevent horizontal scroll
    >
      {/* Left Panel: Applicants List */}
      <Box
        sx={{
          flex: selectedUser ? 0.5 : 1, // Adjust width when resume is shown
          maxWidth: selectedUser ? "70%" : "100%", // Limit max width to 70% when resume is shown
          overflow: "auto", // Allow vertical scrolling if content exceeds height
          transition: "flex 0.3s ease", // Smooth transition for resizing
        }}
      >
        {currentUsers.map((user) => (
          <Card
            key={user._id}
            sx={{
              mb: 2,
              backgroundColor: "#fff8e1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              paddingBottom: "0", // Remove extra padding at the bottom
              overflow: "hidden", // Prevent overflow inside cards
              width: "100%", // Ensure each card takes full width
              boxSizing: "border-box", // Ensure padding and borders are included in width calculation
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingBottom: "0", // Remove bottom padding
              }}
            >
              <Typography fontWeight="bold">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginTop: 0.5 }}>
                {user.role}
              </Typography>
            </CardContent>
            <Box>
              <IconButton>
                <ArrowForward onClick={() => handleOpenResume(user)} />
              </IconButton>
            </Box>
          </Card>
        ))}

        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(dummyUsers.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>

      {/* Right Panel: Resume View */}
      <Box
        sx={{
          flex: selectedUser ? 0.5 : 0, // Only show the right panel when user is selected
          maxWidth: "50%",
          marginLeft: "20px",
          borderLeft: "1px solid #ddd",
          padding: "20px",
          display: selectedUser ? "block" : "none",
          transition: "flex 0.3s ease, max-width 0.3s ease", // Smooth transition for resizing
          overflow: "auto", // Allow scrolling inside the resume view
          boxSizing: "border-box", // Ensure padding and borders are included in width calculation
        }}
      >
        {selectedUser ? (
          <>
            <Typography variant="h5" fontWeight="bold">{selectedUser.name}</Typography>
            {/* <Typography variant="body1" color="text.secondary">{selectedUser.role}</Typography> */}

            {/* Render the resume */}
            <Box sx={{ mt: 2 }}>
              <iframe
                src="/resume-sample.pdf"
                width="100%"
                height="500px"
                title="Resume"
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" color="primary">
              Message Now
            </Button>
      </Box>
          </>
        ) : (
          <Typography>Select an applicant to view their resume</Typography>
        )}
      </Box>
    </Box>
  );
}
