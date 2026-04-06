const supabase = require('../config/supabase');

const getProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, full_name, bio, skills, avatar_url, role, avg_rating, created_at')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Fetch reviews for this user
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*, reviewer:reviewer_id(full_name, avatar_url)')
      .eq('reviewee_id', id);

    res.json({
      status: 'success',
      data: { user, reviews }
    });
  } catch (error) {
    next(error);
  }
};

const postReview = async (req, res, next) => {
  try {
    const { contract_id, reviewee_id, rating, comment } = req.body;
    const reviewer_id = req.user.userId;

    // Verify contract completion
    const { data: contract, error } = await supabase
      .from('contracts')
      .select('id, status, client_id, freelancer_id')
      .eq('id', contract_id)
      .single();

    if (error || !contract || (contract.status !== 'completed')) {
      return res.status(400).json({ status: 'error', message: 'Review allowed only after contract completion' });
    }

    // Insert review
    const { data: review, error: rError } = await supabase
      .from('reviews')
      .insert([{
        contract_id,
        reviewer_id,
        reviewee_id,
        rating,
        comment,
        created_at: new Date()
      }])
      .select()
      .single();

    if (rError) throw rError;

    // Recalculate average rating for reviewee
    const { data: avgData } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', reviewee_id);

    const average = avgData.reduce((acc, curr) => acc + curr.rating, 0) / avgData.length;

    await supabase
      .from('users')
      .update({ avg_rating: average })
      .eq('id', reviewee_id);

    res.status(201).json({
      status: 'success',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

const getAdminStats = async (req, res, next) => {
  try {
    const { data: usersCount } = await supabase.from('users').select('id', { count: 'exact' });
    const { data: gigsCount } = await supabase.from('gigs').select('id', { count: 'exact' });
    const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'paid');

    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      status: 'success',
      data: {
        totalUsers: usersCount.length,
        totalGigs: gigsCount.length,
        totalRevenue: totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, postReview, getAdminStats };
