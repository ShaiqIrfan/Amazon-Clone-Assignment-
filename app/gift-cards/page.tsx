const options = [{ amount: '₨ 1,000', note: 'A thoughtful little thank-you.' }, { amount: '₨ 2,500', note: 'A flexible choice for everyday finds.' }, { amount: '₨ 5,000', note: 'A larger gift for a special occasion.' }]

export default function GiftCardsPage() {
  return <div className="container page">
    <p className="eyebrow">Demo gifting</p><h1 className="page-title">Gift Cards</h1><p className="page-subtitle">Share the joy of browsing NexCart. Gift-card purchase and redemption are not enabled in this demo.</p>
    <div className="gift-grid section">{options.map((option) => <article key={option.amount} className="gift-card"><span>DEMO GIFT CARD</span><strong>{option.amount}</strong><p>{option.note}</p><button className="button-secondary" type="button">Coming soon</button></article>)}</div>
  </div>
}
