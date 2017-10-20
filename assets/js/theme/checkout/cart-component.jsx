import { formatMoney } from 'accounting';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';

export default function CartComponent({ cart }) {
    return (
        <div>
            <Typography type="display1" gutterBottom>
                Order
            </Typography>

            <List>
                { (cart.items || []).map((item) => (
                    <ListItem key={ item.id }>
                        <Avatar src={ item.imageUrl } />
                        <ListItemText primary={ `${item.quantity} x ${item.name}` } />
                        <ListItemSecondaryAction>
                            { formatMoney(item.amount) }
                        </ListItemSecondaryAction>
                    </ListItem>
                )) }

                <Divider />

                <ListItem>
                    <ListItemText primary="Subtotal" />
                    <ListItemSecondaryAction>
                        { cart.subtotal ? formatMoney(cart.subtotal.amount) : '-' }
                    </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                    <ListItemText primary="Shipping" />
                    <ListItemSecondaryAction>
                        { cart.shipping ? formatMoney(cart.shipping.amount) : '-' }
                    </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                    <ListItemText primary="Tax" />
                    <ListItemSecondaryAction>
                        { cart.taxTotal ? formatMoney(cart.taxTotal.amount) : '-' }
                    </ListItemSecondaryAction>
                </ListItem>

                <Divider />

                <ListItem>
                    <ListItemText primary="Total" />
                    <ListItemSecondaryAction>
                        { cart.grandTotal ? formatMoney(cart.grandTotal.amount) : '-' }
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </div>
    );
}
