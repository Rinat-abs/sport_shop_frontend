import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Chip,
  Divider,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = parseInt(id || '');
  const { product, isLoading, error } = useProduct(productId);
  const { addItemToCart, removeFromCart, isProductInCart, getCartItemId, isAdding, getProductQuantityInCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isInCart = isProductInCart(productId);
  const cartItemId = getCartItemId(productId);
  const cartQuantity = getProductQuantityInCart(productId);

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addItemToCart(product.id, quantity);
      } catch (error) {
        console.error('Ошибка добавления в корзину:', error);
      }
    }
  };

  const handleRemoveFromCart = async () => {
    if (cartItemId) {
      try {
        await removeFromCart(cartItemId);
      } catch (error) {
        console.error('Ошибка удаления из корзины:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Товар не найден или произошла ошибка загрузки
        </Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)} 
          sx={{ mt: 2 }}
          variant="outlined"
        >
          Вернуться назад
        </Button>
      </Container>
    );
  }

  const availableQuantity = Math.max(0, product.quantity - (isInCart ? cartQuantity : 0));

  return (
    <Container sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Назад к товарам
      </Button>

      <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="400"
              image={`https://via.placeholder.com/500x400?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              <Chip label={product.category} color="primary" variant="outlined" />
              <Chip 
                label={availableQuantity > 0 ? `В наличии: ${availableQuantity} шт.` : 'Нет в наличии'} 
                color={availableQuantity > 0 ? 'success' : 'error'} 
              />
            </Box>

            <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.price.toLocaleString('ru-RU')} ₸
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            {isInCart && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Уже в корзине: {cartQuantity} шт.
              </Alert>
            )}

            <Box sx={{ mt: 'auto', pt: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <TextField
                  type="number"
                  label="Количество"
                  value={quantity}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    setQuantity(Math.min(value, availableQuantity));
                  }}
                  inputProps={{ 
                    min: 1, 
                    max: availableQuantity,
                    style: { textAlign: 'center' }
                  }}
                  sx={{ width: 100 }}
                  disabled={availableQuantity === 0}
                  size="small"
                />
                
                {isInCart ? (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveFromCart}
                    disabled={isAdding}
                    startIcon={isAdding ? <CircularProgress size={16} /> : undefined}
                    size="large"
                  >
                    Удалить из корзины
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleAddToCart}
                    disabled={isAdding || availableQuantity === 0}
                    startIcon={isAdding ? <CircularProgress size={16} /> : undefined}
                    size="large"
                    sx={{ minWidth: '200px' }}
                  >
                    Добавить в корзину
                  </Button>
                )}
              </Box>

              {availableQuantity === 0 && product.quantity > 0 && (
                <Alert severity="warning">
                  Все доступные единицы этого товара уже в вашей корзине
                </Alert>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;