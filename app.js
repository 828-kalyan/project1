import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import axios from "axios";

const ResearchTab = () => {
  const [myOptions, setMyOptions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isAcademic, setIsAcademic] = useState(false);
  const [citationDialogOpen, setCitationDialogOpen] = useState(false);
  const [citationStyles, setCitationStyles] = useState([]);
  const [selectedCitationStyle, setSelectedCitationStyle] = useState(null);

  useEffect(() => {
    fetchOptionsFromAPI();
  }, [searchKeyword, isAcademic]);

  const fetchOptionsFromAPI = () => {
    const data = JSON.stringify({
      keyword: searchKeyword,
      limit: "10"
    });

    const config = {
      method: "post",
      url: "https://api.gyanibooks.com/search_publication/",
      headers: {
        "Content-Type": "application/json"
      },
      data: data
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const options = response.data.map((item) => item.label);
        setMyOptions(options);
      })
      .catch((error) => {
        console.log("Error fetching options from API:", error);
      });
  };

  const handleSearchChange = (event, value) => {
    setSearchKeyword(value);
  };

  const handleToggleChange = () => {
    setIsAcademic(!isAcademic);
  };

  const handleGenerateCitations = () => {
    setCitationDialogOpen(true);
  };

  const handleCitationStyleSelect = (style) => {
    setSelectedCitationStyle(style);
    // You can add code here to generate citations based on the selected style
  };

  const handleSearchWeb = () => {
    console.log("Searching the web for:", searchKeyword);
    // Add your search functionality here
  };

  return (
    <div style={{ marginLeft: "40%", marginTop: "60px" }}>
      <h3>QuillBot Search</h3>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Autocomplete
          style={{ width: 500 }}
          freeSolo
          autoComplete
          autoHighlight
          options={myOptions}
          onInputChange={handleSearchChange}
          renderInput={(params) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                {...params}
                variant="outlined"
                label="Search Box"
                onChange={handleSearchChange}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={isAcademic}
                    onChange={handleToggleChange}
                    name="academicSwitch"
                    color="primary"
                  />
                }
                label="Academic"
              />
            </div>
          )}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        {/* Select Dropdown for Citation Styles */}
        <select
          value={selectedCitationStyle ? selectedCitationStyle.name : ""}
          onChange={(e) => {
            const selectedStyle = citationStyles.find(
              (style) => style.name === e.target.value
            );
            handleCitationStyleSelect(selectedStyle);
          }}
          style={{ marginRight: "10px" }}
        >
          <option value="">Select Citation Style</option>
          <option value="APA 7">APA 7</option>
          <option value="MLA 9">MLA 9</option>
          <option value="IEEE">IEEE</option>
        </select>

        {/* Search the Web Button */}
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "10px" }}
          onClick={handleSearchWeb}
        >
          <SearchIcon style={{ marginRight: "5px" }} />
          Search the Web
        </Button>
      </div>

      {/* Citation Dialog */}
      <Dialog
        open={citationDialogOpen}
        onClose={() => setCitationDialogOpen(false)}
      >
        <DialogTitle>Citation Styles</DialogTitle>
        <DialogContent>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            <li
              style={{ cursor: "pointer" }}
              onClick={() => handleCitationStyleSelect({ name: "APA 7" })}
            >
              APA 7
            </li>
            <li
              style={{ cursor: "pointer" }}
              onClick={() => handleCitationStyleSelect({ name: "MLA 9" })}
            >
              MLA 9
            </li>
            <li
              style={{ cursor: "pointer" }}
              onClick={() => handleCitationStyleSelect({ name: "IEEE" })}
            >
              IEEE
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCitationDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResearchTab;
