import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

export default function OwnerNotifications() {
  const [notifs, setNotifs] = useState([]);
  const OWNER_ID = 1; 

  useEffect(() => {
    axios.get(`http://localhost:5000/api/owner/${OWNER_ID}/notifications`)
      .then(res => setNotifs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>Notifications</Typography>
        <List>
          {notifs.map((n, i) => (
            <React.Fragment key={n.id}>
              <ListItem>
                <ListItemText primary={n.title} secondary={n.message} />
                <Typography variant="caption">{n.time}</Typography>
              </ListItem>
              {i < notifs.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}