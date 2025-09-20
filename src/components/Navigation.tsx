import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { itemsCount } = useCart();

  return (
    <AppBar 
      position="fixed" // Меняем static на fixed
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, // Убедимся, что шапка поверх всего
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', // Добавим тень для красоты
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold',
            fontSize: '1.3rem'
          }}
        >
          🛍️ Магазин
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ fontWeight: '600' }}
          >
            Главная
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/admin')}
            sx={{ fontWeight: '600' }}
          >
            Админка
          </Button>
          <Button
            color="inherit"
            startIcon={
              <Badge 
                badgeContent={itemsCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    height: '18px',
                    minWidth: '18px',
                  }
                }}
              >
                <ShoppingCart />
              </Badge>
            }
            onClick={() => navigate('/cart')}
            sx={{ fontWeight: '600' }}
          >
            Корзина
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;