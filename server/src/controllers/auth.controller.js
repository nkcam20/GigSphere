const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { email, password, full_name, role, bio, skills } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash,
        full_name,
        role,
        bio,
        skills: skills ? skills.split(',').map(s => s.trim()) : [],
        created_at: new Date()
      }])
      .select()
      .single();

    if (error) throw error;

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      status: 'success',
      data: {
        user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      status: 'success',
      data: {
        user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ status: 'error', message: 'No refresh token provided' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user.id, user.role);
    res.json({
      status: 'success',
      data: { accessToken: newAccessToken }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh };
