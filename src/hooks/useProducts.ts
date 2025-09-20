import {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
  } from '../store/api/api';
  
  export const useProducts = () => {
    const { data: products = [], isLoading, error } = useGetProductsQuery();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  
    return {
      products,
      isLoading,
      error,
      createProduct,
      updateProduct,
      deleteProduct,
      isCreating,
      isUpdating,
      isDeleting,
    };
  };
  
  export const useProduct = (id: number) => {
    const { data: product, isLoading, error } = useGetProductQuery(id);
  
    return {
      product,
      isLoading,
      error,
    };
  };