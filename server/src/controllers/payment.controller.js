const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../config/supabase');

const createCheckoutSession = async (req, res, next) => {
  try {
    const { contract_id } = req.body;
    const client_id = req.user.userId;

    // Fetch contract details
    const { data: contract, error } = await supabase
      .from('contracts')
      .select('*, gig:gig_id(title)')
      .eq('id', contract_id)
      .eq('client_id', client_id)
      .single();

    if (error || !contract) {
      return res.status(404).json({ status: 'error', message: 'Contract not found or unauthorized' });
    }

    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `GigSphere: ${contract.gig.title}`,
            description: `Payment for Freelance Services - Contract #${contract_id}`,
          },
          unit_amount: Math.round(contract.amount * 100), // Stripe works in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard/contracts/${contract_id}?status=paid`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/contracts/${contract_id}?status=cancelled`,
      metadata: {
        contract_id: contract_id,
        client_id: client_id,
        freelancer_id: contract.freelancer_id
      }
    });

    // Create a pending payment record
    await supabase
      .from('payments')
      .insert([{
        contract_id,
        stripe_session_id: session.id,
        amount: contract.amount,
        status: 'pending',
        created_at: new Date()
      }]);

    res.json({
      status: 'success',
      data: { url: session.url }
    });
  } catch (error) {
    next(error);
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle fulfillment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const contract_id = session.metadata.contract_id;

    // Update payment record
    await supabase
      .from('payments')
      .update({ status: 'held', paid_at: new Date() })
      .eq('stripe_session_id', session.id);

    // Update contract status if needed (e.g., mark as 'funded')
    // await supabase.from('contracts').update({ funded: true }).eq('id', contract_id);
  }

  res.json({ received: true });
};

const deliverWork = async (req, res, next) => {
  try {
    const { contract_id } = req.params;
    const freelancer_id = req.user.userId;

    const { data: contract, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contract_id)
      .eq('freelancer_id', freelancer_id)
      .single();

    if (error || !contract) {
      return res.status(404).json({ status: 'error', message: 'Contract not found' });
    }

    await supabase
      .from('contracts')
      .update({ status: 'delivered' })
      .eq('id', contract_id);

    res.json({ status: 'success', message: 'Work marked as delivered' });
  } catch (error) {
    next(error);
  }
};

const approveDelivery = async (req, res, next) => {
  try {
    const { contract_id } = req.params;
    const client_id = req.user.userId;

    const { data: contract, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contract_id)
      .eq('client_id', client_id)
      .single();

    if (error || !contract) {
      return res.status(404).json({ status: 'error', message: 'Contract not found' });
    }

    // Mark contract and gig as completed
    await supabase
      .from('contracts')
      .update({ status: 'completed' })
      .eq('id', contract_id);

    await supabase
      .from('gigs')
      .update({ status: 'completed' })
      .eq('id', contract.gig_id);

    // Update payment to paid (escrow release simulation)
    await supabase
      .from('payments')
      .update({ status: 'paid' })
      .eq('contract_id', contract_id);

    res.json({ status: 'success', message: 'Delivery approved and funds released' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCheckoutSession, stripeWebhook, deliverWork, approveDelivery };
