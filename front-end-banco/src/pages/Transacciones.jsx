import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../resources/css/generalPages.css';
const transacciones = [
  { descripcion: 'gastos varios', monto: '75.45 US', fecha: '23/12/23' },
  { descripcion: 'gastos varios', monto: '75.45 US', fecha: '23/12/23' },
  { descripcion: 'gastos varios', monto: '75.45 US', fecha: '23/12/23' },
  { descripcion: 'gastos varios', monto: '75.45 US', fecha: '23/12/23' },
];

export default function TransaccionesPage() {
  return (
    <Box sx={{ bgcolor: '#e0e0e0', minHeight: '100vh', p: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderBottom: 1, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/logo.png" alt="Banco de Agricultura" width={64} />
            <Typography variant="h5" color="green">Transacciones</Typography>
          </Box>
          <Avatar><AccountCircleIcon /></Avatar>
        </Box>

        {/* Filtros */}
        <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
          <Typography>Filtrar por:</Typography>
          <FormControl size="small">
            <InputLabel>Mes</InputLabel>
            <Select defaultValue="todos" label="Mes">
              <MenuItem value="todos">Todos</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Cuenta</InputLabel>
            <Select defaultValue="todos" label="Cuenta">
              <MenuItem value="todos">Todos</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <div className="cells">
            <Box container className="cells">
                {/* Ingresos */}
                <div className="ingresos">
                    <Grid item size={12} xs={12} md={6}>
                        <Typography variant="subtitle2" color="green" gutterBottom>INGRESOS</Typography>
                        {transacciones.map((t, index) => (
                        <Paper key={`ingreso-${index}`} elevation={3} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                            <Typography variant="body2">Descripción</Typography>
                            <Typography variant="h6" color="green">{t.monto}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption">{t.descripcion}</Typography>
                            <Typography variant="caption" color="text.secondary">{t.fecha}</Typography>
                            </Box>
                        </Paper>
                        ))}
                    </Grid>
                </div>

                <div className="egresos">
                    {/* Egresos */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="error" gutterBottom>INGRESOS</Typography>
                        {transacciones.map((t, index) => (
                        <Paper key={`egreso-${index}`} elevation={3} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                            <Typography variant="body2">Descripción</Typography>
                            <Typography variant="h6" color="error">{t.monto}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption">{t.descripcion}</Typography>
                            <Typography variant="caption" color="text.secondary">{t.fecha}</Typography>
                            </Box>
                        </Paper>
                        ))}
                    </Grid>
                </div>
            </Box>
        </div>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="contained" sx={{ bgcolor: '#FFD700', color: '#000', fontWeight: 'bold' }}>
            REGRESAR
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
