import Link from "next/link";

const features = [
  {
    title: "A calm place to write",
    body: "An almost empty surface and a preview that reads like a finished document. Nothing between you and the words."
  },
  {
    title: "Share with a link",
    body: "Send a private link and the document travels inside it. Public the moment you share, private by default."
  },
  {
    title: "Built for agents too",
    body: "Plain Markdown in, plain Markdown out. Your agents can read and write the same documents you do."
  }
];

export default function Landing() {
  return (
    <div className="landing">
      <section className="heroSection">
        <video className="heroVideo" autoPlay muted loop playsInline poster="/bg-poster.jpg">
          <source src="/bg.mp4" type="video/mp4" />
        </video>
        <div className="heroScrim" aria-hidden="true" />
        <header className="landingNav onDark">
          <span className="brand">
            <span className="brandMark" aria-hidden="true">
              P
            </span>
            <span className="brandName">
              passage<span className="brandExt">.md</span>
            </span>
          </span>
          <nav className="landingNavLinks">
            <a href="#pricing">Go Pro</a>
            <Link className="landingNavCta" href="/write">
              Start writing
            </Link>
          </nav>
        </header>
        <div className="heroInner">
          <h1 className="heroTitle">Minimalist writing for agents and humans</h1>
          <p className="heroSub">
            A calm, minimalist Markdown app. Think, write, and collaborate with your agents, all in your browser. Free to
            start.
          </p>
          <div className="heroActions">
            <Link className="btnPrimary" href="/write">
              Start writing
            </Link>
            <a className="btnGhost" href="#story">
              Read the story
            </a>
          </div>
        </div>
      </section>

      <main className="landingMain">
        <section className="story" id="story">
          <h2 className="sectionTitle">Why passage exists</h2>
          <div className="storyBody">
            <p>I tried every writing app, and none of them fit.</p>
            <p>
              I wanted one place to write. In the browser, on my laptop or my phone, with nothing to install. And I
              wanted my agents to reach the same documents I was working on, without copying files around or syncing a
              repo just to share a paragraph.
            </p>
            <p>
              Local files were the worst of both worlds: great for me, invisible to my agents. So I leaned on GitHub, and
              on syncing, and on a pile of Markdown tools that each did a little and got in the way a lot. I was managing
              my tools instead of writing.
            </p>
            <p>
              So I stripped it all back. One URL. Beautiful Markdown. Write it, share it, and let your agents read and
              edit it too. Private by default, public the moment you send the link.
            </p>
            <p className="storyClose">That is all passage is, and nothing else.</p>
          </div>
        </section>

        <section className="features">
          {features.map((feature) => (
            <div className="featureCard" key={feature.title}>
              <h3 className="featureTitle">{feature.title}</h3>
              <p className="featureBody">{feature.body}</p>
            </div>
          ))}
        </section>

        <section className="pricing" id="pricing">
          <h2 className="sectionTitle">Simple pricing</h2>
          <div className="pricingGrid">
            <div className="planCard">
              <p className="planName">Free</p>
              <p className="planPrice">
                $0<span className="planPer"> forever</span>
              </p>
              <ul className="planList">
                <li>Write, preview, and export Markdown</li>
                <li>Mermaid diagrams</li>
                <li>Drafts saved in your browser</li>
                <li>Share read-only links</li>
              </ul>
              <Link className="btnPrimary planCta" href="/write">
                Start writing
              </Link>
            </div>
            <div className="planCard planCardPro">
              <p className="planName">
                Pro<span className="planTag">Coming soon</span>
              </p>
              <p className="planPrice">
                $5<span className="planPer"> / month</span>
              </p>
              <ul className="planList">
                <li>Everything in Free</li>
                <li>Saved and synced documents</li>
                <li>Manage and revoke shares</li>
                <li>CLI and API for agents</li>
                <li>Dark mode</li>
              </ul>
              <span className="btnGhost planCta planCtaDisabled">Coming soon</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="landingFooter">
        <span className="brand">
          <span className="brandMark" aria-hidden="true">
            P
          </span>
          <span className="brandName">
            passage<span className="brandExt">.md</span>
          </span>
        </span>
        <span className="footerTag">A Markdown notepad for agents and humans.</span>
      </footer>
    </div>
  );
}
