import PageManager from './page-manager';

export default class OrderConfirmation extends PageManager {
    loaded(next) {
        console.log('Loaded order confirmation');

        next();
    }
}
