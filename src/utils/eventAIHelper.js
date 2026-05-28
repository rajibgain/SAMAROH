// AI Event Planning Helper Functions

export async function getAISuggestions({ action, message, event, stats, expenses = [], tasks = [], guests = [] }) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  switch (action) {
    case 'budget':
      return generateBudgetAdvice(event, expenses, stats);
    case 'tasks':
      return generateTaskIdeas(event);
    case 'decoration':
      return generateDecorationIdeas(event);
    case 'guests':
      return generateGuestAdvice(event, guests, stats);
    case 'timeline':
      return generateTimelineAdvice(event);
    case 'menu':
      return generateMenuIdeas(event, guests);
    default:
      return generateGeneralAdvice(message, event, stats);
  }
}

function generateBudgetAdvice(event, expenses, stats) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const guestCount = stats?.totalGuests || 50;
  const perHeadBudget = guestCount > 0 ? totalExpenses / guestCount : 0;

  const advice = [
    `💰 **Budget Analysis**\n\n`,
    `• Total Expenses: ₹${totalExpenses.toFixed(2)}\n`,
    `• Guest Count: ${guestCount}\n`,
    `• Per Head Cost: ₹${perHeadBudget.toFixed(2)}\n\n`,
    `**Smart Recommendations:**\n`,
    `✓ Focus on these high-impact areas:\n`,
    `  - Venue & Catering (40% of budget)\n`,
    `  - Decorations (25% of budget)\n`,
    `  - Entertainment (20% of budget)\n`,
    `  - Contingency (15% of budget)\n\n`,
    `💡 **Cost Optimization Tips:**\n`,
    `• Book vendors during off-peak seasons\n`,
    `• Negotiate group discounts\n`,
    `• Use digital decorations with lights\n`,
    `• Plan menu with seasonal items\n`,
    `• Consolidate vendor requirements`
  ];

  return advice.join('');
}

function generateTaskIdeas(event) {
  const eventType = event.eventType?.toLowerCase() || 'general';
  
  const taskIdeas = {
    'wedding': [
      '💍 **Wedding Planning Tasks:**\n\n',
      '📋 **Pre-Wedding (3 months before):**',
      '• Book venue and catering\n',
      '• Hire photographer/videographer\n',
      '• Book makeup artist and hairdresser\n',
      '• Order invitations\n',
      '• Plan honeymoon\n\n',
      '📋 **2 Months Before:**',
      '• Send invitations\n',
      '• Shop for wedding attire\n',
      '• Arrange accommodation\n',
      '• Finalize guest list\n',
      '• Book transportation\n\n',
      '📋 **1 Month Before:**',
      '• Confirm vendor bookings\n',
      '• Plan decoration details\n',
      '• Arrange rehearsal dinner\n',
      '• Prepare wedding favors\n\n',
      '📋 **1 Week Before:**',
      '• Final headcount confirmation\n',
      '• Seating arrangement finalization\n',
      '• Last-minute decoration setup\n',
      '• Prepare emergency kits'
    ],
    'birthday': [
      '🎂 **Birthday Party Tasks:**\n\n',
      '• Send invitations (3 weeks before)\n',
      '• Book venue\n',
      '• Plan menu and cake\n',
      '• Buy decorations\n',
      '• Arrange games/entertainment\n',
      '• Create playlist\n',
      '• Prepare gift list\n',
      '• Set up photo booth area'
    ],
    'anniversary': [
      '💕 **Anniversary Celebration Tasks:**\n\n',
      '• Decide venue and date\n',
      '• Create guest list\n',
      '• Book catering\n',
      '• Plan special performances\n',
      '• Arrange flowers/decorations\n',
      '• Prepare speech/toast\n',
      '• Organize photo/video team\n',
      '• Plan surprise elements'
    ]
  };

  const ideas = taskIdeas[eventType] || taskIdeas['birthday'];
  return ideas.join('');
}

function generateDecorationIdeas(event) {
  const eventType = event.eventType?.toLowerCase() || 'general';
  
  const ideas = [
    `🎨 **Decoration Ideas for ${event.eventType || 'Your Event'}**\n\n`,
    `**Color Schemes:**\n`,
    `• Pastel theme: Soft pink, cream, mint green\n`,
    `• Bold theme: Deep purple, gold, black\n`,
    `• Rustic theme: Warm brown, cream, sage green\n`,
    `• Modern theme: White, silver, blue\n\n`,
    `**Key Decoration Elements:**\n`,
    `🏮 Entrance decoration\n`,
    `✨ String lights and fairy lights\n`,
    `🌸 Fresh flowers arrangement\n`,
    `🎈 Balloon arches and clusters\n`,
    `📸 Photo backdrops\n`,
    `🕯️ Candles and centerpieces\n`,
    `🌿 Greenery and plants\n`,
    `🎀 Ribbons and drapes\n\n`,
    `**Pro Tips:**\n`,
    `• Use 3-5 colors max for cohesion\n`,
    `• Layer decorations (high, medium, low)\n`,
    `• Focus on focal points\n`,
    `• Balance symmetry\n`,
    `• Consider natural lighting`
  ];

  return ideas.join('');
}

function generateGuestAdvice(event, guests, stats) {
  const confirmed = stats?.confirmedGuests || 0;
  const total = stats?.totalGuests || 50;
  const confirmationRate = total > 0 ? ((confirmed / total) * 100).toFixed(1) : 0;

  const advice = [
    `👥 **Guest Management Strategy**\n\n`,
    `**Current Status:**\n`,
    `• Total Invitations: ${total}\n`,
    `• Confirmed: ${confirmed} (${confirmationRate}%)\n`,
    `• Pending Response: ${total - confirmed}\n\n`,
    `**Tips to Boost Confirmations:**\n`,
    `1. Send reminder after 1 week\n`,
    `2. Call undecided guests personally\n`,
    `3. Make it easy to RSVP (online form)\n`,
    `4. Offer incentives for early response\n`,
    `5. Create FOMO with activities list\n\n`,
    `**For Confirmed Guests:**\n`,
    `• Send event details\n`,
    `• Share dress code\n`,
    `• Provide parking information\n`,
    `• Update on schedule changes\n`,
    `• Send day-before reminder\n\n`,
    `**VIP Guest Handling:**\n`,
    `• Personal invitation call\n`,
    `• Special seating arrangement\n`,
    `• Welcome gifts\n`,
    `• Special mention in speech`
  ];

  return advice.join('');
}

function generateTimelineAdvice(event) {
  const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));

  const advice = [
    `📅 **Event Planning Timeline**\n\n`,
    `**Days Until Event: ${daysUntil}**\n\n`,
  ];

  if (daysUntil > 90) {
    advice.push(
      `**3+ Months Before:**\n`,
      `□ Book all major vendors\n`,
      `□ Finalize event concept\n`,
      `□ Start guest list\n`,
      `□ Set budget\n`,
      `□ Plan decoration theme\n\n`
    );
  }
  if (daysUntil > 60) {
    advice.push(
      `**2 Months Before:**\n`,
      `□ Send invitations\n`,
      `□ Finalize menu\n`,
      `□ Book remaining vendors\n`,
      `□ Plan activities/entertainment\n\n`
    );
  }
  if (daysUntil > 30) {
    advice.push(
      `**1 Month Before:**\n`,
      `□ Track RSVPs\n`,
      `□ Confirm vendor details\n`,
      `□ Plan seating arrangement\n`,
      `□ Order special items\n\n`
    );
  }

  advice.push(
    `**1-2 Weeks Before:**\n`,
    `□ Final headcount\n`,
    `□ Confirm all bookings\n`,
    `□ Prepare checklist\n`,
    `□ Brief team members\n\n`,
    `**Day Before:**\n`,
    `□ Final confirmations\n`,
    `□ Prepare emergency kit\n`,
    `□ Test sound/lights\n`,
    `□ Brief all helpers`
  );

  return advice.join('');
}

