"use client";

import { useState } from "react";
import {
  SwipeableDrawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function CompanyDrawer({ open, setOpen, company }) {
  const [users, setUsers] = useState(company?.Users || []);
  const [deletingId, setDeletingId] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [adding, setAdding] = useState(false);

  const openConfirmDialog = (userId) => {
    setSelectedUserId(userId);
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedUserId(null);
    setConfirmOpen(false);
  };

  const handleDeleteUser = async () => {
    try {
      setDeletingId(selectedUserId);

      const res = await fetch("/api/company-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          companyId: company.id,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));

      closeConfirmDialog();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const openAddUserModal = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      setAllUsers(data);
      setAddOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  const handleAddUsers = async () => {
    try {
      setAdding(true);

      const res = await fetch("/api/company-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: company.id,
          userIds: selectedUsers,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const newUsers = allUsers.filter((u) => selectedUsers.includes(u.id));

      setUsers((prev) => [...prev, ...newUsers]);

      setSelectedUsers([]);
      setAddOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Box sx={{ width: 400, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Company Details
            </Typography>

            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">{company?.name}</Typography>
          <Typography color="text.secondary">{company?.email}</Typography>

          {company?.location && (
            <Typography color="text.secondary">{company.location}</Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight="bold">Users</Typography>

            <IconButton onClick={openAddUserModal}>
              <PersonAddIcon />
            </IconButton>
          </Box>

          {users.length > 0 ? (
            users.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  mb: 1,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar sx={{ width: 30, height: 30 }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography fontWeight={600}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <IconButton
                  color="error"
                  size="small"
                  onClick={() => openConfirmDialog(user.id)}
                  disabled={deletingId === user.id}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">No users assigned</Typography>
          )}
        </Box>
      </SwipeableDrawer>

      <Dialog open={confirmOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Remove User</DialogTitle>

        <DialogContent>
          Are you sure you want to remove this user?
        </DialogContent>

        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancel</Button>

          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth>
        <DialogTitle>Add Users to Company</DialogTitle>

        <DialogContent>
          {allUsers.map((user) => (
            <Box
              key={user.id}
              onClick={() => toggleUser(user.id)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1.5,
                mb: 1,
                bgcolor: selectedUsers.includes(user.id)
                  ? "#e3f2fd"
                  : "#f5f5f5",
                borderRadius: 2,
                cursor: "pointer",
              }}
            >
              <Box>
                <Typography fontWeight={600}>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>

          <Button
            onClick={handleAddUsers}
            variant="contained"
            disabled={adding}
          >
            Add Users
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
