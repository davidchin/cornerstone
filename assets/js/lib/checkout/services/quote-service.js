export default function buildQuoteService(
    $http,
    API
) {
    'ngInject';

    const quote = {
        orderComment: '',
    };

    const service = {
        fetchQuote,
        getQuote,
        getQuoteMeta,
        getShippingOption,
        hasShippingOption,
        setQuote,
        setQuoteMeta,
        setShippingOption,
    };

    let quoteMeta = {};

    function fetchQuote() {
        return $http.get(API.QUOTE_URL)
            .then(resp => {
                const { data, meta } = resp.data;

                service.setQuote(data.quote);
                service.setQuoteMeta(meta);

                return data;
            });
    }

    function getQuote() {
        return quote;
    }

    function getQuoteMeta() {
        return quoteMeta;
    }

    function getShippingOption() {
        return quote.shippingOption;
    }

    function hasShippingOption() {
        return quote.shippingOption !== null;
    }

    function setQuote(quoteToSet) {
        _.extend(quote, quoteToSet);

        return quote;
    }

    function setQuoteMeta(newQuoteMeta) {
        quoteMeta = newQuoteMeta;
    }

    function setShippingOption(shippingOptionId = null) {
        quote.shippingOption = shippingOptionId;

        return quote.shippingOption;
    }

    return service;
}
