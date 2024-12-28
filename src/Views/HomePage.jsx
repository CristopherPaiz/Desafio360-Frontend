import CategoriasBarra from "../components/CategoriasBarra/CategoriasBarra";
import ProductosPorCategoria from "../components/ProductosPorCategorias/ProductosPorCategoria";

const HomePage = () => {
  return (
    <>
      {/* BARRA DE CATEGORIAS */}
      <CategoriasBarra />
      <ProductosPorCategoria />
    </>
  );
};

export default HomePage;
