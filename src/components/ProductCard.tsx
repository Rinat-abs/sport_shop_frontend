import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import type { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import NoImage from '../assets/no-image.jpg'

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { 
    addItemToCart, 
    removeFromCart, 
    isProductInCart, 
    getCartItemId, 
    getProductQuantityInCart,
    isAdding 
  } = useCart();
  
  const isInCart = isProductInCart(product.id);
  const cartItemId = getCartItemId(product.id);
  const cartQuantity = getProductQuantityInCart(product.id);

  const handleAddToCart = async () => {
    await addItemToCart(product.id, 1);
  };



  const handleRemoveOne = async () => {
    if (cartItemId) {
      // Просто удаляем один элемент из корзины
      // API должно само обработать уменьшение количества
      await removeFromCart(cartItemId);
    }
  };

  const handleAddOne = async () => {
    if (product.quantity > cartQuantity) {
      await addItemToCart(product.id, 1);
    }
  };

  const availableQuantity = product.quantity - cartQuantity;

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={NoImage}
        alt={product.name}
        onClick={() => navigate(`/product/${product.id}`)}
        style={{ cursor: 'pointer', objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description.slice(0, 100)}...
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip label={product.category} size="small" variant="outlined" />
          <Chip 
            label={product.quantity > 0 ? `${product.quantity} шт.` : 'Нет в наличии'} 
            color={product.quantity > 0 ? 'success' : 'error'} 
            size="small" 
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            {product.price.toLocaleString('ru-RU')} ₸
          </Typography>
          
          {isInCart ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={handleRemoveOne}
                disabled={isAdding || cartQuantity <= 1}
                color="primary"
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'primary.main',
                  borderRadius: 1
                }}
              >
                <Remove fontSize="small" />
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
                {cartQuantity}
              </Typography>
              
              <IconButton
                size="small"
                onClick={handleAddOne}
                disabled={isAdding || availableQuantity <= 0}
                color="primary"
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'primary.main',
                  borderRadius: 1
                }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              disabled={isAdding || product.quantity === 0}
              size="small"
              sx={{ minWidth: '120px' }}
              startIcon={isAdding ? <CircularProgress size={16} /> : undefined}
            >
              {isAdding ? '' : 'В корзину'}
            </Button>
          )}
        </Box>

        {isInCart && availableQuantity > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Можно добавить еще: {availableQuantity} шт.
          </Typography>
        )}

        {isInCart && availableQuantity === 0 && (
          <Typography variant="caption" color="warning.main" sx={{ mt: 1, textAlign: 'center' }}>
            Максимальное количество в корзине
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;