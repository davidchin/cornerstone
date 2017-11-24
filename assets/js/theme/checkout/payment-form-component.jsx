import React from 'react';

import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui';
import { CvvMask, MonthYearMask } from './field-masks';

const STARTING_YEAR = 2000;

const styles = {
    textField: {
        marginLeft: 20,
        marginRight: 20,
        width: 300,
    },
};

class PaymentFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            creditCard: {
                ccNumber: '',
                ccName: '',
                ccCvv: '',
                ccExpiry: {
                    month: '',
                    year: '',
                },
                ccType: 'visa',
            },
            expiryDate: '',
        };
    }

    componentWillReceiveProps({ creditCard = {} }) {
        if (this.props.creditCard !== creditCard) {
            const { month, year } = creditCard.ccExpiry;
            const expiryDate = `${month}/${year}`;

            this.setState({ creditCard, expiryDate });
        }
    }

    render() {
        return (
            <div>
                <TextField
                    label="Credit Card Number"
                    value={ this.state.creditCard.ccNumber || '' }
                    onChange={ this._handleCreditCardChange('ccNumber') }
                    autoComplete="cc-number"
                    margin="normal"
                    className={ this.props.classes.textField }
                    required
                />
                <TextField
                    label="Expiration"
                    InputProps={ { inputComponent: MonthYearMask } }
                    value={ this.state.expiryDate || '' }
                    onChange={ (event) => this._handleExpiryChange(event) }
                    autoComplete="cc-exp"
                    margin="normal"
                    className={ this.props.classes.textField }
                    required
                />
                <TextField
                    label="Name on card"
                    value={ this.state.creditCard.ccName || '' }
                    onChange={ this._handleCreditCardChange('ccName') }
                    autoComplete="cc-name"
                    margin="normal"
                    className={ this.props.classes.textField }
                    required
                />
                <TextField
                    label="CVV"
                    InputProps={ { inputComponent: CvvMask } }
                    value={ this.state.creditCard.ccCvv || '' }
                    onChange={ this._handleCreditCardChange('ccCvv') }
                    autoComplete="cc-cvv"
                    margin="normal"
                    className={ this.props.classes.textField }
                    required
                />
            </div>
        );
    }

    _handleExpiryChange({ target }) {
        const [month, year] = target.value.split('/');

        const creditCard = {
            ...this.state.creditCard,
            ccExpiry: {
                month,
                year,
            }
        };

        this.setState({
            creditCard,
            expiryDate: target.value,
        });

        this.props.onChange(creditCard);
    }

    _handleCreditCardChange(fieldName) {
        return ({ target }) => {
            const creditCard = {
                ...this.state.creditCard,
                [fieldName]: target.value,
            };

            this.setState({ creditCard });
            this.props.onChange(creditCard);
        };
    }
}

export default withStyles(styles)(PaymentFormComponent);
