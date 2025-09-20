import React from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  ShoppingCart, 
  Add as AddIcon, 
  Remove as RemoveIcon 
} from '@mui/icons-material';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    total, 
    isLoading, 
    error, 
    removeFromCart, 
    clearCart, 
    isRemoving, 
    isClearing,
    addItemToCart 
  } = useCart();

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId).unwrap();
    } catch (error) {
      console.error('Ошибка удаления из корзины:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Очистить всю корзину?')) {
      try {
        await clearCart().unwrap();
      } catch (error) {
        console.error('Ошибка очистки корзины:', error);
      }
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleAddOne = async (productId: number, currentQuantity: number, productQuantity: number) => {
    if (productQuantity > currentQuantity) {
      await addItemToCart(productId, 1);
    }
  };

  const handleRemoveOne = async (itemId: number) => {
    await removeFromCart(itemId);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalProducts = cartItems.length;

  if (isLoading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Ошибка загрузки корзины: Попробуйте обновить страницу
        </Alert>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center', minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="text.secondary">
          Корзина пуста
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Добавьте товары в корзину, чтобы сделать заказ
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleContinueShopping}
          sx={{ mt: 2 }}
        >
          Продолжить покупки
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          🛒 Корзина
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleClearCart} 
          disabled={isClearing}
          startIcon={isClearing ? <CircularProgress size={16} /> : <DeleteIcon />}
        >
          Очистить корзину
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Таблица товаров */}
        <Grid size={{xs: 12, md: 8}} >
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Товар</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Цена</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Количество</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Итого</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src={`https://via.placeholder.com/50x50?text=${encodeURIComponent(item.product.name)}`}
                          alt={item.product.name}
                          style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 16, borderRadius: 4 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {item.product.name}
                          </Typography>
                          <Chip label={item.product.category} size="small" variant="outlined" />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {item.product.price.toLocaleString('ru-RU')} ₸
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveOne(item.id)}
                          disabled={isRemoving || item.quantity <= 1}
                          color="primary"
                          sx={{ 
                            border: '1px solid', 
                            borderColor: 'primary.main',
                            borderRadius: 1
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            minWidth: '30px', 
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: 'primary.main'
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        
                        <IconButton
                          size="small"
                          onClick={() => handleAddOne(item.product.id, item.quantity, item.product.quantity)}
                          disabled={isRemoving || (item.product.quantity - item.quantity) <= 0}
                          color="primary"
                          sx={{ 
                            border: '1px solid', 
                            borderColor: 'primary.main',
                            borderRadius: 1
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      {(item.product.quantity - item.quantity) > 0 && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            mt: 1, 
                            display: 'block', 
                            textAlign: 'center',
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            fontWeight: 400,
                            backgroundColor: 'grey.50',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.300'
                          }}
                        >
                          Доступно: {item.product.quantity - item.quantity} шт.
                        </Typography>
                      )}
                      
                      {(item.product.quantity - item.quantity) === 0 && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            mt: 1, 
                            display: 'block', 
                            textAlign: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            backgroundColor: 'warning.light',
                            color: 'warning.contrastText',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'warning.main'
                          }}
                        >
                          Максимальное количество
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₸
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button 
            variant="outlined" 
            onClick={handleContinueShopping}
            size="large"
            sx={{ mb: 3 }}
          >
            Продолжить покупки
          </Button>
        </Grid>

        {/* Боковая панель с итогами */}
        <Grid size={{xs: 12, md: 4}}>
          <Paper sx={{ p: 3, position: 'sticky', top: '100px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              💰 Итог заказа
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Товаров:</Typography>
                <Typography variant="body2">{totalItems} шт.</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Позиций:</Typography>
                <Typography variant="body2">{totalProducts} шт.</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Общая сумма:</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {total.toLocaleString('ru-RU')} ₸
                </Typography>
              </Box>
            </Box>

            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              fullWidth
              sx={{ 
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              🛒 Оформить заказ
            </Button>

          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;