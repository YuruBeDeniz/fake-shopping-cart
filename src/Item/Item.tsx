import Button from "@material-ui/core/Button";
//types
import { CartItemType } from "../App";
//styles
import { Wrapper } from "./Item.styles";

type ItemProps = {
    item: CartItemType;
    handleAddToCart: (clickedItem: CartItemType) => void;
};

const Item: React.FC<ItemProps> = ({ item, handleAddToCart }) => (
    <Wrapper>
        <img src={item.image} alt={item.title} />
        <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <h3>{item.price}</h3>
        </div>
        <Button onClick={() => handleAddToCart(item)}>Add to cart</Button>
    </Wrapper>
);

export default Item;

//in our onClick function, we have an inline function and we call the handleAddToCart
//and we need the inline arrow function as we need to send in the prop (item) here;
//onClick={handleAddToCart(item)} --> we cant have it like this, as this will trigger
//it right away, that's why we use an inline function: onClick={() => handleAddToCart(item)}
