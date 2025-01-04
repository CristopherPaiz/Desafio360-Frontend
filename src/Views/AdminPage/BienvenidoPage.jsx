import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { Person as PersonIcon, People as PeopleIcon } from "@mui/icons-material";

const OPCIONES = [
  {
    title: "Usuarios",
    description: "Administre los usuarios del sistema. Puede agregar nuevos usuarios o ver el listado existente.",
    icon: <PersonIcon />,
  },
  {
    title: "Clientes",
    description: "Gestione la información de los clientes. Agregue nuevos clientes o consulte el listado.",
    icon: <PeopleIcon />,
  },
];

const BienvenidoPage = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Bienvenido al Panel de Administración
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          Por favor, seleccione una de las opciones disponibles para empezar a gestionar la información.
        </Typography>
        <List>
          {OPCIONES.map((opcion, index) => (
            <ListItem key={index} sx={{ alignItems: "flex-start", marginBottom: 2 }}>
              <ListItemIcon sx={{ marginTop: 0.5 }}>{opcion.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" component="span">
                    {opcion.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {opcion.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default BienvenidoPage;
