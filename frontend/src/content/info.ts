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

  howToSell: {
    title: 'How to sell',
    subline: 'Your shop is created the moment you register. Listing an item takes under a minute.',
    steps: [
      {
        step: 1,
        title: 'List your item',
        text: 'Add a photo, title, price, condition, and category. Honest photos sell faster than perfect ones.',
      },
      {
        step: 2,
        title: 'Wait for interest',
        text: 'Buyers tap "I’m interested" and land in your inbox. You reply when it suits you.',
      },
      {
        step: 3,
        title: 'Make the deal',
        text: 'Agree on payment and handover directly with the buyer. Drop the price anytime with the discount button.',
      },
      {
        step: 4,
        title: 'Mark it sold',
        text: 'Once it’s gone, mark the item as sold so nobody else asks. Relist it if the deal falls through.',
      },
    ],
    cta: {
      title: 'That drawer full of stuff you never use?',
      description: 'List it in under a minute.',
      buttonLabel: 'Sell something',
      href: '/items/new',
    },
  },

  safetyTips: {
    title: 'Safety tips',
    subline: 'ReDiCycle is built on trust — a few habits keep it that way.',
    steps: [
      {
        step: 1,
        title: 'Meet in public places',
        text: 'Cafés, train stations, campus — anywhere with people around. Bring a friend for bigger handovers.',
      },
      {
        step: 2,
        title: 'Check before you pay',
        text: 'Inspect the item at handover. Plug it in, try it on, flip through it — then pay.',
      },
      {
        step: 3,
        title: 'Keep chat on ReDiCycle',
        text: 'Agree on everything in your inbox thread, so there’s a record if something goes sideways.',
      },
      {
        step: 4,
        title: 'Trust your gut',
        text: 'Deal feels off? Price too good? Walk away and report the listing — no explanation needed.',
      },
    ],
    cta: {
      title: 'Questions we didn’t answer?',
      description: 'The FAQ covers the rest.',
      buttonLabel: 'Read the FAQ',
      href: '/faq',
    },
  },
} as const;