function generateMenuIdeas(event, guests) {
  const guestCount = guests?.length || 50;

  const menus = [
    `🍽️ **Menu Planning for ${guestCount} Guests**\n\n`,
    `**Appetizers:**\n`,
    `• Spring rolls (vegetarian & non-veg)\n`,
    `• Paneer tikka\n`,
    `• Samosas with chutneys\n`,
    `• Cheese & crackers\n`,
    `• Bruschetta\n\n`,
    `**Main Courses:**\n`,
    `🍚 **Rice Dishes:**`,
    `• Biryani\n`,
    `• Pulao\n`,
    `• Fried rice varieties\n\n`,
    `🍝 **Curries:**`,
    `• Paneer butter masala\n`,
    `• Chicken curry\n`,
    `• Dal varieties\n\n`,
    `🥘 **Bread:**`,
    `• Naan, roti, paratha\n`,
    `• Butter naan\n`,
    `• Garlic naan\n\n`,
    `**Desserts:**\n`,
    `• Gulab jamun\n`,
    `• Ice cream\n`,
    `• Kheer\n`,
    `• Pastries\n\n`,
    `**Beverages:**\n`,
    `• Mocktails\n`,
    `• Fresh juices\n`,
    `• Coffee & tea\n\n`,
    `**Dietary Considerations:**\n`,
    `✓ Always have vegan options\n`,
    `✓ Gluten-free options\n`,
    `✓ Nut allergies\n`,
    `✓ Religious preferences\n`,
    `✓ Health conditions`
  ];

  return menus.join('');
}

function generateGeneralAdvice(message, event, stats) {
  const eventName = event?.eventName || 'your event';
  const eventType = event?.eventType || 'celebration';

  return `
🎉 **Advice for ${eventName}**

Thank you for your question! Here's my general advice:

**Key Focus Areas:**
1. **Planning** - Start early and set milestones
2. **Communication** - Keep everyone informed
3. **Budget** - Track all expenses carefully
4. **Timeline** - Create a detailed schedule
5. **Backup Plans** - Always have contingencies

**Quick Tips:**
• Break big tasks into smaller ones
• Delegate responsibilities clearly
• Use checklists religiously
• Have emergency contact list ready
• Take photos throughout the event

Would you like specific help with:
• Budget planning and cost optimization?
• Task ideas and assignment strategies?
• Decoration and theme concepts?
• Guest management tips?
• Timeline and schedule planning?
• Menu and catering ideas?

Just ask! I'm here to make your ${eventType} stress-free and memorable! 🎊
  `;
}

// Generate smart ideas based on event context
export function generateSmartIdeas(event, context = 'general') {
  const ideas = {
    vendors: generateVendorIdeas(event),
    decoration: generateDecorationIdeas(event),
    timeline: generateTimelineAdvice(event),
    bugdet: generateBudgetAdvice(event, [], {}),
    tasks: generateTaskIdeas(event)
  };

  return ideas[context] || ideas.general;
}

function generateVendorIdeas(event) {
  return [
    { type: 'Catering', avgCost: '500-1000/head', vendors: ['Local caterers', 'Hotel services', 'Cloud kitchens'] },
    { type: 'Venue', avgCost: '5000-50000', vendors: ['Banquet halls', 'Gardens', 'Hotels', 'Community centers'] },
    { type: 'Photography', avgCost: '5000-15000', vendors: ['Professional studios', 'Freelancers', 'Hybrid'] },
    { type: 'Decoration', avgCost: '2000-10000', vendors: ['Local decorators', 'Online services', 'DIY options'] },
    { type: 'Entertainment', avgCost: '3000-20000', vendors: ['DJs', 'Musicians', 'Performers'] },
    { type: 'Flowers', avgCost: '1000-5000', vendors: ['Local florists', 'Online flower shops'] }
  ];
}

// Calculate smart recommendations based on data
export function getSmartRecommendations(event, stats, expenses) {
  const recommendations = [];

  // Budget recommendations
  if (expenses.length > 0) {
    const avg = expenses.reduce((sum, e) => sum + (e.amount || 0), 0) / expenses.length;
    recommendations.push({
      type: 'budget',
      title: 'Average Expense Tracking',
      message: `Your average expense is ₹${avg.toFixed(2)}. Monitor unusual spikes.`
    });
  }

  // Guest recommendations
  if (stats?.totalGuests > 0 && stats?.confirmedGuests / stats?.totalGuests < 0.5) {
    recommendations.push({
      type: 'guests',
      title: 'Low RSVP Rate',
      message: 'Send follow-up reminders to pending guests for better confirmation.'
    });
  }

  // Task recommendations
  if (stats?.pendingTasks > stats?.completedTasks) {
    recommendations.push({
      type: 'tasks',
      title: 'Task Backlog Alert',
      message: 'You have more pending tasks. Accelerate completion or redistribute work.'
    });
  }

  return recommendations;
}
