const supabase = require('../config/supabase');
const aiService = require('../services/ai.service');

const submitProposal = async (req, res, next) => {
  try {
    const { gig_id, cover_letter, bid_amount, delivery_days } = req.body;
    const freelancer_id = req.user.userId;

    // Check if gig is still open
    const { data: gig } = await supabase
      .from('gigs')
      .select('status')
      .eq('id', gig_id)
      .single();

    if (!gig || gig.status !== 'open') {
      return res.status(400).json({ status: 'error', message: 'Gig is no longer accepting proposals' });
    }

    // Check if user already submitted a proposal
    const { data: existingProposal } = await supabase
      .from('proposals')
      .select('id')
      .eq('gig_id', gig_id)
      .eq('freelancer_id', freelancer_id)
      .single();

    if (existingProposal) {
      return res.status(400).json({ status: 'error', message: 'You have already submitted a proposal for this gig' });
    }

    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert([{
        gig_id,
        freelancer_id,
        cover_letter,
        bid_amount: parseFloat(bid_amount),
        delivery_days: parseInt(delivery_days),
        status: 'pending',
        created_at: new Date()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      status: 'success',
      data: { proposal }
    });
  } catch (error) {
    next(error);
  }
};

const getProposalsByGig = async (req, res, next) => {
  try {
    const { gig_id } = req.params;
    const client_id = req.user.userId;

    // Fetch gig details for AI context
    const { data: gig } = await supabase
      .from('gigs')
      .select('*')
      .eq('id', gig_id)
      .eq('client_id', client_id)
      .single();

    if (!gig) {
      return res.status(403).json({ status: 'error', message: 'Forbidden or Gig not found' });
    }

    // Fetch proposals with freelancer info
    const { data: proposals, error } = await supabase
      .from('proposals')
      .select('*, freelancer:freelancer_id(full_name, bio, skills, avg_rating, avatar_url)')
      .eq('gig_id', gig_id);

    if (error) throw error;

    // Trigger AI Ranking if requested or if scores are missing
    const needsRanking = proposals.some(p => !p.ai_score);
    let rankedProposals = proposals;

    if (needsRanking && proposals.length > 0) {
      const rankings = await aiService.rankProposals(gig, proposals);
      
      // Update proposals with AI scores in DB (in the background or for this request)
      for (let i = 0; i < proposals.length; i++) {
        const ranking = rankings[i] || { score: 0, analysis: "AI failed to process" };
        proposals[i].ai_score = ranking.score;
        proposals[i].ai_analysis = ranking.analysis;

        // Perform async update to persist scores
        await supabase
          .from('proposals')
          .update({ ai_score: ranking.score, ai_analysis: ranking.analysis })
          .eq('id', proposals[i].id);
      }
    }

    // Sort by AI score descending
    rankedProposals.sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));

    res.json({
      status: 'success',
      results: rankedProposals.length,
      data: { proposals: rankedProposals }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitProposal, getProposalsByGig };
