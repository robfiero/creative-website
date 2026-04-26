import HeadshotBlock from '../components/HeadshotBlock'

function AboutPage() {
  return (
    <section className="about-page" aria-labelledby="about-heading">
      <header className="about-page__header">
        <p className="section-eyebrow">About</p>
        <h1 id="about-heading">Rob Fiero Creative</h1>
      </header>

      <div className="about-page__layout">
        <p className="about-page__lead">
          Sometimes the most interesting version of a place isn’t how it looks — but how it could
          have looked.
        </p>

        <div className="about-page__body">
          <HeadshotBlock className="headshot about-page__portrait" />

          <p>
            I’ve always had an appreciation for art, across styles, mediums, and settings, from
            museums and galleries to the unexpected places you encounter it in everyday life. While
            I don’t have formal training, I’ve always enjoyed taking pictures for the pleasure of
            revisiting that moment at a later time.
          </p>

          <p>
            As cameras have become more accessible, I’ve found myself taking more photos, trying to
            capture moments where the light, setting, or subject feels just right. These images
            often show up in my memories, causing me to pause and reflect on that day in the past.
            Some images also bring a sense of nostalgia - sometimes even prompting a simple
            question: what might this scene have looked like in another time?
          </p>

          <p>
            Recently, I began experimenting with my photos, reimagining them through different
            styles, perspectives, and eras. Sometimes that means simplifying a scene to focus on a
            single element. Other times, it means removing distractions or envisioning a location as
            it may have appeared in its prime. The goal is not perfect realism, but a thoughtful
            interpretation - one that highlights what drew me to the scene in the first place.
            Overall, I'm working to highlight and celebrate our daily surroundings in a new way.
          </p>

          <p>
            This project has become a creative outlet during a period of transition for me, and a
            way to reconnect with something I’ve always enjoyed. I hope you find something here that
            resonates, whether it’s a place you recognize, a mood you remember, or simply a
            different way of seeing the everyday.
          </p>

          <p>
            If you’d like to learn more about my professional work and other projects, please visit{' '}
            <a href="https://robfiero.net" target="_blank" rel="noreferrer">
              robfiero.net
            </a>
            . I’d love to hear your thoughts or feedback. Reach out at rob_fiero@yahoo.com.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutPage
