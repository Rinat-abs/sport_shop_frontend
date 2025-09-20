import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useProducts } from '../hooks/useProducts';
import type { Product, CreateProductRequest } from '../types';

const AdminPage: React.FC = () => {
  const { products, isLoading, error, createProduct, updateProduct, deleteProduct, isCreating, isUpdating, isDeleting } = useProducts();
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateProductRequest>();

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('category', product.category);
      setValue('quantity', product.quantity);
    } else {
      setEditingProduct(null);
      reset();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = async (data: CreateProductRequest) => {
    try {
      if (editingProduct) {
        await updateProduct({ ...data, id: editingProduct.id }).unwrap();
      } else {
        await createProduct(data).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error('Ошибка сохранения товара:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить этот товар?')) {
      try {
        await deleteProduct(id).unwrap();
      } catch (error) {
        console.error('Ошибка удаления товара:', error);
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

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Ошибка загрузки товаров: Попробуйте обновить страницу
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          👨‍💼 Панель администратора
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          size="large"
        >
          Добавить товар
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {products.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Товары отсутствуют. Добавьте первый товар.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm:6, md: 4, lg: 3 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {product.name}
                  </Typography>
                  <Typography color="primary" variant="h6" gutterBottom>
                    {product.price.toLocaleString('ru-RU')} ₸
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    {product.description.slice(0, 80)}...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={product.category} size="small" variant="outlined" />
                    <Chip 
                      label={`${product.quantity} шт.`} 
                      color={product.quantity > 0 ? 'success' : 'error'} 
                      size="small" 
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton 
                    onClick={() => handleOpen(product)} 
                    disabled={isUpdating}
                    color="primary"
                    title="Редактировать"
                  >
                    {isUpdating ? <CircularProgress size={24} /> : <EditIcon />}
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(product.id)} 
                    disabled={isDeleting}
                    title="Удалить"
                  >
                    {isDeleting ? <CircularProgress size={24} /> : <DeleteIcon />}
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingProduct ? '✏️ Редактировать товар' : '➕ Добавить новый товар'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid  size={{xs: 12}}>
                <TextField
                  fullWidth
                  label="Название товара"
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register('name', { 
                    required: 'Название обязательно',
                    minLength: { value: 2, message: 'Минимум 2 символа' }
                  })}
                />
              </Grid>
              <Grid  size={{xs: 12}}>
                <TextField
                  fullWidth
                  label="Описание"
                  multiline
                  rows={4}
                  required
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  {...register('description', { 
                    required: 'Описание обязательно',
                    minLength: { value: 10, message: 'Минимум 10 символов' }
                  })}
                />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField
                  fullWidth
                  label="Цена"
                  type="number"
                  required
                  inputProps={{ step: "0.01", min: 0 }}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  {...register('price', { 
                    required: 'Цена обязательна',
                    min: { value: 0, message: 'Цена не может быть отрицательной' }
                  })}
                />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
              <TextField
                  fullWidth
                  label="Количество"
                  type="number"
                  required
                  inputProps={{ min: 0 }}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  {...register('quantity', { 
                    required: 'Количество обязательно',
                    min: { value: 0, message: 'Количество не может быть отрицательным' }
                  })}
                />
              </Grid>
              <Grid size={{xs: 12 }}>
                <TextField
                  fullWidth
                  label="Категория"
                  required
                  error={!!errors.category}
                  helperText={errors.category?.message}
                  {...register('category', { 
                    required: 'Категория обязательна',
                    minLength: { value: 2, message: 'Минимум 2 символа' }
                  })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} variant="outlined">
              Отмена
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isCreating}
              sx={{ minWidth: '120px' }}
            >
              {isCreating ? (
                <CircularProgress size={24} />
              ) : editingProduct ? (
                'Обновить'
              ) : (
                'Создать'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Статистика:
        </Typography>
        <Grid container spacing={2}>
          <Grid  size={{xs: 12, sm: 6, md: 3}}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {products.length}
              </Typography>
              <Typography variant="body2">Всего товаров</Typography>
            </Card>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {products.filter(p => p.quantity > 0).length}
              </Typography>
              <Typography variant="body2">В наличии</Typography>
            </Card>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {products.filter(p => p.quantity === 0).length}
              </Typography>
              <Typography variant="body2">Нет в наличии</Typography>
            </Card>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">
                {products.reduce((total, p) => total + p.quantity, 0)}
              </Typography>
              <Typography variant="body2">Общее количество</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPage;