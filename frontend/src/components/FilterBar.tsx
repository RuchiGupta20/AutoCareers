import React from 'react';
import {
  Box,
  Button,
  TextField,
  Popover,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
} from '@mui/material';

interface FilterOptions {
  jobType: {
    fullTime: boolean;
    partTime: boolean;
  };
  experienceLevel: {
    junior: boolean;
    mid: boolean;
    senior: boolean;
  };
  salaryRange: {
    range50_60: boolean;
    range60_80: boolean;
    range80_100: boolean;
  };
  location: {
    remote: boolean;
    onsite: boolean;
    hybrid: boolean;
  };
}

interface FilterSearchBarProps {
  width?: number | string; // allows you to set a custom width (e.g., "300px" or 400)
}

const FilterSearchBar: React.FC<FilterSearchBarProps> = ({ width = 400 }) => {
  // Tracks whether the popover is open and its anchor
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  // The "applied" filters in effect
  const [selectedFilters, setSelectedFilters] = React.useState<FilterOptions>({
    jobType: {
      fullTime: false,
      partTime: false,
    },
    experienceLevel: {
      junior: false,
      mid: false,
      senior: false,
    },
    salaryRange: {
      range50_60: false,
      range60_80: false,
      range80_100: false,
    },
    location: {
      remote: false,
      onsite: false,
      hybrid: false,
    },
  });

  // Temporary copy of filters for editing in the popover
  const [tempFilters, setTempFilters] = React.useState<FilterOptions>({
    jobType: {
      fullTime: false,
      partTime: false,
    },
    experienceLevel: {
      junior: false,
      mid: false,
      senior: false,
    },
    salaryRange: {
      range50_60: false,
      range60_80: false,
      range80_100: false,
    },
    location: {
      remote: false,
      onsite: false,
      hybrid: false,
    },
  });

  // Open the popover, copying current filters to tempFilters
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setTempFilters({ ...selectedFilters });
  };

  // Close the popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Check/uncheck a specific filter option in tempFilters
  const handleCheckboxChange =
    (category: keyof FilterOptions, option: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTempFilters((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [option]: event.target.checked,
        },
      }));
    };

  // Apply changes (Done)
  const handleDone = () => {
    setSelectedFilters(tempFilters);
    handleClose();
  };

  // Discard changes (Cancel)
  const handleCancel = () => {
    handleClose();
  };

  // For popover control
  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  return (
    <Box sx={{ width, display: 'flex', gap: 1, alignItems: 'center' }}>
      {/* Search field (you can add icons or other styling as needed) */}
      <TextField variant="outlined" placeholder="Search..." fullWidth />

      {/* Button to open the filter popover */}
      <Button variant="contained" onClick={handleOpen}>
        Filters
      </Button>

      {/* Popover for filtering */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, minWidth: 240 }}>
          <Stack spacing={1}>
            {/* JOB TYPE */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>
              Job Type
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.jobType.fullTime}
                  onChange={handleCheckboxChange('jobType', 'fullTime')}
                />
              }
              label="Full Time"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.jobType.partTime}
                  onChange={handleCheckboxChange('jobType', 'partTime')}
                />
              }
              label="Part Time"
            />

            {/* EXPERIENCE LEVEL */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              Experience Level
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.experienceLevel.junior}
                  onChange={handleCheckboxChange('experienceLevel', 'junior')}
                />
              }
              label="Junior"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.experienceLevel.mid}
                  onChange={handleCheckboxChange('experienceLevel', 'mid')}
                />
              }
              label="Mid"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.experienceLevel.senior}
                  onChange={handleCheckboxChange('experienceLevel', 'senior')}
                />
              }
              label="Senior"
            />

            {/* SALARY RANGE */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              Salary Range
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.salaryRange.range50_60}
                  onChange={handleCheckboxChange('salaryRange', 'range50_60')}
                />
              }
              label="$50k - $60k"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.salaryRange.range60_80}
                  onChange={handleCheckboxChange('salaryRange', 'range60_80')}
                />
              }
              label="$60k - $80k"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.salaryRange.range80_100}
                  onChange={handleCheckboxChange('salaryRange', 'range80_100')}
                />
              }
              label="$80k - $100k"
            />

            {/* LOCATION */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              Location
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.location.remote}
                  onChange={handleCheckboxChange('location', 'remote')}
                />
              }
              label="Remote"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.location.onsite}
                  onChange={handleCheckboxChange('location', 'onsite')}
                />
              }
              label="On-Site"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.location.hybrid}
                  onChange={handleCheckboxChange('location', 'hybrid')}
                />
              }
              label="Hybrid"
            />
          </Stack>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button onClick={handleCancel} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleDone} variant="contained">
              Done
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default FilterSearchBar;
