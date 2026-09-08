import { useEffect, useRef, useState } from 'react'
import Iridescence from './Iridescence'
import BorderGlow from './BorderGlow'

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
const routeHref = (path) => `${basePath}${path}` || '/'
const routeFromLocation = () => {
  const pathname = window.location.pathname
  if (!basePath) return pathname
  if (pathname === basePath || pathname === `${basePath}/`) return '/'
  return pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname
}

const projects = [
  { slug: 'got-some-coffee', id: '01', title: '整点咖啡 / GOT SOME COFFEE', type: '品牌视觉设计 · VI 系统', image: '/assets/coffee/cup.webp', year: '2026' },
  { slug: 'baize', id: '02', title: '白泽 / BAIZE', type: '祥瑞神兽 · IP 形象设计', image: '/assets/baize/cover-complete.webp', year: '2026' },
  { slug: 'shadow-puppet', id: '03', title: '光影千年 / SHADOW PUPPET', type: '非遗文化 · 皮影 IP 形象设计', image: '/assets/shadow/cover.webp', year: '2026' },
  { slug: 'beihai-animation', id: '04', title: '潮起疍风华 / A DAN', type: '科普动画 · 疍家文化 IP', image: '/assets/beihai/cover-clear.webp', year: '2026' },
  { slug: 'tea-life', id: '05', title: '一片茶，见一生 / A LEAF OF TEA', type: 'AIGC 动画 · 瑶族油茶非遗', image: '/assets/chajian/cover-wide.webp', year: '2026' },
  { slug: 'small-ranch', id: '06', title: '小小牧场 / SMALL RANCH', type: 'Unity 2D · 像素经营游戏', image: '/assets/farm/cover.webp', year: '2026' },
]

const capabilities = ['视觉系统', '3D 与动态', 'AI 协同创作', '视觉研究与叙事']
const awards = [
  ['2026', '第十四届未来设计师国赛一等奖'],
  ['2026', '第十四届未来设计师广西赛区一等奖'],
  ['2024', '广西师范大学研究生新生二等奖学金'],
  ['2022', '广西壮族自治区大广赛入围奖'],
]

function Arrow() { return <span aria-hidden="true" className="arrow">↗</span> }

