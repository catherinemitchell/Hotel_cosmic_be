const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

module.exports = ({}) => {
  return {
    
    chargeCustomer: async (amount, currency, paymentMethod) => {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          automatic_payment_methods: {enabled: true},
          payment_method: paymentMethod?.id,
          confirm: false,
        });
        return paymentIntent.client_secret;
      } catch (error) {
        throw new Error('Payment intent error : ' + error.message);
      } 
    },
  };
};

