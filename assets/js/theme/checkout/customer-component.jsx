import React from 'react';
import { SnackbarContent } from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

const styles = {
    textField: {
        marginLeft: 20,
        marginRight: 20,
        width: 300,
    },
};

class CustomerComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        };
    }

    componentWillReceiveProps({ customer }) {
        if (this.props.customer !== customer) {
            this.setState({
                email: customer.email || '',
                password: '',
            });
        }
    }

    render() {
        return (
            <form onSubmit={ (...args) => this._handleSubmit(...args) } noValidate>
                <Typography type="display1" gutterBottom>
                    Customer
                </Typography>

                { this.props.error && <SnackbarContent message={ this.props.error.body.detail } /> }

                <TextField
                    label="Email"
                    type="email"
                    value={ this.state.email }
                    onChange={ (...args) => this._handleEmailChange(...args) }
                    autoComplete="email"
                    margin="normal"
                    disabled={ this.props.customer.isGuest === false }
                    className={ this.props.classes.textField }
                    required
                />

                { this.props.customer.isGuest &&
                    <TextField
                        label="Password"
                        type="password"
                        value={this.state.password}
                        onChange={(...args) => this._handlePasswordChange(...args)}
                        margin="normal"
                        className={this.props.classes.textField}
                    />
                }

                {this.props.customer.isGuest &&
                    <Button
                        type="submit"
                        disabled={this.props.isSigningIn}>
                        Sign in
                    </Button>
                }

                { this.props.customer.isGuest === false &&
                    <Button
                        onClick={ (...args) => this._handleSignOut(...args) }
                        disabled={ this.props.isSigningOut }
                    >
                        Sign out
                    </Button>
                }
            </form>
        );
    }

    _handleEmailChange({ target }) {
        this.setState({
            email: target.value,
        });
    }

    _handlePasswordChange({ target }) {
        this.setState({
            password: target.value,
        });
    }

    _handleSubmit(event) {
        event.preventDefault();

        this.props.onSignIn({
            email: this.state.email,
            password: this.state.password || null,
        });
    }

    _handleSignOut(event) {
        event.preventDefault();

        this.props.onSignOut();
    }
}

export default withStyles(styles)(CustomerComponent);
