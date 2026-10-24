import { Sparkles, Compass, CheckCircle2 } from 'lucide-react'

export default function HyderabadDuskScene({ onBrandClick }) {
  return (
    <div className="auth-dusk-scene" aria-label="Animated Hyderabad Dusk Scene">
      {/* Background Animated SVG Canvas */}
      <svg
        className="dusk-svg-canvas"
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Deep Hyderabad Twilight Gradient */}
          <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#08140F" />
            <stop offset="28%" stopColor="#0F241A" />
            <stop offset="55%" stopColor="#1A2D35" />
            <stop offset="78%" stopColor="#3D251D" />
            <stop offset="100%" stopColor="#63321B" />
          </linearGradient>

          {/* Golden Moon Glow */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#F5DC8C" stopOpacity="0.75" />
            <stop offset="85%" stopColor="#D4A738" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#D4A738" stopOpacity="0" />
          </radialGradient>

          {/* Water Surface Gradient for Hussain Sagar */}
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1A1E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#050C0E" stopOpacity="0.95" />
          </linearGradient>

          {/* Silhouette Gradient for Monuments */}
          <linearGradient id="silhouetteGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#162920" />
            <stop offset="100%" stopColor="#0B1510" />
          </linearGradient>

          {/* Charminar Windows Glow */}
          <linearGradient id="windowGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFEAA7" />
            <stop offset="100%" stopColor="#E5B232" />
          </linearGradient>

          {/* Marching Ants Route Gradient */}
          <linearGradient id="routeGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E5B232" />
            <stop offset="50%" stopColor="#FFF2A3" />
            <stop offset="100%" stopColor="#E5B232" />
          </linearGradient>
        </defs>

        {/* 1. Dusk Sky Rectangle */}
        <rect width="600" height="800" fill="url(#duskSky)" />

        {/* 2. Twinkling Stars Field */}
        <g className="stars-group">
          <circle cx="50" cy="70" r="1.5" className="star star-twinkle-1" fill="#FFFFFF" opacity="0.8" />
          <circle cx="120" cy="110" r="1.2" className="star star-twinkle-2" fill="#FFEAA7" opacity="0.9" />
          <circle cx="190" cy="50" r="1.8" className="star star-twinkle-3" fill="#FFFFFF" opacity="0.75" />
          <circle cx="280" cy="95" r="1.3" className="star star-twinkle-1" fill="#FFEAA7" opacity="0.85" />
          <circle cx="340" cy="40" r="2.0" className="star star-twinkle-4" fill="#FFFFFF" opacity="0.9" />
          <circle cx="410" cy="120" r="1.4" className="star star-twinkle-2" fill="#FFFFFF" opacity="0.7" />
          <circle cx="490" cy="65" r="1.6" className="star star-twinkle-3" fill="#FFEAA7" opacity="0.8" />
          <circle cx="550" cy="100" r="1.3" className="star star-twinkle-1" fill="#FFFFFF" opacity="0.85" />
          <circle cx="80" cy="170" r="1.5" className="star star-twinkle-4" fill="#FFEAA7" opacity="0.7" />
          <circle cx="230" cy="150" r="1.2" className="star star-twinkle-2" fill="#FFFFFF" opacity="0.85" />
          <circle cx="370" cy="180" r="1.4" className="star star-twinkle-3" fill="#FFFFFF" opacity="0.65" />
          <circle cx="520" cy="160" r="1.7" className="star star-twinkle-1" fill="#FFEAA7" opacity="0.9" />
        </g>

        {/* 3. Floating Luminous Moon */}
        <g className="floating-moon-group">
          {/* Moon Halo */}
          <circle cx="470" cy="130" r="48" fill="url(#moonGlow)" />
          {/* Moon Body */}
          <circle cx="470" cy="130" r="24" fill="#FFFBE6" />
          {/* Subtle Craters */}
          <circle cx="463" cy="124" r="4" fill="#E8D9A2" opacity="0.45" />
          <circle cx="476" cy="133" r="5" fill="#E8D9A2" opacity="0.4" />
          <circle cx="466" cy="139" r="3" fill="#E8D9A2" opacity="0.35" />
        </g>

        {/* 4. Drifting Dusk Clouds */}
        <g className="clouds-layer">
          <path
            className="cloud cloud-drift-fast"
            d="M -60 170 Q -20 145 25 160 Q 75 140 120 165 Q 160 155 190 175 L -60 195 Z"
            fill="rgba(247, 245, 240, 0.08)"
          />
          <path
            className="cloud cloud-drift-slow"
            d="M 280 130 Q 320 110 370 125 Q 420 105 470 125 Q 510 115 550 135 L 280 150 Z"
            fill="rgba(247, 245, 240, 0.06)"
          />
          <path
            className="cloud cloud-drift-mid"
            d="M 80 230 Q 140 210 200 225 Q 260 200 320 225 Q 360 215 410 235 L 80 250 Z"
            fill="rgba(201, 162, 39, 0.07)"
          />
        </g>

        {/* 5. Gold Lanterns Slowly Rising */}
        <g className="lanterns-group">
          <g className="lantern lantern-1">
            <rect x="75" y="440" width="12" height="18" rx="3" fill="#E5B232" opacity="0.85" />
            <circle cx="81" cy="449" r="3" fill="#FFF8D1" />
            <circle cx="81" cy="449" r="10" fill="#E5B232" opacity="0.25" />
          </g>
          <g className="lantern lantern-2">
            <rect x="195" y="380" width="10" height="15" rx="3" fill="#D49924" opacity="0.8" />
            <circle cx="200" cy="387" r="2.5" fill="#FFF8D1" />
            <circle cx="200" cy="387" r="8" fill="#D49924" opacity="0.22" />
          </g>
          <g className="lantern lantern-3">
            <rect x="360" y="420" width="14" height="20" rx="3" fill="#E5B232" opacity="0.9" />
            <circle cx="367" cy="430" r="3.5" fill="#FFF8D1" />
            <circle cx="367" cy="430" r="12" fill="#E5B232" opacity="0.3" />
          </g>
          <g className="lantern lantern-4">
            <rect x="495" y="370" width="11" height="16" rx="3" fill="#D49924" opacity="0.75" />
            <circle cx="500" cy="378" r="2.5" fill="#FFF8D1" />
            <circle cx="500" cy="378" r="9" fill="#D49924" opacity="0.2" />
          </g>
          <g className="lantern lantern-5">
            <rect x="290" y="470" width="9" height="14" rx="2" fill="#E5B232" opacity="0.85" />
            <circle cx="294" cy="477" r="2" fill="#FFF8D1" />
            <circle cx="294" cy="477" r="7" fill="#E5B232" opacity="0.2" />
          </g>
        </g>

        {/* 6. Distant Hills & Fort Plateau Silhouette */}
        <path
          d="M 0 540 Q 60 510 130 525 Q 210 500 310 530 Q 420 495 520 525 Q 570 515 600 535 L 600 800 L 0 800 Z"
          fill="#0D1D16"
          opacity="0.9"
        />

        {/* 7. Layered Hyderabad Landmarks Skyline */}

        {/* Landmark 1: Golconda Fort (Left Region: x=30 to x=190) */}
        <g className="landmark-golconda" id="landmark-golconda">
          {/* Rugged granite ramparts & battlements */}
          <path
            d="M 20 620 L 45 560 L 55 560 L 55 570 L 65 570 L 65 550 L 75 550 L 75 570 L 85 570 L 85 540 L 105 540 L 105 530 L 125 530 L 125 545 L 140 545 L 140 565 L 155 565 L 155 580 L 175 580 L 175 620 Z"
            fill="url(#silhouetteGrad)"
          />
          {/* Fort Pavilion & Acoustic Gateway Arch */}
          <path
            d="M 88 540 L 102 540 L 102 525 Q 95 515 88 525 Z"
            fill="#10221A"
          />
          <path
            d="M 91 535 Q 95 528 99 535 L 99 540 L 91 540 Z"
            fill="#08120E"
          />
          {/* Subtle Fort Wall Texture Arches */}
          <path d="M 50 585 Q 55 578 60 585" stroke="#254335" strokeWidth="1.5" fill="none" />
          <path d="M 120 565 Q 125 558 130 565" stroke="#254335" strokeWidth="1.5" fill="none" />
        </g>

        {/* Landmark 2: Charminar (Center Region: x=240 to x=360) */}
        <g className="landmark-charminar" id="landmark-charminar">
          {/* Base & Main Grand Arch Block */}
          <path
            d="M 245 620 L 245 520 L 355 520 L 355 620 Z"
            fill="url(#silhouetteGrad)"
          />
          {/* Grand Gateway Arch Cutout */}
          <path
            d="M 275 620 L 275 555 Q 300 528 325 555 L 325 620 Z"
            fill="#09140F"
          />
          {/* Upper Balcony Band */}
          <rect x="240" y="514" width="120" height="7" fill="#1C382C" rx="1" />
          <rect x="248" y="495" width="104" height="20" fill="url(#silhouetteGrad)" />
          {/* Central Dome Silhouette */}
          <path
            d="M 285 495 Q 300 480 315 495 Z"
            fill="#1C382C"
          />

          {/* 4 Iconic Slender Minarets */}
          {/* Left Outer Minaret */}
          <path d="M 238 620 L 238 460 L 250 460 L 250 620 Z" fill="#152B21" />
          <circle cx="244" cy="455" r="7" fill="#1C382C" />
          <path d="M 244 448 L 244 435" stroke="#C9A227" strokeWidth="1.5" />

          {/* Left Inner Minaret Shaft */}
          <path d="M 265 495 L 265 450 L 273 450 L 273 495 Z" fill="#1C382C" />
          <circle cx="269" cy="446" r="4.5" fill="#152B21" />

          {/* Right Inner Minaret Shaft */}
          <path d="M 327 495 L 327 450 L 335 450 L 335 495 Z" fill="#1C382C" />
          <circle cx="331" cy="446" r="4.5" fill="#152B21" />

          {/* Right Outer Minaret */}
          <path d="M 350 620 L 350 460 L 362 460 L 362 620 Z" fill="#152B21" />
          <circle cx="356" cy="455" r="7" fill="#1C382C" />
          <path d="M 356 448 L 356 435" stroke="#C9A227" strokeWidth="1.5" />

          {/* Flickering Golden Windows & Jali Balconies */}
          <rect x="254" y="500" width="6" height="10" rx="2" fill="url(#windowGlow)" className="window-flicker window-1" />
          <rect x="270" y="500" width="6" height="10" rx="2" fill="url(#windowGlow)" className="window-flicker window-2" />
          <rect x="286" y="500" width="6" height="10" rx="2" fill="url(#windowGlow)" className="window-flicker window-3" />
          <rect x="308" y="500" width="6" height="10" rx="2" fill="url(#windowGlow)" className="window-flicker window-1" />
          <rect x="324" y="500" width="6" height="10" rx="2" fill="url(#windowGlow)" className="window-flicker window-2" />
          <rect x="340" y="500" width="6" height="10" rx="2" fill="url(#windowGlow)" className="window-flicker window-3" />

          {/* Clock face hint */}
          <circle cx="300" cy="510" r="4" fill="#FFEAA7" opacity="0.85" />
        </g>

        {/* Landmark 3: Hussain Sagar Buddha Statue (Right Region: x=430 to x=560) */}
        <g className="landmark-buddha" id="landmark-buddha">
          {/* Water Base (Hussain Sagar Lake) */}
          <rect x="420" y="605" width="165" height="40" fill="url(#waterGrad)" />
          {/* Water Ripple Reflections */}
          <line x1="430" y1="612" x2="480" y2="612" stroke="#254D46" strokeWidth="1.5" strokeDasharray="6 8" />
          <line x1="470" y1="618" x2="540" y2="618" stroke="#1D3E38" strokeWidth="1.5" strokeDasharray="10 6" />
          <line x1="440" y1="624" x2="510" y2="624" stroke="#254D46" strokeWidth="1.5" strokeDasharray="8 8" />

          {/* Lotus Platform / Gibraltar Rock Pedestal */}
          <path
            d="M 465 605 L 535 605 L 530 588 L 470 588 Z"
            fill="#12251D"
          />
          <path
            d="M 470 588 Q 500 582 530 588 L 525 582 L 475 582 Z"
            fill="#193328"
          />

          {/* Standing Monolithic Buddha Statue Silhouette */}
          {/* Robe & Torso */}
          <path
            d="M 488 582 L 484 535 Q 492 515 500 515 Q 508 515 516 535 L 512 582 Z"
            fill="url(#silhouetteGrad)"
          />
          {/* Abhaya Mudra Right Hand Raised */}
          <path
            d="M 515 532 Q 524 528 522 520 Q 519 517 514 522"
            stroke="#193328"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Hand Holding Robe */}
          <path
            d="M 485 536 Q 478 545 486 550"
            stroke="#193328"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Buddha Head & Usnisa */}
          <circle cx="500" cy="505" r="9" fill="#1C382C" />
          <ellipse cx="500" cy="495" rx="3.5" ry="3" fill="#1C382C" />
          {/* Aura/Halo behind Head */}
          <circle cx="500" cy="505" r="14" fill="#C9A227" opacity="0.25" />
        </g>

        {/* 8. Animated Dashed Route Line (Marching Ants connecting 3 landmarks) */}
        <g className="route-connecting-line">
          {/* Faint Guide Trail */}
          <path
            d="M 105 535 Q 190 480 270 500 T 500 505"
            stroke="rgba(201, 162, 39, 0.25)"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Animated Marching Ants Gold Dashed Path */}
          <path
            className="marching-ants-path"
            d="M 105 535 Q 190 480 270 500 T 500 505"
            stroke="url(#routeGold)"
            strokeWidth="3"
            strokeDasharray="7 6"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* 9. Pulsing Waypoint Pins & Landmark Badges */}

        {/* Pin 1: Golconda Fort (x=105, y=535) */}
        <g className="waypoint-pin-group pin-golconda" transform="translate(105, 535)">
          <circle cx="0" cy="0" r="12" className="pin-pulse-ring" fill="none" stroke="#C9A227" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="5" fill="#C9A227" />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />

          {/* Label Card */}
          <g transform="translate(-48, -32)">
            <rect width="96" height="22" rx="11" fill="rgba(15, 36, 26, 0.88)" stroke="#C9A227" strokeWidth="1" />
            <text x="48" y="14" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700" letterSpacing="0.4">
              Golconda Fort
            </text>
          </g>
        </g>

        {/* Pin 2: Charminar (x=300, y=490) */}
        <g className="waypoint-pin-group pin-charminar" transform="translate(300, 490)">
          <circle cx="0" cy="0" r="13" className="pin-pulse-ring delay-ring-1" fill="none" stroke="#C9A227" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="5" fill="#C9A227" />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />

          {/* Label Card */}
          <g transform="translate(-40, -32)">
            <rect width="80" height="22" rx="11" fill="rgba(15, 36, 26, 0.88)" stroke="#C9A227" strokeWidth="1" />
            <text x="40" y="14" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700" letterSpacing="0.4">
              Charminar
            </text>
          </g>
        </g>

        {/* Pin 3: Hussain Sagar Buddha (x=500, y=505) */}
        <g className="waypoint-pin-group pin-buddha" transform="translate(500, 505)">
          <circle cx="0" cy="0" r="12" className="pin-pulse-ring delay-ring-2" fill="none" stroke="#C9A227" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="5" fill="#C9A227" />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />

          {/* Label Card */}
          <g transform="translate(-62, -32)">
            <rect width="124" height="22" rx="11" fill="rgba(15, 36, 26, 0.88)" stroke="#C9A227" strokeWidth="1" />
            <text x="62" y="14" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700" letterSpacing="0.4">
              Hussain Sagar Buddha
            </text>
          </g>
        </g>

        {/* Bottom Silhouette Ground */}
        <rect x="0" y="620" width="600" height="180" fill="#08120E" />
      </svg>

      {/* Foreground Content Overlay */}
      <div className="dusk-story-overlay">
        {/* Brand Header */}
        <button
          type="button"
          className="dusk-brand-row"
          onClick={onBrandClick}
          aria-label="Explorex Home"
        >
          <div className="dusk-logo-mark">
            <Compass size={18} className="compass-sway" />
          </div>
          <span className="dusk-brand-name">
            Explore<strong>x</strong>
          </span>
          <span className="dusk-brand-badge">Telangana</span>
        </button>

        {/* Main Headline & Value Proposition */}
        <div className="dusk-copy-box">
          <span className="dusk-eyebrow">
            <Sparkles size={13} />
            <span>AI Travel Intelligence</span>
          </span>

          <h1 className="dusk-headline">
            Plan Hyderabad{' '}
            <br />
            <em>the way locals do.</em>
          </h1>

          <p className="dusk-subhead">
            Experience the City of Pearls through verified heritage wisdom, multimodal routes, and custom AI itineraries.
          </p>

          {/* Three Short Benefit Bullets */}
          <ul className="dusk-benefits-list">
            <li className="dusk-benefit-item">
              <div className="benefit-check-icon">
                <CheckCircle2 size={16} />
              </div>
              <div className="benefit-copy">
                <strong>400+ Verified Destinations</strong>
                <p>Authentic entry tickets in ₹, operating hours, photography rules, and heritage stays.</p>
              </div>
            </li>

            <li className="dusk-benefit-item">
              <div className="benefit-check-icon">
                <CheckCircle2 size={16} />
              </div>
              <div className="benefit-copy">
                <strong>Multimodal Route Planning</strong>
                <p>Walking heritage walks, cycling lanes, and driving routes with Google Maps navigation.</p>
              </div>
            </li>

            <li className="dusk-benefit-item">
              <div className="benefit-check-icon">
                <CheckCircle2 size={16} />
              </div>
              <div className="benefit-copy">
                <strong>Grounded Local AI Companion</strong>
                <p>Tailored 1-day plans, secret biryani spots, and crowd-free golden hours—never hallucinated.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Bottom Local Touch */}
        <div className="dusk-footer-quote">
          <span>“From Golconda’s whisper arches to Nimrah’s Irani Chai.”</span>
        </div>
      </div>
    </div>
  )
}
