const supabase = require('../config/supabase');

const sendMessage = async (req, res, next) => {
  try {
    const { contract_id, content } = req.body;
    const sender_id = req.user.userId;

    // Verify contract access
    const { data: contract, error } = await supabase
      .from('contracts')
      .select('id, client_id, freelancer_id')
      .eq('id', contract_id)
      .single();

    if (error || !contract || (contract.client_id !== sender_id && contract.freelancer_id !== sender_id)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden or contract not found' });
    }

    const { data: message, error: mError } = await supabase
      .from('messages')
      .insert([{
        contract_id,
        sender_id,
        content,
        sent_at: new Date()
      }])
      .select()
      .single();

    if (mError) throw mError;

    // Emit to socket room
    req.io.to(`contract_${contract_id}`).emit('new_message', message);

    res.status(201).json({
      status: 'success',
      data: { message }
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { contract_id } = req.params;
    const user_id = req.user.userId;

    // Verify contract access
    const { data: contract, error } = await supabase
      .from('contracts')
      .select('id, client_id, freelancer_id')
      .eq('id', contract_id)
      .single();

    if (error || !contract || (contract.client_id !== user_id && contract.freelancer_id !== user_id)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden or contract not found' });
    }

    const { data: messages, error: mError } = await supabase
      .from('messages')
      .select('*')
      .eq('contract_id', contract_id)
      .order('sent_at', { ascending: true });

    if (mError) throw mError;

    res.json({
      status: 'success',
      data: { messages }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getMessages };
