import { Sparkles, Compass, CheckCircle2 } from 'lucide-react'

export default function HyderabadDuskScene({ onBrandClick }) {
  return (
    <div className="auth-dusk-scene" aria-label="Animated Indian Heritage Dusk Scene">
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
          {/* Deep India Twilight Gradient */}
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

          {/* Water Surface Gradient */}
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1A1E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#050C0E" stopOpacity="0.95" />
          </linearGradient>

          {/* Silhouette Gradient for Monuments */}
          <linearGradient id="silhouetteGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#162920" />
            <stop offset="100%" stopColor="#0B1510" />
          </linearGradient>

          {/* Window & Monument Glow */}
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
          <circle cx="485" cy="120" r="48" fill="url(#moonGlow)" />
          <circle cx="485" cy="120" r="24" fill="#FFFBE6" />
          <circle cx="478" cy="114" r="4" fill="#E8D9A2" opacity="0.45" />
          <circle cx="491" cy="123" r="5" fill="#E8D9A2" opacity="0.4" />
          <circle cx="481" cy="129" r="3" fill="#E8D9A2" opacity="0.35" />
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
            <rect x="65" y="440" width="12" height="18" rx="3" fill="#E5B232" opacity="0.85" />
            <circle cx="71" cy="449" r="3" fill="#FFF8D1" />
            <circle cx="71" cy="449" r="10" fill="#E5B232" opacity="0.25" />
          </g>
          <g className="lantern lantern-2">
            <rect x="180" y="380" width="10" height="15" rx="3" fill="#D49924" opacity="0.8" />
            <circle cx="185" cy="387" r="2.5" fill="#FFF8D1" />
            <circle cx="185" cy="387" r="8" fill="#D49924" opacity="0.22" />
          </g>
          <g className="lantern lantern-3">
            <rect x="330" y="420" width="14" height="20" rx="3" fill="#E5B232" opacity="0.9" />
            <circle cx="337" cy="430" r="3.5" fill="#FFF8D1" />
            <circle cx="337" cy="430" r="12" fill="#E5B232" opacity="0.3" />
          </g>
          <g className="lantern lantern-4">
            <rect x="460" y="370" width="11" height="16" rx="3" fill="#D49924" opacity="0.75" />
            <circle cx="465" cy="378" r="2.5" fill="#FFF8D1" />
            <circle cx="465" cy="378" r="9" fill="#D49924" opacity="0.2" />
          </g>
        </g>

        {/* 6. Distant Mountain & Fort Ridge Silhouette */}
        <path
          d="M 0 540 Q 60 510 130 525 Q 210 500 310 530 Q 420 495 520 525 Q 570 515 600 535 L 600 800 L 0 800 Z"
          fill="#0D1D16"
          opacity="0.9"
        />

        {/* 7. Layered Skyline: 5 Iconic Landmarks Across India */}

        {/* Landmark 1: Golconda Fort (Left: x=10 to x=125) */}
        <g className="landmark-golconda" id="landmark-golconda">
          <path
            d="M 10 620 L 25 565 L 35 565 L 35 572 L 45 572 L 45 555 L 55 555 L 55 572 L 65 572 L 65 540 L 85 540 L 85 530 L 100 530 L 100 545 L 115 545 L 115 570 L 125 570 L 125 620 Z"
            fill="url(#silhouetteGrad)"
          />
          <path d="M 70 540 L 80 540 L 80 528 Q 75 520 70 528 Z" fill="#10221A" />
          <path d="M 72 535 Q 75 530 78 535 L 78 540 L 72 540 Z" fill="#08120E" />
          <path d="M 38 580 Q 42 574 46 580" stroke="#254335" strokeWidth="1.2" fill="none" />
          <rect x="68" y="555" width="4" height="6" rx="1" fill="url(#windowGlow)" className="window-flicker window-1" />
        </g>

        {/* Landmark 2: Charminar (x=140 to x=230) */}
        <g className="landmark-charminar" id="landmark-charminar">
          <path d="M 148 620 L 148 530 L 222 530 L 222 620 Z" fill="url(#silhouetteGrad)" />
          {/* Main Arch cutout */}
          <path d="M 168 620 L 168 560 Q 185 538 202 560 L 202 620 Z" fill="#09140F" />
          {/* Balcony */}
          <rect x="144" y="525" width="82" height="5" fill="#1C382C" rx="1" />
          <rect x="150" y="510" width="70" height="15" fill="url(#silhouetteGrad)" />
          <path d="M 175 510 Q 185 498 195 510 Z" fill="#1C382C" />
          {/* Minarets */}
          <path d="M 144 620 L 144 475 L 152 475 L 152 620 Z" fill="#152B21" />
          <circle cx="148" cy="471" r="5" fill="#1C382C" />
          <path d="M 148 466 L 148 456" stroke="#C9A227" strokeWidth="1.2" />

          <path d="M 218 620 L 218 475 L 226 475 L 226 620 Z" fill="#152B21" />
          <circle cx="222" cy="471" r="5" fill="#1C382C" />
          <path d="M 222 466 L 222 456" stroke="#C9A227" strokeWidth="1.2" />
          {/* Windows */}
          <rect x="158" y="515" width="4" height="7" rx="1" fill="url(#windowGlow)" className="window-flicker window-2" />
          <rect x="183" y="515" width="4" height="7" rx="1" fill="url(#windowGlow)" className="window-flicker window-3" />
          <rect x="208" y="515" width="4" height="7" rx="1" fill="url(#windowGlow)" className="window-flicker window-1" />
        </g>

        {/* Landmark 3: Hussain Sagar Buddha (Center: x=270 to x=340) */}
        <g className="landmark-buddha" id="landmark-buddha">
          {/* Water Base */}
          <rect x="260" y="605" width="90" height="40" fill="url(#waterGrad)" />
          <line x1="268" y1="612" x2="310" y2="612" stroke="#254D46" strokeWidth="1.2" strokeDasharray="5 6" />
          <line x1="295" y1="618" x2="340" y2="618" stroke="#1D3E38" strokeWidth="1.2" strokeDasharray="8 5" />
          {/* Rock Platform */}
          <path d="M 285 605 L 325 605 L 322 590 L 288 590 Z" fill="#12251D" />
          {/* Robe & Torso */}
          <path d="M 298 590 L 295 545 Q 305 525 315 545 L 312 590 Z" fill="url(#silhouetteGrad)" />
          {/* Buddha Head */}
          <circle cx="305" cy="520" r="7" fill="#1C382C" />
          <ellipse cx="305" cy="512" rx="2.5" ry="2" fill="#1C382C" />
          <circle cx="305" cy="520" r="11" fill="#C9A227" opacity="0.25" />
        </g>

        {/* Landmark 4: Gateway of India, Mumbai (x=370 to x=465) */}
        <g className="landmark-gateway" id="landmark-gateway">
          {/* Basalt Arch Body */}
          <path d="M 375 620 L 375 540 L 460 540 L 460 620 Z" fill="url(#silhouetteGrad)" />
          {/* Central Tripartite Archway Cutout */}
          <path d="M 403 620 L 403 562 Q 417.5 542 432 562 L 432 620 Z" fill="#09140F" />
          {/* Left Side Arch Cutout */}
          <path d="M 382 620 L 382 580 Q 389 570 396 580 L 396 620 Z" fill="#09140F" />
          {/* Right Side Arch Cutout */}
          <path d="M 439 620 L 439 580 Q 446 570 453 580 L 453 620 Z" fill="#09140F" />
          {/* Attic Cornice & Parapet */}
          <rect x="372" y="534" width="91" height="6" fill="#1C382C" rx="1" />
          <rect x="382" y="522" width="71" height="12" fill="url(#silhouetteGrad)" />
          {/* Corner Turrets / Chhatris */}
          <path d="M 374 534 L 374 515 L 380 515 L 380 534 Z" fill="#152B21" />
          <circle cx="377" cy="512" r="3" fill="#C9A227" />
          <path d="M 455 534 L 455 515 L 461 515 L 461 534 Z" fill="#152B21" />
          <circle cx="458" cy="512" r="3" fill="#C9A227" />
          {/* Subtle Window Glow in Attic */}
          <rect x="412" y="526" width="11" height="5" rx="1" fill="url(#windowGlow)" className="window-flicker window-2" />
        </g>

        {/* Landmark 5: Taj Mahal, Agra (x=480 to x=595) */}
        <g className="landmark-taj" id="landmark-taj">
          {/* Marble Plinth */}
          <rect x="495" y="605" width="85" height="15" fill="#12251D" />
          {/* Main Tomb Body */}
          <path d="M 505 605 L 505 540 L 570 540 L 570 605 Z" fill="url(#silhouetteGrad)" />
          {/* Central Grand Iwan Portal Cutout */}
          <path d="M 524 605 L 524 555 Q 537.5 540 551 555 L 551 605 Z" fill="#09140F" />
          {/* Iconic High Marble Central Dome */}
          <path
            d="M 522 540 C 522 505, 537.5 480, 537.5 480 C 537.5 480, 553 505, 553 540 Z"
            fill="url(#silhouetteGrad)"
          />
          {/* Lotus Finial Spike */}
          <path d="M 537.5 480 L 537.5 464" stroke="#C9A227" strokeWidth="1.5" />
          <circle cx="537.5" cy="463" r="2" fill="#FFEAA7" />
          {/* Flanking Small Chhatris */}
          <path d="M 514 540 L 514 525 L 521 525 L 521 540 Z" fill="#1C382C" />
          <path d="M 513 525 Q 517.5 518 522 525 Z" fill="#FFEAA7" opacity="0.6" />
          <path d="M 554 540 L 554 525 L 561 525 L 561 540 Z" fill="#1C382C" />
          <path d="M 553 525 Q 557.5 518 562 525 Z" fill="#FFEAA7" opacity="0.6" />
          {/* 4 Corner Slender Minarets */}
          {/* Left Minaret */}
          <path d="M 488 620 L 493 500 L 497 500 L 500 620 Z" fill="#152B21" />
          <circle cx="495" cy="496" r="3.5" fill="#1C382C" />
          <path d="M 495 492 L 495 485" stroke="#C9A227" strokeWidth="1" />
          {/* Right Minaret */}
          <path d="M 575 620 L 578 500 L 582 500 L 587 620 Z" fill="#152B21" />
          <circle cx="580" cy="496" r="3.5" fill="#1C382C" />
          <path d="M 580 492 L 580 485" stroke="#C9A227" strokeWidth="1" />
          {/* Golden Tomb Glow */}
          <circle cx="537.5" cy="565" r="5" fill="url(#windowGlow)" className="window-flicker window-3" />
        </g>

        {/* 8. Marching Ants Route Connecting All 5 Landmarks */}
        <g className="route-connecting-line">
          <path
            d="M 70 540 C 130 500, 140 505, 185 510 C 240 515, 270 515, 305 520 C 350 525, 380 525, 420 530 C 470 535, 500 485, 538 490"
            stroke="rgba(201, 162, 39, 0.25)"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            className="marching-ants-path"
            d="M 70 540 C 130 500, 140 505, 185 510 C 240 515, 270 515, 305 520 C 350 525, 380 525, 420 530 C 470 535, 500 485, 538 490"
            stroke="url(#routeGold)"
            strokeWidth="3"
            strokeDasharray="7 6"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* 9. Pulsing Waypoint Pins & Landmark Badges */}

        {/* Pin 1: Golconda Fort (x=70, y=540) */}
        <g className="waypoint-pin-group pin-golconda" transform="translate(70, 540)">
          <circle cx="0" cy="0" r="10" className="pin-pulse-ring" fill="none" stroke="#C9A227" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#C9A227" />
          <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
          <g transform="translate(-40, -28)">
            <rect width="80" height="20" rx="10" fill="rgba(15, 36, 26, 0.9)" stroke="#C9A227" strokeWidth="1" />
            <text x="40" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700">
              Golconda Fort
            </text>
          </g>
        </g>

        {/* Pin 2: Charminar (x=185, y=510) */}
        <g className="waypoint-pin-group pin-charminar" transform="translate(185, 510)">
          <circle cx="0" cy="0" r="11" className="pin-pulse-ring delay-ring-1" fill="none" stroke="#C9A227" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#C9A227" />
          <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
          <g transform="translate(-36, -28)">
            <rect width="72" height="20" rx="10" fill="rgba(15, 36, 26, 0.9)" stroke="#C9A227" strokeWidth="1" />
            <text x="36" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700">
              Charminar
            </text>
          </g>
        </g>

        {/* Pin 3: Buddha Statue (x=305, y=520) */}
        <g className="waypoint-pin-group pin-buddha" transform="translate(305, 520)">
          <circle cx="0" cy="0" r="10" className="pin-pulse-ring delay-ring-2" fill="none" stroke="#C9A227" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#C9A227" />
          <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
          <g transform="translate(-48, -28)">
            <rect width="96" height="20" rx="10" fill="rgba(15, 36, 26, 0.9)" stroke="#C9A227" strokeWidth="1" />
            <text x="48" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700">
              Buddha Statue
            </text>
          </g>
        </g>

        {/* Pin 4: Gateway of India (x=420, y=530) */}
        <g className="waypoint-pin-group pin-gateway" transform="translate(420, 530)">
          <circle cx="0" cy="0" r="11" className="pin-pulse-ring delay-ring-1" fill="none" stroke="#C9A227" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#C9A227" />
          <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
          <g transform="translate(-46, -28)">
            <rect width="92" height="20" rx="10" fill="rgba(15, 36, 26, 0.9)" stroke="#C9A227" strokeWidth="1" />
            <text x="46" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700">
              Gateway of India
            </text>
          </g>
        </g>

        {/* Pin 5: Taj Mahal (x=538, y=490) */}
        <g className="waypoint-pin-group pin-taj" transform="translate(538, 490)">
          <circle cx="0" cy="0" r="12" className="pin-pulse-ring delay-ring-2" fill="none" stroke="#C9A227" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#C9A227" />
          <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
          <g transform="translate(-38, -28)">
            <rect width="76" height="20" rx="10" fill="rgba(15, 36, 26, 0.9)" stroke="#C9A227" strokeWidth="1" />
            <text x="38" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700">
              Taj Mahal
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
          <span className="dusk-brand-badge">All-India Heritage</span>
        </button>

        {/* Main Headline & Value Proposition */}
        <div className="dusk-copy-box">
          <span className="dusk-eyebrow">
            <Sparkles size={13} />
            <span>AI Travel Intelligence</span>
          </span>

          <h1 className="dusk-headline">
            Plan India{' '}
            <br />
            <em>the way locals do.</em>
          </h1>

          <p className="dusk-subhead">
            Experience timeless monuments across India through verified heritage facts, uninvented ticket fees in ₹, multimodal routes, and custom AI itineraries.
          </p>

          {/* Three Short Benefit Bullets */}
          <ul className="dusk-benefits-list">
            <li className="dusk-benefit-item">
              <div className="benefit-check-icon">
                <CheckCircle2 size={16} />
              </div>
              <div className="benefit-copy">
                <strong>400+ Verified Monuments Across 28 States &amp; 8 UTs</strong>
                <p>Official ASI admission fees in ₹, photography guidelines, operating hours, and heritage stays.</p>
              </div>
            </li>

            <li className="dusk-benefit-item">
              <div className="benefit-check-icon">
                <CheckCircle2 size={16} />
              </div>
              <div className="benefit-copy">
                <strong>Proximity-Optimized Route Planning</strong>
                <p>Day-by-day itineraries sequenced by travel proximity with lunch midpoints and Google Maps navigation.</p>
              </div>
            </li>

            <li className="dusk-benefit-item">
              <div className="benefit-check-icon">
                <CheckCircle2 size={16} />
              </div>
              <div className="benefit-copy">
                <strong>Zero-Hallucination AI Companion</strong>
                <p>Retrieved from official cultural datasets with transparent citations—never inventing facts or prices.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Bottom Local Touch */}
        <div className="dusk-footer-quote">
          <span>“From Golconda’s whisper arches to the Taj Mahal’s marble dawn.”</span>
        </div>
      </div>
    </div>
  )
}
