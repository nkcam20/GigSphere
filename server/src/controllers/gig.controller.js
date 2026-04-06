const supabase = require('../config/supabase');

const postGig = async (req, res, next) => {
  try {
    const { title, description, skills_required, budget, deadline } = req.body;
    const client_id = req.user.userId;

    const { data: gig, error } = await supabase
      .from('gigs')
      .insert([{
        client_id,
        title,
        description,
        skills_required: Array.isArray(skills_required) ? skills_required : skills_required.split(',').map(s => s.trim()),
        budget: parseFloat(budget),
        deadline,
        status: 'open',
        created_at: new Date()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      status: 'success',
      data: { gig }
    });
  } catch (error) {
    next(error);
  }
};

const getGigs = async (req, res, next) => {
  try {
    const { skill, minBudget, maxBudget, sortBy = 'created_at', order = 'desc' } = req.query;

    let query = supabase
      .from('gigs')
      .select('*, client:client_id(full_name, avatar_url)')
      .eq('status', 'open');

    if (skill) {
      query = query.contains('skills_required', [skill]);
    }

    if (minBudget) {
      query = query.gte('budget', parseFloat(minBudget));
    }

    if (maxBudget) {
      query = query.lte('budget', parseFloat(maxBudget));
    }

    query = query.order(sortBy, { ascending: order === 'asc' });

    const { data: gigs, error } = await query;

    if (error) throw error;

    res.json({
      status: 'success',
      results: gigs.length,
      data: { gigs }
    });
  } catch (error) {
    next(error);
  }
};

const getGigById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: gig, error } = await supabase
      .from('gigs')
      .select('*, client:client_id(full_name, bio, avg_rating, avatar_url)')
      .eq('id', id)
      .single();

    if (error || !gig) {
      return res.status(404).json({ status: 'error', message: 'Gig not found' });
    }

    res.json({
      status: 'success',
      data: { gig }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { postGig, getGigs, getGigById };
