import { useState } from "react";
import { useQuery } from "react-query";
//components
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
import { Drawer } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon  from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";
//styles
import { Wrapper, StyledButton} from "./App.styles";
//types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number
};

//we create this fetching function outside of the App as we dont need to re-create
//it on each render.
const getProducts = async (): Promise<CartItemType[]> => {
  return await (await fetch("https://fakestoreapi.com/products")).json();
}

function App() {
  const [cartIsOpen, setCartIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);

  const { data, isLoading, error } = useQuery<CartItemType[]>("products", getProducts);

  console.log(data);

  const getTotalItems = (items: CartItemType[]) => {
    return items.reduce((acc: number, item) => acc + item.amount, 0);
  };
  
  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      //1. is the item already added in cart?
       const isItemInCart = prev.find(item => item.id === clickedItem.id);
       if(isItemInCart) {
        return prev.map(item => (
          item.id === clickedItem.id
           ? { ...item, amount: item.amount + 1 }
           : item
        ))
       }
       //otherwise, first time the item is added
       return [...prev, { ...clickedItem, amount: 1 }]
    })
  };

  const handleRemoveFromCart= (id: number) => {
    setCartItems(prev => (
      prev.reduce((acc, item) => {
        if(item.id === id) {
          if(item.amount === 1) return acc;
          return [...acc, { ...item, amount: item.amount - 1 }];
        } else {
          return [...acc, item];
        }
      }, [] as CartItemType[])
    ))
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>

  return (
    <Wrapper>
      <Drawer anchor="right" open={cartIsOpen} onClose={() => setCartIsOpen(false)}>
        <Cart 
          cartItems={cartItems} 
          addToCart={handleAddToCart} 
          removeFromCart={handleRemoveFromCart}/>
      </Drawer>
      <StyledButton onClick={() => setCartIsOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={2}>
        {data?.map((item: CartItemType) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

export default App;


/* CartItemType is from the API, we can see this structure when we get the data back.
except amount are the properties we get back from the api. but we will add our own
property -amount- we we need to keep track of the amount in our cart.

after creating the CartItemType; we can now type the return type of getProducts function.
It will be a Promise as we're using async and await. and Promise is generic, so 
we can provide it with the type we want: CartItemType */

/* inside our App, we'll use react query to fetch our data. then we have a query key and 
it is a string. we can name it whatever we want: products and we provide our fetching function */
