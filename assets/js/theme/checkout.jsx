import PageManager from './page-manager';
import Checkout from './checkout/checkout-component';
import ReactDOM from 'react-dom';

export default class CheckoutPage extends PageManager {
    loaded(next) {
        ReactDOM.render(
            <Checkout />,
            document.getElementById('checkout-app')
        );

        next();
    }
}
