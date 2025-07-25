import React, { useEffect, useState } from "react";
import {
  Box, Pagination, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, TextField,
  Select, MenuItem, FormControl, InputLabel, FormControlLabel, Snackbar, Alert
} from "@mui/material";
import { getEligibleUsers, searchCohortList, addCohortMembers } from "@/services/CohortServices"; 

const PAGE_SIZE = 20;

type AddMembersModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (payload: any) => void;
  cohortId: any;
  roleId: any;
  title?: any;
  showCohortFilters?: boolean;
};
const AddMembersModal: React.FC<AddMembersModalProps> = ({ open, onClose, onAdd, cohortId, roleId, title, showCohortFilters}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

   // Dropdown states
  const [clusters, setClusters] = useState([]);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

    // "Select all in class" state
  const [selectAllFiltered, setSelectAllFiltered] = useState(false);

   // Local filter states for UI controls
  const [filterCluster, setFilterCluster] = useState("");
  const [filterSchool, setFilterSchool] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
    // Sync local filter states with actual filter states when modal opens or filters are applied
  useEffect(() => {
    if (open) {
      setFilterCluster(selectedCluster);
      setFilterSchool(selectedSchool);
      setFilterClass(selectedClass);
      setFilterSearch(search);
    }
  }, [open]);

  // Apply filters
  const handleApplyFilters = () => {
    setSelectedCluster(filterCluster);
    setSelectedSchool(filterSchool);
    setSelectedClass(filterClass);
    setSearch(filterSearch);
    setPage(1);
    setSelectAllFiltered(false);
    setSelected([]);
  };

    // Fetch clusters on open
  useEffect(() => {
    if (open) {
      let clusterFilters = {
        limit: 0, offset: 0, filters: { type: "CLUSTER", status: ["active"] },
      };
      //const clusterRes = await getCohortList(clusterFilters);
      searchCohortList(clusterFilters).then((resp) => {
        setClusters(resp?.results?.cohortDetails || []);
      });      
    }
  }, [open]);

  // Fetch schools when cluster changes
  useEffect(() => {
    if (selectedCluster) {
      let clusterFilters = {
        limit: 0, 
        offset: 0, 
        filters: { type: "SCHOOL", status: ["active"], parentId: selectedCluster },
      };
      //const clusterRes = await getCohortList(clusterFilters);
      searchCohortList(clusterFilters).then((resp) => {
        setSchools(resp?.results?.cohortDetails || []);
      });      
      //getSchoolsByCluster(selectedCluster).then(setSchools);
      setSelectedSchool("");
      setClasses([]);
      setSelectedClass("");
    } else {
      setSchools([]);
      setSelectedSchool("");
      setClasses([]);
      setSelectedClass("");
    }
  }, [selectedCluster]);

   // Fetch classes when school changes
  useEffect(() => {
    if (selectedSchool) {
      let clusterFilters = {
        limit: 0, 
        offset: 0, 
        filters: { type: "COHORT", status: ["active"], parentId: selectedSchool },
      };
      searchCohortList(clusterFilters).then((resp) => {
        setClasses(resp?.results?.cohortDetails || []);
      });      //getClassesBySchool(selectedSchool).then(setClasses);
      setSelectedClass("");
    } else {
      setClasses([]);
      setSelectedClass("");
    }
  }, [selectedSchool]);


 // Fetch users when filters/search/page change
  useEffect(() => {
    if (open) {
      fetchUsers(page);
    }
    // eslint-disable-next-line
  }, [open, cohortId, search, page, selectedCluster, selectedSchool, selectedClass]);

   useEffect(() => {
    if (!open) {
      setPage(1);
      setSearch("");
      setSelected([]);
      setSelectedCluster("");
      setSelectedSchool("");
      setSelectedClass("");
      setSelectAllFiltered(false);
    }
  }, [open]);


  // Reset filters
  const handleResetFilters = () => {
      setFilterCluster("");
    setFilterSchool("");
    setFilterClass("");
    setFilterSearch("");
    setSelectedCluster("");
    setSelectedSchool("");
    setSelectedClass("");
    setSearch("");
    setPage(1);
    setSelectAllFiltered(false);
    setSelected([]);
  };

  const fetchUsers = async (pageNum = 1) => {
    const offset = (pageNum - 1) * PAGE_SIZE;
    // Fetch teachers not in the cohort, filter by search if needed
    const resp = await getEligibleUsers({
      cohortId: cohortId, // for the cohort
      limit: PAGE_SIZE, // Adjust as needed
      offset: offset, // Adjust as needed
      filters:  {
        clusterId: selectedCluster, // from the dropdown
        schoolId: selectedSchool, // from the dropdown
        classId: selectedClass, // from the dropdown
        search: search, // from the search input
        roleId: roleId
      }
    });
    setUsers(resp?.results || []);
    setTotalCount(resp?.total || 0);
  };

 const handleToggle = (userId: string) => {
  setSelected((prev) => {
    const newSelected = prev.includes(userId)
      ? prev.filter((id) => id !== userId)
      : [...prev, userId];
    if (selectAllFiltered) setSelectAllFiltered(false);
    return newSelected;
  });
};

  const handleAdd = async () => {
    let payload;
    if (selectAllFiltered) {
      payload = {
        selectAll: true,
        filters: {
          clusterId: selectedCluster,
          schoolId: selectedSchool,
          classId: selectedClass,
          search: search,
          roleId: roleId // this is the role ID for students or teachers
        },
        cohortId,
      };
    } else {
      payload = {
        selectAll: false,
        userIds: selected,
        cohortId,
      };
    }

    try {
      await addCohortMembers(payload); 
      setSnackbarOpen(true); // Show success message
      setSelected([]);
      setSelectAllFiltered(false);
      fetchUsers(1); // Refresh the list
    } catch (error) {
      // Optionally handle error
      console.error("Failed to add cohort members", error);
    }
  };

const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

    // Check if all users on current page are selected
  const allCurrentPageSelected = users.length > 0 && users.every((u:any) => selected.includes(u.userId));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth 
     PaperProps={{
        sx: { minHeight: 500, minWidth: 900 }
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={1} alignItems="center" mb={2} flexWrap="wrap">
      {showCohortFilters && (
        <>
        {/* Cluster Dropdown */}
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Cluster</InputLabel>
          <Select
            value={selectedCluster || ""}
            label="Cluster"
            onChange={e => setSelectedCluster(e.target.value)}
          >
            <MenuItem value="">All Clusters</MenuItem>
            {clusters.map((cluster:any) => (
              <MenuItem value={cluster.cohortId} key={cluster.cohortId}>
                  {cluster.name}
              </MenuItem>            
            ))}
          </Select>
        </FormControl>
        {/* School Dropdown */}
        <FormControl sx={{ minWidth: 180 }} disabled={!selectedCluster}>
          <InputLabel>School</InputLabel>
          <Select
            value={selectedSchool || ""}
            label="School"
            onChange={e => setSelectedSchool(e.target.value)}
            disabled={!selectedCluster}

          >
            <MenuItem value="">All Schools</MenuItem>
            {schools.map((school:any) => (
              <MenuItem value={school.cohortId} key={school.cohortId}>{school.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Class Dropdown */}
        <FormControl sx={{ minWidth: 180 }} disabled={!selectedSchool}>
          <InputLabel>Class</InputLabel>
          <Select
            value={selectedClass || ""}
            label="Class"
            onChange={e => setSelectedClass(e.target.value)}
            disabled={!selectedSchool}
          >
            <MenuItem value="">All Classes</MenuItem>
            {classes.map((cls: any) => (
              <MenuItem value={cls.cohortId} key={cls.cohortId}>{cls.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        </>
      )}
        {/* Search */}
        <TextField
          label="Search"
          value={filterSearch}
          onChange={e => setFilterSearch(e.target.value)}
          margin="normal"
          sx={{ minWidth: 180 }}
        />
        {/* Apply & Reset Buttons */}
          <Button variant="contained" color="primary" onClick={handleApplyFilters}>
            Apply
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleResetFilters}>
            Reset
          </Button>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAllFiltered}
              onChange={e => setSelectAllFiltered(e.target.checked)}
              disabled={totalCount === 0}
            />
          }
          label="Select all users across all pages" 
        />
        <Table>
          <TableHead>
            <TableRow>
               <TableCell>
                <Checkbox
                  checked={allCurrentPageSelected}
                  indeterminate={!allCurrentPageSelected && users.some((u:any) => selected.includes(u.userId))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelected((prev) =>
                        Array.from(new Set([...prev, ...users.map((u:any) => u.userId)]))
                      );
                    } else {
                      setSelected((prev) =>
                        prev.filter((id) => !users.map((u:any) => u.userId).includes(id))
                      );
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user:any) => (
              <TableRow key={user.userId}>
                <TableCell>
                  <Checkbox
                    checked={selectAllFiltered || selected.includes(user.userId)}
                    onChange={() => handleToggle(user.userId)}
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {totalCount > PAGE_SIZE && (
          <Pagination
            count={Math.ceil(totalCount / PAGE_SIZE)}
            page={page}
            onChange={handlePageChange}
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            Members added successfully!
          </Alert>
        </Snackbar>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleAdd} variant="contained" 
          color="primary" 
          disabled={selected.length === 0 && !selectAllFiltered}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMembersModal;