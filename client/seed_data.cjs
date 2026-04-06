const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gemtybauqogpfwgfwqfc.supabase.co';
const supabaseKey = 'sb_publishable_k07MH0eNBackC5MmGyzVZA_dn4KM97O';
const supabase = createClient(supabaseUrl, supabaseKey);

const gigs = [
  {
    client_id: 'ff26096e-f8da-49b7-b967-b7dd8f0bdcd3',
    title: 'Architecting a Military-Grade Neural Network',
    description: 'Searching for an elite AI engineer to design a high-precision object detection system for specialized hardware. Must have experience with YOLOv8 and TensorRT optimization.',
    category: 'AI Development',
    budget: 4500,
    status: 'open',
    requirements: ['PyTorch', 'C++', 'Computer Vision']
  },
  {
    client_id: 'ff26096e-f8da-49b7-b967-b7dd8f0bdcd3',
    title: 'Enterprise LLM Fine-Tuning for Finance',
    description: 'Build a custom fine-tuned Llama-3 model for analyzing high-frequency financial reports. Security and data privacy are paramount.',
    category: 'AI Development',
    budget: 3200,
    status: 'open',
    requirements: ['HuggingFace', 'Python', 'Financial Analysis']
  },
  {
    client_id: 'ff26096e-f8da-49b7-b967-b7dd8f0bdcd3',
    title: 'Prompt Architecture for Autonomous Sales Agents',
    description: 'Design a complex chain-of-thought prompt system for an autonomous sales agent that handles multi-stage negotiations.',
    category: 'Prompt Engineering',
    budget: 1200,
    status: 'open',
    requirements: ['ChatGPT-4', 'LangChain', 'Strategy']
  },
  {
    client_id: 'ff26096e-f8da-49b7-b967-b7dd8f0bdcd3',
    title: 'Generative AI Specialist for Luxury Fashion',
    description: 'Creating a suite of generative art tools for a luxury fashion house to generate seasonal lookbooks. Stable Diffusion mastery required.',
    category: 'Creative',
    budget: 2800,
    status: 'open',
    requirements: ['Stable Diffusion', 'LoRA Training', 'Photoshop']
  },
  {
    client_id: 'ff26096e-f8da-49b7-b967-b7dd8f0bdcd3',
    title: 'AI Strategy for Silicon Valley Startup',
    description: 'We need a senior consultant to map out our AI roadmap for the next 18 months. Must have been a founder or senior lead at an AI lab.',
    category: 'Elite Consulting',
    budget: 5000,
    status: 'open',
    requirements: ['Leadership', 'MLOps', 'Market Strategy']
  }
];

async function seed() {
  console.log('Starting seed operations...');
  try {
    const { data, error } = await supabase.from('gigs').insert(gigs).select();
    if (error) {
      console.error('Seed Error:', error.message);
    } else {
      console.log('Seed Successful!');
      console.log('Inserted Gigs:', data.map(g => g.title));
      process.exit(0);
    }
  } catch (err) {
    console.error('Unexpected Error:', err.message);
    process.exit(1);
  }
}

seed();
