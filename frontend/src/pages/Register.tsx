import React, { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";           // ← grab the ESM bundle
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {Link, useNavigate } from "react-router-dom";
const { getDocument, GlobalWorkerOptions, version } = pdfjsLib;

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;


async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer, disableWorker: true } as any);  
  const pdf = await loadingTask.promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n\n";
  }
  return text;
}

const bgImage =
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpzyRiePwvNC-nFOJHDYBn-T7_otOOUas1Yw&s";
const logoSrc = "/logo.png";

export default function Register() {
  const [role, setRole] = useState<"recruiter" | "jobseeker">("jobseeker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let resumeText = "";
    if (role === "jobseeker" && resumeFile) {
      resumeText = "SDE"//await extractPdfText(resumeFile);
    }
    // Here you would send fullName/email/password to your backend...
    // Then navigate to Recommendations with resumeText in state:
    navigate("/recommendations", { state: { resumeText } });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {/* wrap in a real <form> */}
     <form onSubmit={handleSubmit}>
        <Card sx={{ width: 340, p: 3, textAlign: "center" }}>
        <Box
          component="img"
          src={logoSrc}
          alt="AutoCareers"
          sx={{ display: "block", height: 48, mb: 2, mx: "auto" }}
        />

        <ToggleButtonGroup
          exclusive
          fullWidth
          value={role}
          onChange={(_, v) => v && setRole(v)}
          sx={{ mb: 2 }}
          size="small"
        >
          <ToggleButton value="recruiter">Recruiter</ToggleButton>
          <ToggleButton value="jobseeker">Job Seeker</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          label="Full Name"
          size="small"
          fullWidth
          margin="dense"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextField
          label="Email"
          size="small"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          size="small"
          fullWidth
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          size="small"
          fullWidth
          margin="dense"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {role === "jobseeker" && (
          <Button
            variant="outlined"
            fullWidth
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ my: 1, textTransform: "none" }}
          >
            {resumeFile?.name || "Upload Resume (PDF)"}
            <input
              hidden
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
            />
          </Button>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 1, textTransform: "none" }}
        >
          Sign Up
        </Button>

        <Typography variant="caption" display="block" align="center" sx={{ mt: 2 }}>
          Existing User?{" "}
          <Box component="a" href="/login" sx={{ textDecoration: "underline" }}>
            Log in
          </Box>
        </Typography>
      </Card>
      </form>
    </Box>
  );
}
