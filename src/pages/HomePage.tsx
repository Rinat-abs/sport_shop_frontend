import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Product } from '@/types';

const HomePage: React.FC = () => {
  const { products, isLoading, error } = useProducts();
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);
  const productsPerPage = 12;

  const loadMoreProducts = useCallback(() => {
    if (products.length > 0) {
      const startIndex = (page - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const nextProducts = products.slice(0, endIndex);
      
      setVisibleProducts(nextProducts);
      
      if (endIndex < products.length) {
        setPage(prev => prev + 1);
      }
    }
  }, [products, page, productsPerPage]);

  // Инициализация при загрузке товаров
  useEffect(() => {
    if (products.length > 0 && visibleProducts.length === 0) {
      loadMoreProducts();
    }
  }, [products, visibleProducts.length, loadMoreProducts]);

  // Intersection Observer для обнаружения скролла
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleProducts.length < products.length && !isLoading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMoreProducts, visibleProducts.length, products.length, isLoading]);

  // Сброс при изменении продуктов
  useEffect(() => {
    setVisibleProducts([]);
    setPage(1);
  }, [products]);

  if (isLoading && visibleProducts.length === 0) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка загрузки товаров: Попробуйте обновить страницу
        </Alert>
      </Container>
    );
  }

  const hasMoreProducts = visibleProducts.length < products.length;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        🛍️ Наши товары
      </Typography>
      
      {products.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Товары отсутствуют
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {visibleProducts.map((product) => (
              <Grid key={product.id} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Элемент для наблюдения за скроллом */}
          <div ref={observerTarget} style={{ height: '20px' }} />

          {/* Индикатор загрузки */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Сообщение когда все товары загружены */}
          {!hasMoreProducts && products.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Все товары загружены ({products.length} товаров)
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default HomePage;