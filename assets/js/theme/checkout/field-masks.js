import MaskedInput from 'react-text-mask';
import { Component } from 'react';

export class MonthYearMask extends Component {
    render() {
        return (
            <MaskedInput
                {...this.props }
                mask={[/\d/, /\d/, '/', /\d/, /\d/]}
                placeholderChar={'\u2000'}
            />
        );
    }
}

export class CvvMask extends Component {
    render() {
        return (
            <MaskedInput
                {...this.props }
                mask={[/\d/, /\d/, /\d/]}
                placeholderChar={'\u2000'}
            />
        );
    }
}
