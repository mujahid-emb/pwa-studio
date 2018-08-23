import { Component, createElement } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Section from './section';
import SubmitButton from './submitButton';
import defaultClasses from './form.css';
import Selector from 'src/components/Selector';

class Form extends Component {
    constructor(props) {
      super(props);
      this.state = {
        updatePayment: false,
        updateShipping: false
      }
    }

    static propTypes = {
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        ready: bool,
        status: string.isRequired,
        submitOrder: func.isRequired
    };

    render() {
        const { classes, ready, status, submitOrder, paymentMethod, availablePaymentMethods, shippingMethod, availableShippingMethods } = this.props;
        const text = ready ? 'Complete' : 'Click to fill out';
        const paymentText = paymentMethod ? paymentMethod : 'Click to fill out';
        const shippingText = shippingMethod ? shippingMethod : 'Click to fill out';

        let formContent;

        if (this.state.updatePayment) {
          formContent = (
                <Selector
                  options={availablePaymentMethods}
                  handleSelection={(code) => this.modifyBillingAddress(code)}
                >

                </Selector>
          );
        }

        else if (this.state.updateShipping) {
          formContent = (
              <Selector
                options={availableShippingMethods}
                handleSelection={(code) => this.modifyShippingMethod(code)}
              >

              </Selector>
          )
        }

        else {

        formContent = (
                <div className={classes.body}>
                    <Section
                        label="Ship To"
                        onClick={this.modifyShippingAddress}
                    >
                        <span>{text}</span>
                    </Section>
                    <Section
                        label="Pay With"
                        onClick={this.showBillingSelector}
                    >
                        <span>{paymentText}</span>
                    </Section>
                    <Section
                        label="Get It By"
                        onClick={this.showShippingSelector}
                    >
                        <span>{shippingText}</span>
                    </Section>
                </div>
        );
      }

      return (
        <div className={classes.root}>
          {formContent}
          <div className={classes.footer}>
              <SubmitButton
                  ready={ready}
                  status={status}
                  submitOrder={submitOrder}
              />
          </div>
        </div>
      )
    }

    modifyBillingAddress = (paymentMethod) => {
      this.props.enterSubflow('SUBMIT_PAYMENT_INFORMATION', paymentMethod)
      this.setState({
        updatePayment: false
      })
    };

    modifyShippingAddress = () => {
        this.props.enterSubflow('SUBMIT_SHIPPING_INFORMATION');
    };

    modifyShippingMethod = (shippingMethod) => {
        this.props.enterSubflow('SUBMIT_SHIPPING_METHOD', shippingMethod);
        this.setState({
          updateShipping: false
        })
    };

    showBillingSelector = () => {
      this.setState({
        updatePayment: true
      })
    }

    showShippingSelector = () => {
      this.setState({
        updateShipping: true
      })
    }
}

export default classify(defaultClasses)(Form);
