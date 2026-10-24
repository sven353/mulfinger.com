// Case studies: real engagements, anonymised. Confirmed accurate by Sven on 2026-10-16; lonely decision is one year (2026-10-24).
// Used by the homepage and /llms-full.txt so both always say the same thing.
export type CaseStudy = { n: string; title: string; proof: string; summary: string; context: string; dilemma: string; issue: string; resolution: string };

export const cases: CaseStudy[] = [
  {
    n: '01',
    title: 'The founder bottleneck',
    proof: '15 hours a week back, execution pace doubled',
    summary: 'Every decision bounced back to the founder. Clear boundaries for team decisions gave back 15 hours a week and doubled execution pace.',
    context: 'Scale-up CEO · Series B',
    dilemma: "Strategic execution was stalling. Every decision bounced back to the founder's desk, creating operational gridlock and executive burnout.",
    issue: 'The founder was delegating tasks while keeping unspoken veto rights on product nuance. The team protected itself by escalating decisions rather than owning the risk.',
    resolution: 'We codified explicit boundary conditions for autonomous team decisions and rebuilt the executive meeting cadence. The founder reclaimed 15 hours a week and execution pace doubled.',
  },
  {
    n: '02',
    title: 'Artificial alignment',
    proof: 'An explicit agreement on margin versus volume',
    summary: 'A team that agreed on Monday and split by Thursday. The cause was structural, and an explicit agreement on margin versus volume resolved it.',
    context: 'Industrial B2B · €80M ARR',
    dilemma: 'The executive team agreed unanimously in Monday meetings, yet commercial and operations were executing conflicting priorities by Thursday.',
    issue: 'Commercial incentives directly contradicted production capacity. The conflict was structural, while the team kept treating it as a clash of personalities.',
    resolution: 'We surfaced the unaddressed economic trade-offs in a facilitated session and replaced cosmetic harmony with an explicit operating agreement on margin versus volume.',
  },
  {
    n: '03',
    title: 'The lonely decision',
    proof: 'One year of independent sparring',
    summary: 'A founder facing a multi-market transition with nobody inside to challenge them. A year of independent sparring shaped a transition that protected culture and shareholder value.',
    context: 'Founder and chairman · International',
    dilemma: 'Facing a complex multi-market transition, the founder had nobody inside the organisation who could challenge their logic without an agenda of their own.',
    issue: "The leadership team was managing the founder's temperament instead of stress-testing the valuation models and governance trade-offs.",
    resolution: 'I acted as an independent, unvarnished sparring partner for a year, pressure-testing blind spots and structuring a transition that protected the company culture and shareholder value.',
  },
];
