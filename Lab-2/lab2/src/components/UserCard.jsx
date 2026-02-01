import { Card, CardContent, Typography } from "@mui/material";

export default function UserCard({ user }) {
  return (
    <Card sx={{ minWidth: 275, margin: 1 }}>
      <CardContent>
        <Typography variant="h6">{user.name}</Typography>
        <Typography color="text.secondary">{user.email}</Typography>
        <Typography color="text.secondary">{user.phone}</Typography>
      </CardContent>
    </Card>
  );
}
