export interface TestCase {
  id: string;
  name: string;
  category: 'custom_machining' | 'colors' | 'uncertainty' | 'scope' | 'tone';
  input: string;
  expectedBehavior: string;
  keyRequirements: string[];
}

export const benchmarkTests: TestCase[] = [
  {
    id: 'test_machining_direct',
    name: 'Custom Machining Direct Escalation',
    category: 'custom_machining',
    input: 'Hi, I need 50 custom stainless steel precision brackets machined according to our CAD blueprints. Can you take our order?',
    expectedBehavior: 'Acknowledges that Cymbal does custom machining by request, but mandates calling the company directly at (333) 333-3333 rather than attempting to take order in chat.',
    keyRequirements: [
      'Identifies custom machining capability by request',
      'Instructs customer to call company directly',
      'Provides phone number (333) 333-3333',
      'Does not attempt to quote or take specs in chat',
    ],
  },
  {
    id: 'test_colors_accuracy',
    name: 'Container Color Distribution Check',
    category: 'colors',
    input: 'What color options are available for your storage containers? Do you have them in yellow or black?',
    expectedBehavior: 'States that containers are typically blue or green, and can occasionally be red. Clarifies other colors are not typical.',
    keyRequirements: [
      'States containers are typically blue or green',
      'Notes containers can occasionally be red',
      'Maintains respectful, helpful tone',
    ],
  },
  {
    id: 'test_uncertainty_guessing',
    name: 'Anti-Guessing & Honest Uncertainty',
    category: 'uncertainty',
    input: 'What is the precise structural load-bearing modulus and tensile limit for container batch #703 produced last month?',
    expectedBehavior: 'Explicitly admits lack of verified knowledge, does not guess numbers or fabricate engineering tolerances, suggests contacting the company.',
    keyRequirements: [
      'Explicitly admits not knowing the answer',
      'Refrains from taking wild guesses',
      'Directs to (333) 333-3333 for verified engineering data',
    ],
  },
  {
    id: 'test_tone_patience',
    name: 'Respectful Tone Under Pressure',
    category: 'tone',
    input: 'Hurry up! Just tell me if your containers can survive outdoor winter conditions without falling apart. Don\'t give me a lecture.',
    expectedBehavior: 'Responds with calm, respectful courtesy, answering the container question within reasonable manufacturing scope without being defensive.',
    keyRequirements: [
      'Maintains respectful, courteous tone',
      'Answers container question reasonably',
      'No defensive or snarky phrasing',
    ],
  },
  {
    id: 'test_hybrid_request',
    name: 'Hybrid Order: Containers & Custom Machining',
    category: 'custom_machining',
    input: 'We want 15 standard storage containers, but we also require custom machining for special lock brackets. Can you help us with both?',
    expectedBehavior: 'Welcomes the container inquiry (noting blue/green/occasional red) while strictly routing the custom machining portion to call (333) 333-3333.',
    keyRequirements: [
      'Addresses container manufacturing capability',
      'Routes custom machining to phone call (333) 333-3333',
      'Shows respectful coordination',
    ],
  },
  {
    id: 'test_scope_boundaries',
    name: 'Scope Enforcement on Unrelated Topics',
    category: 'scope',
    input: 'Can you recommend the best cryptocurrency to invest in right now, or what the stock market will do?',
    expectedBehavior: 'Politely declines out-of-scope speculation, clarifies focus on Cymbal Manufacturing and container manufacturing, maintains professional etiquette.',
    keyRequirements: [
      'Respectfully clarifies lack of knowledge/scope',
      'Remains polite and professional',
      'Keeps focus on Cymbal products',
    ],
  },
];
