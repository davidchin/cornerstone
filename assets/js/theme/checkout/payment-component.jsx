import React from 'react';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Radio from 'material-ui/Radio';
import Typography from 'material-ui/Typography';
import PaymentForm from './payment-form-component.jsx';
import { SnackbarContent } from 'material-ui';

export default class PaymentComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            paymentData: {},
            selectedMethodId: null,
            selectedMethodGateway: null,
        };
    }

    getPaymentForm() {
        return (
            <PaymentForm
                creditCard={ this.state.paymentData }
                onChange={ (creditCard) => this._handleCreditCardChange(creditCard) }
            />
        );
    }

    getErrors({ body = {} } = {}) {
        const out = [];

        if (body && body.detail) {
            const { detail: message } = body;
            out.push({ message });
        }

        if (body.errors && body.errors.length) {
            out.push.apply(out, body.errors);
        }

        return out;
    }

    render() {
        return (
            <form onSubmit={ (...args) => this._handleSubmit(...args) } noValidate>
                <Typography type="display1" gutterBottom>
                    Payment
                </Typography>

                {
                    this.getErrors(this.props.error)
                        .map((error, key) => (<SnackbarContent key={ key } message={ error.message } />))
                }

                <List>
                    { this.props.methods.map(method => (
                        <ListItem
                            key={ method.id }
                            onClick={ () => this._handleMethodSelect(method.id, method.gateway) }
                            button>
                            <Radio
                                checked={ this.state.selectedMethodId === method.id }
                                disableRipple
                            />
                            <ListItemText primary={ method.config.displayName } />
                        </ListItem>
                    )) }
                </List>

                {this.state.selectedMethodId && this.getPaymentForm()}

                <Button type="submit">
                    Submit
                </Button>
            </form>
        );
    }

    _handleMethodSelect(methodId, gateway) {
        this.setState({
            selectedMethodId: methodId,
            selectedMethodGateway: gateway,
        });

        this.props.onChange(methodId, gateway);
    }

    _handleCreditCardChange(paymentData) {
        this.setState({ paymentData });
    }

    _handleSubmit(event) {
        event.preventDefault();

        this.props.onSubmit(
            this.state.selectedMethodId,
            this.state.selectedMethodGateway,
            this.state.paymentData,
        );
    }
}
