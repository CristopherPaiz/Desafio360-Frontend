import { useState, useEffect, useCallback } from "react";
import { Paper, InputBase, IconButton, Popper, ClickAwayListener, MenuList, MenuItem, Box, Typography, CircularProgress } from "@mui/material";
import { Search, ArrowForward } from "@mui/icons-material";
import useFetch from "../hooks/useFetch";
import { URL_BASE } from "../config/config";
import { debounce } from "lodash";
import PropTypes from "prop-types";

const SearchBar = ({ isSmallScreen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const { loading, request } = useFetch();

  const containerWidth = isSmallScreen ? "100%" : "600px";

  const performSearch = async (query) => {
    if (query.length < 4) {
      setProducts([]);
      return;
    }

    try {
      const response = await request(`${URL_BASE}/productos/filtro?nombre=${query}`, "GET", null);

      if (response.error) {
        return;
      } else {
        setProducts(response.data.slice(0, 5));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => performSearch(query), 400),
    []
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length >= 4) {
      debouncedSearch(value);
    } else {
      setProducts([]);
    }
  };

  const handleProductSelect = (productId) => {
    window.location.href = `/productos/${productId}`;
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.length >= 4) {
      performSearch(searchTerm);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setProducts([])}>
      <Box sx={{ position: "relative", width: containerWidth, margin: "0 auto" }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: "4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={isSmallScreen ? "Buscar..." : "Buscar productos..."}
            value={searchTerm}
            onChange={handleSearchChange}
            inputRef={setAnchorEl}
          />
          {loading ? (
            <CircularProgress size={24} sx={{ mx: 1 }} />
          ) : (
            <IconButton type="submit" sx={{ p: "10px" }}>
              <Search />
            </IconButton>
          )}
        </Paper>

        <Popper
          open={products.length > 0}
          anchorEl={anchorEl}
          sx={{
            width: containerWidth,
            zIndex: 1300,
          }}
        >
          <Paper elevation={5} sx={{ ml: 2 }}>
            <MenuList sx={{ mt: 1.5 }}>
              {products.map((product) => (
                <MenuItem
                  key={product.idProductos}
                  onClick={() => handleProductSelect(product.idProductos)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1,
                  }}
                >
                  <Box
                    component="img"
                    src={product.foto}
                    alt={product.nombre}
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.nombre}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.marca} - Q{product.precio.toFixed(2)}
                    </Typography>
                  </Box>
                  <ArrowForward sx={{ flexShrink: 0 }} />
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

SearchBar.propTypes = {
  isSmallScreen: PropTypes.bool,
};

export default SearchBar;
