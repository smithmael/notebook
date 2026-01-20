import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider, Chip } from "@mui/material";

export default function AdminNotifications() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/notifications')
      .then(res => setNotifs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
           <Typography variant="h6" fontWeight={700}>System Notifications</Typography>
           <Chip label="Admin Only" color="primary" size="small" />
        </Box>
        <List>
          {notifs.map((n, i) => (
            <React.Fragment key={n.id}>
              <ListItem>
                <ListItemText 
                  primary={n.title} 
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">{n.message}</Typography>
                      <br/>
                      <Typography component="span" variant="caption">{n.time}</Typography>
                    </>
                  } 
                />
              </ListItem>
              {i < notifs.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}