describe('Checkout', () => {
    let checkout;

    beforeEach(() => {
        module('bigcommerce-checkout');

        inject($injector => {
            checkout = $injector.get('checkout');
        });
    });

    it('does something', () => {
        expect(checkout).toBeDefined();
    });
});
