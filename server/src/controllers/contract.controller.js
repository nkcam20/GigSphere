const supabase = require('../config/supabase');

const hireFreelancer = async (req, res, next) => {
  try {
    const { proposal_id } = req.body;
    const client_id = req.user.userId;

    // Fetch proposal details
    const { data: proposal, error: pError } = await supabase
      .from('proposals')
      .select('*, gig:gig_id(*)')
      .eq('id', proposal_id)
      .single();

    if (pError || !proposal) throw new Error('Proposal not found');
    if (proposal.gig.client_id !== client_id) throw new Error('Unauthorized hire');
    if (proposal.gig.status !== 'open') throw new Error('Gig is no longer open');

    // Start a transaction-like sequence (Supabase Rpc or ordered calls)
    // 1. Create Contract
    const { data: contract, error: cError } = await supabase
      .from('contracts')
      .insert([{
        gig_id: proposal.gig_id,
        client_id,
        freelancer_id: proposal.freelancer_id,
        amount: proposal.bid_amount,
        status: 'active',
        created_at: new Date()
      }])
      .select()
      .single();

    if (cError) throw cError;

    // 2. Update Gig Status
    await supabase
      .from('gigs')
      .update({ status: 'in-progress' })
      .eq('id', proposal.gig_id);

    // 3. Update Proposals Status
    await supabase
      .from('proposals')
      .update({ status: 'accepted' })
      .eq('id', proposal_id);

    await supabase
      .from('proposals')
      .update({ status: 'rejected' })
      .eq('gig_id', proposal.gig_id)
      .neq('id', proposal_id);

    res.status(201).json({
      status: 'success',
      data: { contract }
    });
  } catch (error) {
    next(error);
  }
};

const getContracts = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { role } = req.user;

    let query = supabase
      .from('contracts')
      .select('*, gig:gig_id(*), client:client_id(full_name), freelancer:freelancer_id(full_name)');

    if (role === 'client') {
      query = query.eq('client_id', user_id);
    } else {
      query = query.eq('freelancer_id', user_id);
    }

    const { data: contracts, error } = await query;

    if (error) throw error;

    res.json({
      status: 'success',
      data: { contracts }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { hireFreelancer, getContracts };