function useRoute() {
  const [path, setPath] = useState(routeFromLocation)
  useEffect(() => {
    const onPop = () => setPath(routeFromLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const navigate = (to) => {
    window.history.pushState({}, '', routeHref(to))
    setPath(to)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  return [path, navigate]
}

function Navigation({ detail = false, navigate, scrolled }) {
  const goToWork = (event) => {
    event.preventDefault()
    navigate('/')
    setTimeout(() => document.querySelector('#work')?.scrollIntoView(), 20)
  }
  return <nav className={scrolled || detail ? 'nav nav--solid' : 'nav'} aria-label="主导航">
    <a href={routeHref('/')} onClick={(e) => { e.preventDefault(); navigate('/') }} className="monogram">SHJ<span>®</span></a>
    <div className="nav-links">
      {detail ? <a href={`${routeHref('/')}#work`} onClick={goToWork}>返回目录</a> : <><a href="#about">简介</a><a href="#work">作品</a><a href="#contact">联系</a></>}
    </div>
    <a className="contact-pill" href="mailto:1035537243@qq.com">联系我 <Arrow /></a>
  </nav>
}

function ProjectFooter({ current, navigate }) {
  const index = projects.findIndex((project) => project.slug === current.slug)
  const next = projects[(index + 1) % projects.length]
  const go = (event, path) => { event.preventDefault(); navigate(path) }
  return <footer className="project-navigation">
    <a href={routeHref(`/work/${next.slug}`)} onClick={(event) => go(event, `/work/${next.slug}`)} className="project-nav-side project-nav-next">
      <span>NEXT PROJECT →</span><strong>{next.title}</strong>
    </a>
  </footer>
}

function HomePage({ navigate }) {
  const [scrolled, setScrolled] = useState(false)
  const directoryRef = useRef(null)
  useEffect(() => {
    let frame = 0
    let previous = window.scrollY > 36
    setScrolled(previous)
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const next = window.scrollY > 36
        if (next === previous) return
        previous = next
        setScrolled(next)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  useEffect(() => {
    const directory = directoryRef.current
    if (!directory) return undefined
    const cards = [...directory.querySelectorAll('.directory-card')]
    directory.classList.add('directory-animate')

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((card) => card.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' })

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return <main>
    <Navigation navigate={navigate} scrolled={scrolled} />
    <header className="hero" id="top">
      <Iridescence color={[0.72, 0.78, 1]} speed={0.72} amplitude={0.13} />
      <div className="hero-shade" /><div className="grid-overlay" />
      <div className="hero-content shell">
        <p className="eyebrow"><span className="status-dot" /> VISUAL / AI / BRAND DESIGNER · 2026</p>
        <h1><span>Personal</span><span className="outline">Resume</span></h1>
        <div className="hero-bottom">
          <p>施汉杰 — 在图像、叙事与新技术之间，<br />创造克制而有感知力的视觉表达。</p>
          <a href="#about" className="round-link">DISCOVER<br />MORE <span>↓</span></a>
        </div>
      </div>
    </header>

    <section className="profile section shell" id="about">
      <div className="section-index">01 / PROFILE</div>
      <div className="profile-intro">
        <p className="kicker">个人简介<br />PROFILE</p>
        <h2>视觉设计是一种建立理解、传达情绪，并让想法被看见的方式。</h2>
      </div>
      <div className="profile-card-grid">
        <BorderGlow className="profile-about-card"><figure className="portrait-frame"><img src="/assets/profile-portrait.webp" alt="施汉杰个人照片" loading="lazy" decoding="async" /><figcaption><span>SHI HANJIE</span><span>PORTRAIT / 个人照片</span></figcaption></figure><div className="profile-card-content"><span className="profile-card-number">01 / ABOUT</span><h3>个人介绍</h3><p>我是一名视觉传达与数字媒体设计方向的硕士研究生，具备动画创作与视觉设计的系统学习背景，并持续关注新技术与设计表达方式的融合。目前主要专注于平面设计与 IP 设计方向，注重视觉语言、创意概念与品牌形象之间的协调表达，同时积极探索 AI 在创意构思与设计实践中的更多可能。希望通过不断学习与实践，创造兼具审美价值与传播力的视觉作品。期待与您的合作。</p></div></BorderGlow>
        <BorderGlow className="profile-info-card"><span className="profile-card-number">02 / EDUCATION</span><h3>教育经历</h3><div className="profile-card-list"><div><span>院校</span><strong>广西师范大学</strong></div><div><span>阶段</span><strong>设计学硕士在读</strong></div><div><span>方向</span><strong>视觉传达 / 数字媒体 / 动画</strong></div></div></BorderGlow>
        <BorderGlow className="profile-info-card"><span className="profile-card-number">03 / SKILLS</span><h3>专业技能</h3><p className="profile-skill-copy">以视觉系统、动态叙事和 AI 协同创作为核心，兼顾概念研究与最终呈现。</p><div className="capability-tags">{capabilities.map((item, i) => <span key={item}>{String(i + 1).padStart(2, '0')} · {item}</span>)}</div><p className="profile-tools">Blender / Photoshop / 剪映 / 即梦 / ChatGPT / Codex</p></BorderGlow>
        <BorderGlow className="profile-awards-card"><span className="profile-card-number">04 / RECOGNITION</span><h3>曾获奖项</h3><div className="award-list">{awards.map(([year, name]) => <div key={name}><span>{year}</span><p>{name}</p></div>)}</div></BorderGlow>
      </div>
    </section>

    <section className="directory section" id="work" ref={directoryRef}>
      <div className="shell">
        <div className="section-index">02 / WORK INDEX</div>
        <div className="directory-head"><h2>WORK<br /><span>DIRECTORY.</span></h2></div>
        <div className="directory-grid">
          {projects.map((project) => <a className="directory-card" href={routeHref(`/work/${project.slug}`)} key={project.slug} onClick={(e) => { e.preventDefault(); navigate(`/work/${project.slug}`) }}>
            <div className={`directory-cover${project.image ? '' : ' directory-cover--empty'}`}>
              {project.image ? <img src={project.image} alt={`${project.title} 作品封面`} loading="lazy" decoding="async" /> : <div className="empty-cover"><span>+</span><p>PROJECT COVER<br />PLACEHOLDER</p></div>}
              <span className="card-id">{project.id}</span><span className="card-open">VIEW PROJECT <Arrow /></span>
            </div>
            <div className="directory-meta"><div><h3>{project.title}</h3><p>{project.type}</p></div><span>{project.year}</span></div>
          </a>)}
        </div>
      </div>
    </section>

    <footer className="contact" id="contact">
      <Iridescence className="contact-iridescence" color={[0.48, 0.56, 0.94]} speed={0.42} amplitude={0.08} />
      <div className="contact-glow" />
      <div className="shell contact-inner">
        <div className="contact-heading">
          <p className="eyebrow"><span className="status-dot" /> CONTACT / 联系方式</p>
          <h2><span>Looking forward to</span><span className="contact-title-outline">working with you</span></h2>
          <p className="contact-cn">期待与您的合作</p>
        </div>
        <div className="contact-details">
          <a className="contact-card" href="mailto:1035537243@qq.com"><span>EMAIL / 邮箱</span><strong>1035537243@qq.com</strong><Arrow /></a>
          <a className="contact-card" href="tel:13395714053"><span>PHONE / 电话</span><strong>13395714053</strong><Arrow /></a>
        </div>
        <div className="footer-line"><span>SHI HANJIE · PERSONAL RESUME</span><a href="#top">BACK TO TOP ↑</a></div>
      </div>
    </footer>
  </main>
}

function CoffeeProject({ project, navigate }) {
  return <main className="coffee-project">
    <Navigation detail navigate={navigate} scrolled />

    <section className="coffee-page coffee-cover">
      <img src="/assets/coffee/cup.webp" alt="整点咖啡品牌咖啡杯实物展示" />
      <div className="coffee-cover-shade" />
      <div className="coffee-page-count">01 / 08</div>
      <div className="shell coffee-cover-copy">
        <p>BRAND IDENTITY · 2026</p>
        <h1>整点咖啡<br /><span>GOT SOME COFFEE</span></h1>
        <div><strong>以一杯准时出现的咖啡，回应快节奏生活中短暂而必要的松弛时刻。</strong><span>SCROLL TO EXPLORE ↓</span></div>
      </div>
    </section>

    <section className="coffee-page coffee-story">
      <div className="coffee-page-count dark">02 / 08</div>
      <div className="shell coffee-story-grid">
        <div><p className="coffee-kicker">DESIGN STATEMENT / 设计说明</p><h2>准时、准点，<br />整点咖啡。</h2></div>
        <div className="coffee-story-copy">
          <p>品牌灵感来自两只海鸥关于“生活目标”的幽默讨论：在快节奏与多重压力之间，人们同样需要一段短暂、轻松且属于自己的时间。</p>
          <p>“整点咖啡”把下午两三点的片刻休息转化为品牌主张，以轻松、温暖、满足为核心感受，用直率的语言、明亮色彩与拟人角色，邀请人们暂时放下工作，与自己和解。</p>
          <div className="coffee-values"><span>轻松 / RELAX</span><span>温暖 / WARM</span><span>满足 / SATISFY</span></div>
        </div>
      <img src="/assets/coffee/story.webp" alt="整点咖啡品牌故事与核心关键词" loading="lazy" decoding="async" />
      </div>
    </section>

    <section className="coffee-page coffee-poster-page">
      <div className="coffee-page-count">03 / 08</div>
      <div className="shell coffee-section-head"><p>POSTER SYSTEM / 核心海报</p><h2>准点开业，<br />欢迎你来。</h2></div>
      <img className="coffee-poster-set" src="/assets/coffee/poster-set.webp" alt="整点咖啡蓝色、橙色与红色系列开业海报" loading="lazy" decoding="async" />
    </section>

    <section className="coffee-page coffee-editorial-page">
      <div className="coffee-page-count dark">04 / 08</div>
      <div className="shell coffee-editorial">
        <div className="coffee-section-head dark"><p>POSTER IN CONTEXT / 海报场景</p><h2>同一视觉语言，<br />进入不同日常。</h2></div>
        <img className="poster-wall" src="/assets/coffee/poster-wall.webp" alt="街头墙面上的整点咖啡开业海报" loading="lazy" decoding="async" />
        <img className="poster-shadow" src="/assets/coffee/poster-shadow.webp" alt="光影墙面上的整点咖啡系列海报" loading="lazy" decoding="async" />
        <img className="poster-frame" src="/assets/coffee/poster-frame.webp" alt="室内空间中的整点咖啡可颂海报" loading="lazy" decoding="async" />
      </div>
    </section>

    <section className="coffee-page coffee-system-page">
      <div className="coffee-page-count dark">05 / 08</div>
      <div className="shell coffee-system-grid">
        <div className="coffee-section-head dark"><p>DESIGN ELEMENTS / 设计元素</p><h2>一只落在杯沿上的鸟，<br />成为品牌记忆。</h2><span>角色图形以蓝色线条、暖黄色点缀与杯形结构组成；不同组合适配招牌、包装和传播物料。</span></div>
        <div className="logo-board"><img src="/assets/coffee/logo-system.webp" alt="整点咖啡角色标志标准制图与组合形式" loading="lazy" decoding="async" /></div>
      </div>
    </section>

    <section className="coffee-page coffee-products-page">
      <div className="coffee-page-count">06 / 08</div>
      <div className="shell coffee-section-head"><p>PACKAGING & PAPER / 包装与纸品</p><h2>从一口点心，<br />到一次递交。</h2></div>
      <div className="shell product-duo"><figure><img src="/assets/coffee/pastry.webp" alt="整点咖啡可颂食品包装" loading="lazy" decoding="async" /><figcaption>PASTRY PACKAGING / 食品包装</figcaption></figure><figure><img src="/assets/coffee/stationery.webp" alt="整点咖啡信封与卡片设计" loading="lazy" decoding="async" /><figcaption>STATIONERY / 品牌纸品</figcaption></figure></div>
    </section>

    <section className="coffee-page coffee-kit-page">
      <div className="coffee-page-count dark">07 / 08</div>
      <div className="shell coffee-section-head dark"><p>STAFF KIT / 员工物料</p><h2>让品牌被穿戴，<br />也被记住。</h2></div>
      <div className="shell kit-grid"><figure className="kit-lanyard"><img src="/assets/coffee/lanyard.webp" alt="整点咖啡员工工牌与挂绳" loading="lazy" decoding="async" /></figure><figure><img src="/assets/coffee/apron.webp" alt="整点咖啡员工围裙" loading="lazy" decoding="async" /></figure><figure><img src="/assets/coffee/cards.webp" alt="整点咖啡品牌名片" loading="lazy" decoding="async" /></figure></div>
    </section>

    <section className="coffee-page coffee-finale">
      <div className="coffee-page-count">08 / 08</div>
      <div className="shell coffee-section-head"><p>IN THE REAL WORLD / 实物与空间</p><h2>品牌最终落在<br />每一次相遇里。</h2></div>
      <div className="shell finale-grid"><figure className="finale-chairs"><img src="/assets/coffee/chairs.webp" alt="整点咖啡品牌户外座椅" loading="lazy" decoding="async" /><figcaption>OUTDOOR SEATING / 户外座椅</figcaption></figure><figure className="finale-cup"><img src="/assets/coffee/cup.webp" alt="整点咖啡品牌咖啡杯" loading="lazy" decoding="async" /><figcaption>COFFEE CUP / 咖啡杯</figcaption></figure><figure className="finale-sign"><img src="/assets/coffee/sign.webp" alt="整点咖啡门店灯箱招牌" loading="lazy" decoding="async" /><figcaption>STORE SIGN / 门店灯箱</figcaption></figure></div>
    </section>
    <ProjectFooter current={project} navigate={navigate} />
  </main>
}

function BaizeArtwork({ src, className = '', alt }) {
  return <figure className={`baize-artwork ${className}`.trim()}><img src={src} alt={alt} loading="lazy" decoding="async" /></figure>
}

function BaizeProject({ project, navigate }) {
  return <main className="baize-project">
    <Navigation detail navigate={navigate} scrolled />

    <section className="baize-page baize-cover">
      <img className="baize-cover-art" src="/assets/baize/cover-complete.webp" alt="白泽祥瑞神兽IP形象设计封面" />
      <div className="baize-cover-mask" />
      <div className="baize-page-count">01 / 09</div>
      <div className="shell baize-cover-copy"><p>MYTHICAL CREATURE · IP IMAGE DESIGN</p><h1>白泽<br /><span>BAIZE</span></h1><div><strong>将通晓万物的祥瑞神兽，转译为活泼、亲和且富有传播力的当代 IP 形象。</strong><span>SCROLL TO EXPLORE ↓</span></div></div>
    </section>

    <section className="baize-page baize-statement">
      <div className="baize-page-count dark">02 / 09</div>
      <div className="shell baize-statement-grid">
        <div><p className="baize-kicker">DESIGN STATEMENT / 设计说明</p><h2>传统神兽，<br />当代表达。</h2></div>
        <div className="baize-statement-copy"><p>白泽是中国古代神话中通晓万物情理、能言人语的祥瑞神兽，也承载着智慧、祈福与辟邪的文化寓意。</p><p>设计保留鹿角、灵动眼眸等识别特征，以圆润轮廓和萌系比例降低神话题材的距离感；祥瑞红、玉青与暖米白构成明快而克制的视觉系统，使角色既保有传统文化底蕴，也适合当代文创与公共传播场景。</p><div><span>祥瑞 / AUSPICIOUS</span><span>智慧 / WISDOM</span><span>亲和 / FRIENDLY</span></div></div>
      </div>
      <div className="shell baize-statement-band"><span>鹿角 / ANTLER</span><span>圆润轮廓 / SOFT SILHOUETTE</span><span>现代萌系 / CONTEMPORARY CUTE</span><i /></div>
    </section>

    <section className="baize-page baize-profile-page">
      <div className="baize-page-count">03 / 09</div>
      <div className="shell baize-section-head"><p>IDENTITY & COLOR / 身份与色彩</p><h2>神兽身份，<br />四种鲜明性格。</h2></div>
      <div className="shell baize-identity-grid">
        <BaizeArtwork src="/assets/baize/identity-card.webp" alt="白泽神兽身份设定：籍贯、身份、性格与爱好" />
        <BaizeArtwork src="/assets/baize/design-concept.webp" alt="白泽IP设计理念与色彩搭配" />
      </div>
    </section>

    <section className="baize-page baize-views-page">
      <div className="baize-page-count dark">04 / 09</div>
      <div className="shell baize-section-head dark"><p>CHARACTER TURNAROUND / 神兽三视图</p><h2>正面、侧面、背面，<br />建立统一角色结构。</h2></div>
      <BaizeArtwork src="/assets/baize/turnaround.webp" className="shell baize-wide-art" alt="白泽IP形象正面、侧面和背面三视图" />
    </section>

    <section className="baize-page baize-expression-page">
      <div className="baize-page-count">05 / 09</div>
      <div className="shell baize-section-head"><p>EXPRESSION SYSTEM / 表情系统</p><h2>让每一种情绪，<br />都成为沟通语言。</h2></div>
      <BaizeArtwork src="/assets/baize/expressions.webp" className="shell baize-wide-art" alt="白泽开心、惊喜、期待、错愕和委屈等八种完整表情" />
    </section>

    <section className="baize-page baize-costume-page">
      <div className="baize-page-count dark">06 / 09</div>
      <div className="shell baize-section-head dark"><p>COSTUME & MOTION / 服装与动作延展</p><h2>从神话身份，<br />走入多元角色。</h2></div>
      <BaizeArtwork src="/assets/baize/costumes-actions.webp" className="shell baize-portrait-art" alt="白泽财神、武将、书生服装及动作延展" />
    </section>

    <section className="baize-page baize-merch-page">
      <div className="baize-page-count">07 / 09</div>
      <div className="shell baize-section-head"><p>CULTURAL PRODUCTS / 文创周边</p><h2>表情与角色，<br />转化为随身陪伴。</h2></div>
      <BaizeArtwork src="/assets/baize/merchandise.webp" className="shell baize-wide-art" alt="白泽徽章、钥匙扣和磁贴文创周边" />
    </section>

    <section className="baize-page baize-package-page">
      <div className="baize-page-count dark">08 / 09</div>
      <div className="shell baize-section-head dark"><p>BLIND BOX / 系列盲盒</p><h2>把祈愿主题，<br />包装成收藏体验。</h2></div>
      <BaizeArtwork src="/assets/baize/blindbox.webp" className="shell baize-wide-art" alt="白泽财神、武将和书生系列盲盒包装设计" />
    </section>

    <section className="baize-page baize-scene-page">
      <div className="baize-page-count">09 / 09</div>
      <div className="shell baize-section-head"><p>CAMPAIGN IN CONTEXT / 宣传场景</p><h2>进入城市空间，<br />让神话与人相遇。</h2></div>
      <BaizeArtwork src="/assets/baize/campaign-scenes.webp" className="shell baize-wide-art baize-scene-art" alt="白泽IP地铁与公共空间宣传海报应用" />
    </section>
    <ProjectFooter current={project} navigate={navigate} />
  </main>
}

function ShadowProject({ project, navigate }) {
  return <main className="shadow-project">
    <Navigation detail navigate={navigate} scrolled />

    <section className="shadow-page shadow-cover">
      <img className="shadow-cover-art" src="/assets/shadow/cover.webp" alt="光影千年皮影戏IP形象设计封面" />
      <div className="shadow-cover-mask" />
      <div className="shadow-page-count">01 / 08</div>
      <div className="shell shadow-cover-copy"><p>SHADOW PUPPET · IP IMAGE DESIGN</p><h1>光影千年<br /><span>SHADOW PUPPET</span></h1><div><strong>以陕西皮影的色彩、纹样与戏剧角色为线索，塑造兼具传统韵味与亲和力的“影虎”IP。</strong><span>SCROLL TO EXPLORE ↓</span></div></div>
    </section>

    <section className="shadow-page shadow-statement">
      <div className="shadow-page-count dark">02 / 08</div>
      <div className="shell shadow-statement-grid">
        <div><p className="shadow-kicker">DESIGN STATEMENT / 设计说明</p><h2>让皮影文化，<br />走进当代生活。</h2></div>
        <div className="shadow-statement-copy"><p>皮影戏以兽皮或纸板雕刻人物，在灯光与幕布之间完成叙事，是集造型、雕刻、色彩与表演于一体的民间艺术。</p><p>项目以虎为角色原型，从陕西皮影中提取高饱和色彩、镂空线条、传统甲胄和戏曲造型，转化为更年轻、活泼的IP语言。角色既保留皮影艺术的装饰性，也能自然延展到海报、展览与文创产品。</p><div><span>非遗传承 / HERITAGE</span><span>皮影纹样 / PATTERN</span><span>青年表达 / YOUTH</span></div></div>
      </div>
      <div className="shell shadow-motif-line"><span>LIGHT</span><i>●</i><span>SHADOW</span><i>●</i><span>STORY</span><i>●</i><span>CRAFT</span></div>
    </section>

    <section className="shadow-page shadow-character-page">
      <div className="shadow-page-count">03 / 08</div>
      <div className="shell shadow-section-head"><p>CHARACTER SYSTEM / 角色系统</p><h2>影虎，<br />刚柔并济。</h2></div>
      <div className="shell shadow-character-grid">
        <BaizeArtwork src="/assets/shadow/character-card.webp" alt="影虎角色介绍与完整正面形象" />
        <BaizeArtwork src="/assets/shadow/turnaround.webp" alt="影虎正面侧面背面三视图" />
      </div>
    </section>

    <section className="shadow-page shadow-expression-page">
      <div className="shadow-page-count dark">04 / 08</div>
      <div className="shell shadow-section-head dark"><p>EXPRESSION SYSTEM / 表情延展</p><h2>十二种情绪，<br />建立鲜活性格。</h2></div>
      <BaizeArtwork src="/assets/shadow/expressions.webp" className="shell shadow-wide-art" alt="影虎十二种完整表情设计" />
    </section>

    <section className="shadow-page shadow-costume-page">
      <div className="shadow-page-count">05 / 08</div>
      <div className="shell shadow-section-head"><p>ACTION & COSTUME / 动作与服装</p><h2>从戏台角色，<br />延展多重身份。</h2></div>
      <BaizeArtwork src="/assets/shadow/costumes.webp" className="shell shadow-wide-art" alt="影虎骑瑞兽、武将、靠旗和骑马造型" />
    </section>

    <section className="shadow-page shadow-poster-page">
      <div className="shadow-page-count dark">06 / 08</div>
      <div className="shell shadow-section-head dark"><p>POSTER SERIES / 系列海报</p><h2>一组角色，<br />讲述千年光影。</h2></div>
      <div className="shell shadow-poster-grid">
        <figure><img src="/assets/shadow/poster-rider.webp" alt="光影千年骑马角色海报" loading="lazy" /><figcaption>骑马 / RIDER</figcaption></figure>
        <figure><img src="/assets/shadow/poster-warrior.webp" alt="光影千年武将角色海报" loading="lazy" /><figcaption>武将 / WARRIOR</figcaption></figure>
        <figure><img src="/assets/shadow/poster-qilin.webp" alt="光影千年麒麟角色海报" loading="lazy" /><figcaption>麒麟 / QILIN</figcaption></figure>
      </div>
    </section>

    <section className="shadow-page shadow-products-page">
      <div className="shadow-page-count">07 / 08</div>
      <div className="shell shadow-section-head"><p>CULTURAL PRODUCTS / 文创产品</p><h2>角色走下戏台，<br />成为随身文化。</h2></div>
      <BaizeArtwork src="/assets/shadow/products.webp" className="shell shadow-wide-art" alt="影虎钥匙扣、徽章和手机壳应用" />
    </section>

    <section className="shadow-page shadow-lifestyle-page">
      <div className="shadow-page-count dark">08 / 08</div>
      <div className="shell shadow-section-head dark"><p>LIFESTYLE APPLICATION / 生活化应用</p><h2>从展览视觉，<br />延伸日常场景。</h2></div>
      <BaizeArtwork src="/assets/shadow/lifestyle.webp" className="shell shadow-wide-art" alt="光影千年服装、明信片、帆布袋、抱枕、墙面和折扇应用" />
    </section>
    <ProjectFooter current={project} navigate={navigate} />
  </main>
}

function BeihaiProject({ project, navigate }) {
  return <main className="beihai-project">
    <Navigation detail navigate={navigate} scrolled />

    <section className="beihai-page beihai-cover">
      <img className="beihai-cover-art" src="/assets/beihai/cover-clear.webp" alt="潮起疍风华广西北海疍家科普动画IP封面" />
      <div className="beihai-cover-mask" />
      <div className="beihai-page-count">01 / 06</div>
      <div className="shell beihai-cover-copy"><p>ANIMATION · CULTURAL IP DESIGN</p><h1>潮起疍风华<br /><span>A DAN · BEIHAI</span></h1><div><strong>以疍家少女“阿疍”为叙事主角，用轻盈动画讲述北海海洋文化与传统生活。</strong><span>SCROLL TO EXPLORE ↓</span></div></div>
    </section>

    <section className="beihai-page beihai-intro">
      <div className="beihai-page-count dark">02 / 06</div>
      <div className="shell beihai-intro-grid">
        <div><p className="beihai-kicker">PROJECT INTRODUCTION / 项目简介</p><h2>一顶斗笠，<br />一颗珍珠，<br />一片北海。</h2></div>
        <div className="beihai-intro-copy"><p>《潮起疍风华》是一项以广西北海疍家文化为主题的科普动画与IP形象设计。项目通过少女“阿疍”的视角，将海上生活、珍珠手作、赶海记忆与航行精神转化为亲切易懂的视觉叙事。</p><p>角色以疍家标志性竹编斗笠为核心记忆点，结合合浦珍珠、海洋蓝、珊瑚红与柔和粉色，在传统地域文化和年轻动画语言之间建立连接。</p><dl><div><dt>TYPE</dt><dd>科普动画 / IP DESIGN</dd></div><div><dt>LOCATION</dt><dd>广西北海 / BEIHAI</dd></div><div><dt>CHARACTER</dt><dd>阿疍 / A DAN</dd></div></dl></div>
      </div>
      <div className="shell beihai-culture-band"><span>斗笠 / STRAW HAT</span><span>合浦珍珠 / PEARL</span><span>疍家 / DANJIA</span><span>海洋 / OCEAN</span></div>
    </section>

    <section className="beihai-page beihai-film-page">
      <div className="beihai-page-count">03 / 06</div>
      <div className="shell beihai-section-head"><p>ANIMATION FILM / 动画正片</p><h2>跟随阿疍，<br />驶向北海。</h2></div>
      <div className="shell beihai-player-frame">
        <video controls playsInline preload="none" poster="/assets/beihai/cover-clear.webp" aria-label="潮起疍风华动画正片">
          <source src="/assets/beihai/beihai-animation.mp4" type="video/mp4" />
          当前浏览器不支持视频播放。
        </video>
        <div><span>FULL FILM</span><span>点击播放 · 支持全屏观看</span></div>
      </div>
    </section>

    <section className="beihai-page beihai-character-page">
      <div className="beihai-page-count dark">04 / 06</div>
      <div className="shell beihai-section-head dark"><p>CHARACTER PROFILE / 角色档案</p><h2>勇敢坚强的，<br />疍家少女阿疍。</h2></div>
      <div className="shell beihai-character-modules"><BaizeArtwork src="/assets/beihai/identity-v2.webp" className="beihai-module-art" alt="阿疍角色形象、文化记忆点与基础档案" /><BaizeArtwork src="/assets/beihai/views-v2.webp" className="beihai-module-art" alt="阿疍完整正视、四分之三侧视和侧视图" /></div>
    </section>

    <section className="beihai-page beihai-poster-page">
      <div className="beihai-page-count">05 / 06</div>
      <div className="shell beihai-section-head"><p>STORY POSTERS / 动画主题海报</p><h2>四个海洋章节，<br />串起一段文化旅程。</h2></div>
      <BaizeArtwork src="/assets/beihai/posters-v2.webp" className="shell beihai-module-art beihai-poster-art" alt="追风遇海、贝珠手作、海边温情、航行无际四张完整主题海报" />
    </section>

    <section className="beihai-page beihai-mockup-page">
      <div className="beihai-page-count dark">06 / 06</div>
      <div className="shell beihai-section-head dark"><p>PHYSICAL APPLICATION / 实物应用</p><h2>把北海故事，<br />带入真实生活。</h2></div>
      <figure className="shell beihai-mockup"><img src="/assets/beihai/physical-mockup.webp" alt="阿疍亚克力立牌、帆布袋、明信片和徽章实物应用效果" loading="lazy" /><figcaption><span>GENERATED APPLICATION VISUAL</span><span>亚克力立牌 · 帆布袋 · 明信片 · 徽章</span></figcaption></figure>
    </section>
    <ProjectFooter current={project} navigate={navigate} />
  </main>
}

function TeaLifeProject({ project, navigate }) {
  const storyBeats = [
    ['01', '开场', '外婆老屋 · 祭祖前夜', '茶字缺一笔，提出“留下还是传承”的核心问题。'],
    ['02', '童年', '瑶山采茶 · 满月礼', '第一次听见外婆说：“茶叶要去见人。”'],
    ['03', '少女', '婚嫁礼', '在送嫁与敬茶中，看见油茶如何接住离别与祝福。'],
    ['04', '成年', '寿宴', '接过外婆木槌，理解“叶子可以留着，但茶要热着”。'],
    ['05', '高潮', '祭祖', '放弃贴上最后一片叶，将它打成热茶敬给外婆。'],
    ['06', '结尾', '待客礼', '阿茶接过新茶叶，传承从墙面记忆回到生活现场。'],
  ]
  const storyboardCaptions = ['瑶山初见', '一片新叶', '婚嫁敬茶', '外婆制茶', '共饮时刻', '接过木槌', '递叶传情', '共同擂茶', '寿宴团聚', '炉火相伴', '留下茶叶', '木槌记忆']
  return <main className="tea-project">
    <Navigation detail navigate={navigate} scrolled />

    <section className="tea-page tea-cover">
      <img className="tea-cover-art" src="/assets/chajian/cover-wide.webp" alt="一片茶见一生瑶族油茶非遗动画封面" />
      <div className="tea-cover-mask" />
      <div className="tea-page-count">01 / 08</div>
      <div className="shell tea-cover-copy"><p>AIGC FELT ANIMATION · YAO OIL TEA</p><h1>一片茶，见一生<br /><span>A LEAF OF TEA</span></h1><div><strong>一片叶子，一碗油茶；以阿茶的一生，讲述瑶族记忆如何在日常中代代相传。</strong><span>SCROLL TO EXPLORE ↓</span></div></div>
    </section>

    <section className="tea-page tea-intro">
      <div className="tea-page-count dark">02 / 08</div>
      <div className="shell tea-intro-grid"><div><p className="tea-kicker">WORK INTRODUCTION / 作品简介</p><h2>茶叶离了树，<br />是要去见人。</h2></div><div className="tea-intro-copy"><p>《一片茶，见一生》是一部以瑶族油茶习俗为主题的 AIGC 非遗毛毡动画短片。作品以瑶族女孩阿茶的成长为主线，以茶叶为情感线索，将采茶、炒茶、擂茶、冲茶与敬茶等工序融入满月、婚嫁、寿宴、祭祖和待客等人生礼俗。</p><p>短片通过温暖细腻的毛毡定格动画语言，讲述阿茶从“收藏记忆”到“理解传承”的转变：非遗并非静态保存的旧物，而是一种仍在生活中延续的方式。</p><div><span>瑶族油茶 / YAO OIL TEA</span><span>毛毡动画 / FELT ANIMATION</span><span>代际传承 / INHERITANCE</span></div></div></div>
    </section>

    <section className="tea-page tea-film-page">
      <div className="tea-page-count">03 / 08</div>
      <div className="shell tea-section-head"><p>ANIMATION FILM / 动画正片</p><h2>一碗油茶，<br />看见一生。</h2></div>
      <div className="shell tea-player"><video controls playsInline preload="none" poster="/assets/chajian/cover-source.webp" aria-label="一片茶见一生动画正片"><source src="/assets/chajian/animation.mp4" type="video/mp4" />当前浏览器不支持视频播放。</video><div><span>FULL FILM</span><span>点击播放 · 支持全屏观看</span></div></div>
    </section>

    <section className="tea-page tea-synopsis-page">
      <div className="tea-page-count dark">04 / 08</div>
      <div className="shell tea-section-head dark"><p>STORY SYNOPSIS / 故事梗概</p><h2>从收藏记忆，<br />到理解传承。</h2></div>
      <div className="shell tea-synopsis-grid"><p>故事从外婆带小阿茶上山采茶开始。外婆告诉她：“茶叶离了树，不是死了，是要去见人。”这句话成为全片的情感核心。后来，阿茶在人生的重要仪式中不断遇见油茶，每一次出现都对应着人物生命阶段中的一次理解。</p><p>结尾时，阿茶已经成为教孩子打油茶的人。那些曾被她收集起来的茶叶，最终一片片拼成“茶”字，象征个人记忆、家族情感与民族文化在下一代手中重新延续。</p><blockquote>非遗不是被保存起来的旧物，<br />而是在一次次打茶、敬茶、共饮中继续活着的生活方式。</blockquote></div>
    </section>

    <section className="tea-page tea-arc-page">
      <div className="tea-page-count">05 / 08</div>
      <div className="shell tea-section-head"><p>NARRATIVE ARC / 故事脉络</p><h2>六次遇见，<br />完成一次传承。</h2></div>
      <div className="shell tea-arc-grid">{storyBeats.map(([id, title, scene, copy]) => <article key={id}><span>{id}</span><div><h3>{title}</h3><small>{scene}</small><p>{copy}</p></div></article>)}</div>
    </section>

    <section className="tea-page tea-character-page">
      <div className="tea-page-count dark">06 / 08</div>
      <div className="shell tea-section-head dark"><p>CHARACTER TURNAROUND / 人物三视图</p><h2>毛毡质感，<br />承载三代记忆。</h2></div>
      <div className="shell tea-character-grid tea-character-grid--complete"><figure><img src="/assets/chajian/character-panel-grandmother.webp" alt="外婆毛毡人物正面侧面背面完整三视图" loading="lazy" /><figcaption><span>01 · 外婆 / GRANDMOTHER</span><small>情感引路人 · 传统生活的守护者</small></figcaption></figure><figure><img src="/assets/chajian/character-panel-child.webp" alt="年少阿茶毛毡人物正面侧面背面完整三视图" loading="lazy" /><figcaption><span>02 · 年少阿茶 / YOUNG ACHA</span><small>故事起点 · 初识油茶与家族记忆</small></figcaption></figure><figure><img src="/assets/chajian/character-panel-teen.webp" alt="青年阿茶第一套民族服饰完整三视图" loading="lazy" /><figcaption><span>03 · 青年阿茶 / ACHA</span><small>成长阶段 · 瑶族盛装造型</small></figcaption></figure><figure><img src="/assets/chajian/character-panel-adult.webp" alt="成年阿茶民族服饰完整三视图" loading="lazy" /><figcaption><span>04 · 成年阿茶 / ADULT ACHA</span><small>理解传承 · 接过外婆的木槌</small></figcaption></figure><figure><img src="/assets/chajian/character-panel-ahe.webp" alt="阿禾毛毡人物正面侧面背面完整三视图" loading="lazy" /><figcaption><span>05 · 阿禾 / A HE</span><small>下一代 · 传承故事的新起点</small></figcaption></figure><figure><img src="/assets/chajian/character-panel-festival.webp" alt="瑶族毛毡风格盛装人物完整三视图" loading="lazy" /><figcaption><span>06 · 瑶族盛装 / FESTIVAL LOOK</span><small>服饰细节 · 银饰与织绣纹样</small></figcaption></figure></div>
    </section>

    <section className="tea-page tea-poster-page" id="tea-posters">
      <div className="tea-page-count dark">07 / 08</div>
      <div className="shell tea-section-head dark"><p>KEY VISUAL POSTERS / 主题海报</p><h2>一片茶叶，<br />三重生命叙事。</h2></div>
      <div className="shell tea-poster-grid">
        <figure><div className="tea-poster-mat"><img src="/assets/chajian/poster-01.webp" alt="一片茶见一生主题叙事海报" loading="lazy" /></div><figcaption><span>01</span><strong>一生传承 / A LIFETIME OF HERITAGE</strong></figcaption></figure>
        <figure><div className="tea-poster-mat"><img src="/assets/chajian/poster-02.webp" alt="一片茶见一生祖孙油茶主题海报" loading="lazy" /></div><figcaption><span>02</span><strong>代代相传 / PASSED THROUGH GENERATIONS</strong></figcaption></figure>
        <figure><div className="tea-poster-mat"><img src="/assets/chajian/poster-03.webp" alt="一片茶见一生非遗文化长卷海报" loading="lazy" /></div><figcaption><span>03</span><strong>见人间烟火 / WITNESS A LIFETIME</strong></figcaption></figure>
      </div>
    </section>

    <section className="tea-page tea-storyboard-page">
      <div className="tea-page-count">08 / 08</div>
      <div className="shell tea-section-head"><p>SELECTED STORYBOARDS / 精选分镜</p><h2>从采茶到敬茶，<br />让情感自然生长。</h2></div>
      <div className="shell tea-storyboard-grid">{storyboardCaptions.map((caption, index) => <figure key={caption}><img src={`/assets/chajian/storyboard-v2-${String(index + 1).padStart(2, '0')}.webp`} alt={`${caption}动画分镜`} loading="lazy" /><figcaption><span>{String(index + 1).padStart(2, '0')}</span><strong>{caption}</strong></figcaption></figure>)}</div>
    </section>
    <ProjectFooter current={project} navigate={navigate} />
  </main>
}

function SmallRanchProject({ project, navigate }) {
  const ProcessCard = ({ src, label, alt, wide = false }) => <figure className={`farm-process-card${wide ? ' farm-process-card--wide' : ''}`}><img src={src} alt={alt} loading="lazy" /><figcaption>{label}</figcaption></figure>
  return <main className="farm-project">
    <Navigation detail navigate={navigate} scrolled />

    <section className="farm-page farm-cover">
      <img className="farm-cover-art" src="/assets/farm/cover.webp" alt="小小牧场像素游戏封面" />
      <div className="farm-cover-mask" />
      <div className="farm-page-count">01 / 07</div>
      <div className="shell farm-cover-copy"><p>PIXEL FARM SIMULATION · UNITY 2D</p><h1>小小牧场<br /><span>SMALL RANCH</span></h1><div><strong>把一座会呼吸的小牧场放进桌面，在陪伴、养成与经营之间，留下一段轻松的像素时光。</strong><span>SCROLL TO EXPLORE ↓</span></div></div>
    </section>

    <section className="farm-page farm-intro">
      <div className="farm-page-count dark">02 / 07</div>
      <div className="shell farm-intro-grid"><div><p className="farm-kicker">WORK INTRODUCTION / 作品简介</p><h2>桌面即牧场，<br />陪伴也是玩法。</h2></div><div className="farm-intro-copy"><p>《小小牧场》是一款使用 Unity 2D 开发的像素风桌面牧场模拟经营游戏 Demo。作品以“桌面即牧场”为核心概念，将动物养成、资源产出、商店购买与轻量管理，压缩进常驻桌面的陪伴体验。</p><p>玩家从购买动物幼崽开始，等待成长并收集鸡蛋、牛奶、毛线等产物，再将收益投入新的动物与设施，形成简单明确、节奏舒缓的经营循环。</p><div><span>UNITY 2D</span><span>PIXEL ART</span><span>DESKTOP COMPANION</span></div></div></div>
    </section>

    <section className="farm-page farm-loop-page">
      <div className="farm-page-count dark">03 / 07</div>
      <div className="shell farm-section-head"><p>CORE GAME LOOP / 核心循环</p><h2>购买、成长、收获，<br />让牧场持续运转。</h2></div>
      <figure className="shell farm-wide-art"><img src="/assets/farm/economy-loop.webp" alt="小小牧场动物成长、产出与价格体系" loading="lazy" /><figcaption>动物成长阶段 · 资源产出 · 经营反馈</figcaption></figure>
    </section>

    <section className="farm-page farm-sprite-page">
      <div className="farm-page-count">04 / 07</div>
      <div className="shell farm-section-head light"><p>PIXEL ASSET SYSTEM / 像素资产系统</p><h2>用有限帧数，<br />塑造鲜活性格。</h2></div>
      <figure className="shell farm-wide-art farm-wide-art--dark"><img src="/assets/farm/animal-sprites.webp" alt="鸡、猪、鸭、兔与奶牛的待机和行走动画序列" loading="lazy" /><figcaption>待机动画 · 行走动画 · 多动物状态</figcaption></figure>
    </section>

    <section className="farm-page farm-making-page">
      <div className="farm-page-count dark">05 / 07</div>
      <div className="shell farm-section-head"><p>ART & ANIMATION / 美术与动画制作</p><h2>从像素绘制，<br />到场景中的生命。</h2></div>
      <div className="shell farm-process-grid"><ProcessCard src="/assets/farm/process-01.webp" label="01 / 像素素材绘制" alt="Aseprite 中绘制奶牛像素动画" wide /><ProcessCard src="/assets/farm/process-02.webp" label="02 / 场景搭建" alt="Unity 2D 牧场场景搭建" /><ProcessCard src="/assets/farm/process-03.webp" label="03 / 动画状态" alt="Unity Animator 动画状态制作" /></div>
    </section>

    <section className="farm-page farm-system-page">
      <div className="farm-page-count">06 / 07</div>
      <div className="shell farm-section-head light"><p>INTERACTION SYSTEM / 交互系统</p><h2>行为、商店与界面，<br />共同构成游戏节奏。</h2></div>
      <div className="shell farm-process-grid farm-process-grid--three"><ProcessCard src="/assets/farm/process-04.webp" label="01 / 动物行为逻辑" alt="动物行为脚本编写" /><ProcessCard src="/assets/farm/process-06.webp" label="02 / 商店界面" alt="游戏商店界面设计" /><ProcessCard src="/assets/farm/process-07.webp" label="03 / UI 功能编码" alt="游戏主界面功能编码" /></div>
    </section>

    <section className="farm-page farm-finale-page">
      <div className="farm-page-count dark">07 / 07</div>
      <div className="shell farm-section-head"><p>TESTING & FINAL EXPERIENCE / 测试与体验</p><h2>让牧场真正住进桌面。</h2></div>
      <div className="shell farm-test-gallery">
        <figure><div className="farm-test-image"><img src="/assets/farm/process-05.webp" alt="小小牧场 Unity 数据与构建测试画面" loading="lazy" /></div><figcaption><span>01 / BUILD TEST</span><strong>数据与构建测试</strong><small>Unity 构建完成 · 桌面程序运行验证</small></figcaption></figure>
        <figure><div className="farm-test-image"><img src="/assets/farm/process-08.webp" alt="小小牧场桌面常驻最终测试画面" loading="lazy" /></div><figcaption><span>02 / FINAL EXPERIENCE</span><strong>最终游戏画面</strong><small>桌面常驻体验 · 实际使用场景测试</small></figcaption></figure>
      </div>
    </section>
    <ProjectFooter current={project} navigate={navigate} />
  </main>
}

function ProjectPage({ project, navigate }) {
  if (!project) return <NotFound navigate={navigate} />
  if (project.slug === 'got-some-coffee') return <CoffeeProject project={project} navigate={navigate} />
  if (project.slug === 'baize') return <BaizeProject project={project} navigate={navigate} />
  if (project.slug === 'shadow-puppet') return <ShadowProject project={project} navigate={navigate} />
  if (project.slug === 'beihai-animation') return <BeihaiProject project={project} navigate={navigate} />
  if (project.slug === 'tea-life') return <TeaLifeProject project={project} navigate={navigate} />
  if (project.slug === 'small-ranch') return <SmallRanchProject project={project} navigate={navigate} />
  return <main className="project-page">
    <Navigation detail navigate={navigate} scrolled />
    <header className={`project-hero${project.image ? '' : ' project-hero--empty'}`}>
      {project.image && <img src={project.image} alt={`${project.title} 项目封面`} />}
      <div className="project-hero-shade" />
      <div className="shell project-title">
        <div className="project-label"><span>PROJECT {project.id}</span><span>{project.year}</span></div>
        <h1>{project.title}</h1><p>{project.type}</p>
      </div>
    </header>
    <section className="project-body shell">
      <div className="project-overview"><div className="section-index">PROJECT OVERVIEW</div><h2>项目内容展示区</h2><p>这里预留项目背景、设计思路、个人职责和最终成果的介绍空间。获得真实项目资料后，可替换为完整案例叙事。</p></div>
      <div className="project-gallery">
        {[1, 2, 3, 4].map((n) => <div className={`gallery-placeholder gallery-placeholder--${n}`} key={n}><span>IMAGE {String(n).padStart(2, '0')}</span><p>作品图片预留区域</p></div>)}
      </div>
    </section>
    <ProjectFooter current={project} navigate={navigate} />
  </main>
}

function NotFound({ navigate }) { return <main className="not-found"><p>404 / PAGE NOT FOUND</p><h1>页面不存在</h1><a href={routeHref('/')} onClick={(e) => { e.preventDefault(); navigate('/') }}>返回首页 <Arrow /></a></main> }

export default function App() {
  const [path, navigate] = useRoute()
  const match = path.match(/^\/work\/([^/]+)\/?$/)
  return match ? <ProjectPage project={projects.find((p) => p.slug === match[1])} navigate={navigate} /> : <HomePage navigate={navigate} />
}
