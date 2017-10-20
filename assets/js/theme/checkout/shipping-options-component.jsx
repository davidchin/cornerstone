import { isEmpty } from 'lodash';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Radio from 'material-ui/Radio';

export default function ShippingOptions(props) {
    if (!props.address || isEmpty(props.options)) {
        return null;
    }

    return (
        <List>
            { props.options[props.address.id].map(option => (
                <ListItem
                    key={ option.id }
                    onClick={ () => props.onOptionSelect(option.id) }
                    button>
                    <Radio
                        checked={ props.selectedOptionId === option.id }
                        disableRipple
                    />
                    <ListItemText primary={ option.description } />
                </ListItem>
            )) }
        </List>
    );
}

