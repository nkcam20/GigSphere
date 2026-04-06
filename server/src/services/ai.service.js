const Anthropic = require('@anthropic-ai/sdk');
const dotenv = require('dotenv');

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

/**
 * Ranks freelancer proposals based on gig requirements
 * @param {Object} gig - The gig details (requirements, description, skills)
 * @param {Array} proposals - List of proposals to rank
 * @returns {Array} List of proposals with AI scores and analysis
 */
const rankProposals = async (gig, proposals) => {
  try {
    const prompt = `
      You are an expert technical recruiter matching freelancers to gigs.
      Gig Title: ${gig.title}
      Gig Description: ${gig.description}
      Required Skills: ${gig.skills_required.join(', ')}
      Budget: $${gig.budget}

      Below are the proposals from freelancers. Rank them based on:
      1. Skill Fit (matching required skills)
      2. Value (bid amount vs quality of cover letter)
      3. Communication (clarity of the cover letter)

      Proposals:
      ${proposals.map((p, index) => `
        --- Proposal #${index} ---
        Freelancer Skills: ${p.freelancer.skills.join(', ')}
        Freelancer Bio: ${p.freelancer.bio}
        Bid Amount: $${p.bid_amount}
        Delivery Days: ${p.delivery_days}
        Cover Letter: ${p.cover_letter}
      `).join('\n')}

      Return a JSON array of objects, one for each proposal in the order they were provided.
      Each object must contain:
      - score: A number from 0 to 100
      - analysis: A short summary (max 2 sentences) justifying the score.

      Example response: [{"score": 85, "analysis": "Strong skill match but bid is slightly above budget."}, ...]
    `;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2000,
      temperature: 0,
      system: "You are a professional recruiting assistant. Always return valid JSON only.",
      messages: [{ role: 'user', content: prompt }],
    });

    const aiResponse = JSON.parse(message.content[0].text);
    return aiResponse;
  } catch (error) {
    console.error('Claude API Error:', error);
    // Return default scores if AI fails to avoid breaking the flow
    return proposals.map(() => ({ score: 50, analysis: "AI ranking unavailable at this moment." }));
  }
};

module.exports = { rankProposals };
