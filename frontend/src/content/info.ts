export const infoPages = {
  howToBuy: {
    title: 'How to buy',
    subline: 'From "ooh, nice" to "it’s mine" in four steps. No fees, no checkout — just people.',
    steps: [
      {
        step: 1,
        title: 'Browse & find',
        text: 'Search or wander the categories. Every item shows its condition, price, and the shop it belongs to.',
      },
      {
        step: 2,
        title: "Say you're interested",
        text: 'Tap "I’m interested" on the item. The seller gets a notification and you get a thread in your inbox.',
      },
      {
        step: 3,
        title: 'Agree on the details',
        text: "Chat about price, payment method, and whether it's pickup or shipping. Everything is between you two.",
      },
      {
        step: 4,
        title: 'Meet, pay, enjoy',
        text: 'Settle the payment however suits you both — cash on pickup or a bank transfer. ReDiCycle never touches the money.',
      },
    ],
    cta: {
      title: 'Found something you like?',
      description: 'The good stuff goes fast.',
      buttonLabel: 'Browse items',
      href: '/',
    },
  },
} as const;
