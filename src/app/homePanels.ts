import type { HomeTabId, HomeTabPanel } from "./homeTypes";

export const TAB_PANELS: Record<HomeTabId, HomeTabPanel> = {
  projects: {
    heading: "Projects",
    layout: "cards",
    cards: [
      {
        title: "P2 Market",
        subtitle: "A peer-to-peer marketplace powered by smart contracts and stablecoins. eBay charges a ~15% fee on sales, while we do a flat 2% fee, undercutting even payment processors. Many AI integrations added into the marketplace, including fully automated yield.",
        cta: "Visit Project",
        badges: ["Founder", "Open Source", "For Community", "Passion Project"],
        href: "https://p2.market/",
        imageSrc: "/previews/p2-market-real.png",
        imageAlt: "P2 Market project preview",
      },
      {
        title: "Visarely Punks",
        subtitle:
          "My own NFT collection, launched in 2022 on Base. A fully onchain generative art collection blending Vasarely-inspired optical patterns and punk aesthetics.",
        cta: "Visit Project",
        badges: ["Archived", "Deprecated", "Passion Project"],
        href: "https://visarelypunks.fun/",
        imageSrc: "/previews/visarely-punks-real.png",
        imageAlt: "Visarely Punks project preview",
      },
      {
        title: "NFT Museum",
        subtitle: "A personal digital art collection featuring meaningful crypto art and NFT works.",
        cta: "Visit Project",
        badges: ["For Fun"],
        href: "https://my-nft-museum.vercel.app/",
        imageSrc: "/previews/nft-museum-real.png",
        imageAlt: "NFT Museum project preview",
      },
    ],
  },
  bio: {
    heading: "Bio Trail",
    layout: "bio",
    bioSteps: [
      {
        period: "Start",
        title: "Born in San Diego",
        details: "Go Padres!!!",
        logoSrc: "/gallery/san-diego-map.png",
        logoAlt: "Map showing San Diego location",
      },
      {
        period: "2020",
        title: "Graduated from New York University",
        details: "Completed a Bachelor's in Computer Science.",
        logoSrc: "/logos/nyu-real.png",
        logoAlt: "NYU logo",
        href: "https://www.nyu.edu/",
        linkLabel: "Visit website",
      },
      {
        period: "2020",
        title: "Worked on GM's largest assembly line",
        details: "Directly helped manufacture over 30,000 vehicles.",
        logoSrc: "/logos/gm-real.svg",
        logoAlt: "GM logo",
        href: "https://www.gm.com/",
        linkLabel: "Visit website",
      },
      {
        period: "2021-2022",
        title: "Lead instructor at ChainShot",
        details: "Taught smart contract development in ChainShot's Ethereum developer bootcamp.",
        logoSrc: "/logos/chainshot-real.png",
        logoAlt: "ChainShot logo",
        href: "https://www.chainshot.com/",
        linkLabel: "Visit website",
      },
      {
        period: "Aug 2022",
        title: "ChainShot acquired by Alchemy",
        details: "Transitioned into Alchemy's expanding education ecosystem.",
        logoSrc: "/logos/alchemy-real.png",
        logoAlt: "Alchemy logo",
        href: "https://www.alchemy.com/",
        linkLabel: "Visit website",
        secondaryHref:
          "https://www.coindesk.com/business/2022/08/25/alchemy-acquires-web3-educational-platform-chainshot-to-onboard-developers",
        secondaryLabel: "Acquisition announcement",
      },
      {
        period: "2022-2023",
        title: "Product, Education, and Community Lead @ Alchemy University",
        details: "DevRel and Full Stack Engineer focused on curriculum and developer growth.",
        logoSrc: "/logos/alchemy-university-real.png",
        logoAlt: "Alchemy University logo",
        href: "https://www.alchemy.com/university",
        linkLabel: "Visit website",
      },
      {
        period: "2023-2024",
        title: "Senior Ecosystem Growth Manager @ Circle",
        details: "Drove ecosystem strategy and community growth initiatives.",
        logoSrc: "/logos/circle-real.png",
        logoAlt: "Circle logo",
        href: "https://www.circle.com/",
        linkLabel: "Visit website",
      },
      {
        period: "2024-Current",
        title: "Senior DevRel Engineer @ Alchemy",
        details:
          "Returned to Alchemy after Circle to lead education and developer relations initiatives.",
        logoSrc: "/logos/alchemy-real.png",
        logoAlt: "Alchemy logo",
        href: "https://www.alchemy.com/",
        linkLabel: "Visit website",
      },
    ],
  },
  gallery: {
    heading: "Gallery",
    layout: "cards",
    cards: [
      {
        title: "ChainShot Dev Workshop in Amsterdam 🇳🇱",
        subtitle:
          "Live smart contract session on stage, teaching developers through practical code walkthroughs.",
        cta: "View Photo",
        imageSrc: "/gallery/chainshot-stage-talk.png",
        imageAlt: "Alvaro speaking on a ChainShot stage",
      },
      {
        title: "ETH SD x Alchemy",
        subtitle:
          "ETH SD community event with Alchemy.",
        cta: "View Photo",
        imageSrc: "/gallery/alchemy-team-group.png",
        imageAlt: "Alchemy team group photo",
      },
      {
        title: "Swag I Designed",
        subtitle:
          "A collection of Circle and USDC swag that I personally designed. Merch is super important.",
        cta: "View Photo",
        imageSrc: "/gallery/circle-swag-collection.png",
        imageAlt: "Circle and USDC branded apparel",
      },
      {
        title: "Dev Workshop in Austin, TX 🇺🇸",
        subtitle:
          "Workshop board at a live event featuring my cross-chain USDC and CCTP presentation session.",
        cta: "View Photo",
        imageSrc: "/gallery/upnext-workshop-board.png",
        imageAlt: "UP NEXT workshop display featuring Alvaro",
      },
      {
        title: "Studio Days with Niko the Cat",
        subtitle:
          "Behind-the-scenes workspace moment where design, development, and cat supervision all happen.",
        cta: "View Photo",
        imageSrc: "/gallery/studio-cat-desk.png",
        imageAlt: "Studio desk with cat and laptop",
      },
      {
        title: "ETH SD Conversation Night",
        subtitle:
          "Recorded a conversation with ETH SD about my journey in the web3 x education space. See it in the 'My Content' tab!",
        cta: "View Photo",
        imageSrc: "/gallery/eth-sd-speaker-session.png",
        imageAlt: "ETH SD event discussion on stage",
      },
      {
        title: "Converge Stage Session in San Francisco, CA 🇺🇸",
        subtitle:
          "On-stage at Converge discussing blockchain 101, developer education and practical Alchemy product integrations.",
        cta: "View Photo",
        imageSrc: "/gallery/converge-stage-circle.png",
        imageAlt: "Alvaro standing on a conference stage at Converge",
      },
      {
        title: "Table I Made",
        subtitle:
          "I was given access to a CNC machine and made this table for my apartment. I 3D printed the purple nuts and bolts.",
        cta: "View Photo",
        imageSrc: "/gallery/red-campus-sculpture.png",
        imageAlt: "Red geometric sculpture near a staircase and walkway",
      },
      {
        title: "GM Assembly Line",
        subtitle:
          "Hands-on production floor moment from my time supporting GM's largest assembly line operations.",
        cta: "View Photo",
        imageSrc: "/gallery/gm-assembly-line-floor.png",
        imageAlt: "Alvaro standing on a GM assembly line floor",
      },
      {
        title: "Blockchain Lab @ NYU Ad",
        subtitle:
          "Early campus community-building days for blockchain education and student meetups.",
        cta: "View Photo",
        imageSrc: "/gallery/nyu-blockchain-lab-board.png",
        imageAlt: "Blockchain Lab at NYU poster pinned on a board",
      },
      {
        title: "Hackathon Winners in Buenos Aires, Argentina 🇦🇷",
        subtitle:
          "Represented Circle at a hackathon in Buenos Aires, Argentina 🇦🇷. Celebrating builder wins and bounties with teams after an intense 3-day hackathon.",
        cta: "View Photo",
        imageSrc: "/gallery/hackathon-winners-circle-bounty.png",
        imageAlt: "Hackathon winners posing in front of Circle bounty board",
      },
      {
        title: "Hackathon Live Pitch in Buenos Aires, Argentina 🇦🇷",
        subtitle:
          "Presenting live to a packed room of builders, mentors, and judges during demo day.",
        cta: "View Photo",
        imageSrc: "/gallery/hackathon-live-pitch-audience.png",
        imageAlt: "Large audience watching a hackathon presentation",
      },
      {
        title: "Circle Bounties Deep Dive in Buenos Aires, Argentina 🇦🇷",
        subtitle:
          "Walking teams through Circle bounty tracks and product ideas during the event briefing.",
        cta: "View Photo",
        imageSrc: "/gallery/hackathon-circle-bounties-slide.png",
        imageAlt: "Presentation slide showing Circle bounties and ideas",
      },
    ],
  },
  "my-content": {
    heading: "My Content",
    layout: "content",
    contentSections: [
      {
        title: "Video Content",
        items: [
          {
            title: "Fixing Web3 UX: Intro to Account Abstraction & Smart Contract Wallets",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/FctCx7TMRNc?si=Uq0qgjz0vmRjY5b2",
            kind: "video",
          },
          {
            title: "Why Should I Learn Ethereum? - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/2-J2yKHbV-w?si=OnkwUfIo06PQS3Qm",
            kind: "video",
          },
          {
            title: "Why Should I Learn JavaScript? - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/y9qdi94bSC0?si=F1FFgRGMojzblJdb",
            kind: "video",
          },
          {
            title: "Tree Data Structures - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/TiI__G0y784?si=KAnbYLkXMvGLfRyD",
            kind: "video",
          },
          {
            title: "What is Proof of Work & Mining? - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/jNFwAKjMA44?si=0kiBM6m0Hia6IofO",
            kind: "video",
          },
          {
            title: "Structure of Blockchain Networks - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/c-7yr18YtUk?si=K85pNm-HDcFnh2lD",
            kind: "video",
          },
          {
            title: "Merkle Trees Are Efficient! - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/Ne8dRUlA0nY?si=XM37Q0zOq1hRq6NY",
            kind: "video",
          },
          {
            title: "How to Interact with a Smart Contract (FROM SCRATCH!) - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/tpGbvmp_OXY?si=WCHhwnHIfeiwMosA",
            kind: "video",
          },
          {
            title: "How to unit test a smart contract using Hardhat - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/4kLA7Z6dP34?si=3q1ODblqIwH4Evcf",
            kind: "video",
          },
          {
            title: "How to Write, Compile & Deploy a Smart Contract using Hardhat - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/dgdTyTl2Z18?si=Zh3oEvAhpUFq_fSs",
            kind: "video",
          },
          {
            title: "How do Bitcoin and Ethereum keep track of balances? - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/Bag7r-g6ebY?si=O_jcFo5HZVb3cdjh",
            kind: "video",
          },
          {
            title: "How to Query the DAI Smart Contract - Alchemy University",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/G1xitnVgLPU?si=5l7-FH2yaOLDMJ8j",
            kind: "video",
          },
          {
            title: "The Basics of Web3",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/L57DNTdR7y0?si=uEtwH0ZAlvjXZJKG",
            kind: "video",
          },
          {
            title: "ETH SD Podcast - Scaling Web3 Education w/ Al Luken",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/hF9Say9mfzc?si=hp0hRAR9MZCdhO0P",
            kind: "video",
          },
          {
            title: "How to get started with Alchemy Custom Webhooks in 3 minutes",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/hM1cf_7O2VY?si=6KwxkeilZ7BQJ-R8",
            kind: "video",
          },
          {
            title: "Solidity and Smart Contracts - Converge22",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/w2ifyzrMm1M?si=rkgZ73oL7e0iJxvo",
            kind: "video",
          },
          {
            title: "Demo: Build a USDC token gated dApp with Alchemy",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/egNiOmRAuU8?si=NJC1qs58phO5_cg6",
            kind: "video",
          },
          {
            title: "Web3 EXP",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://www.youtube.com/live/NuGF1wsYxQA?si=Fs9TPvDdppzDfaXL",
            kind: "video",
          },
          {
            title: "How to Set Up A Front-end w/ React-Vite-ChakraUI + Alchemy SDK",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://www.youtube.com/live/-XrFYEdV-vY?si=PXdM_vU_rU_vGPG7",
            kind: "video",
          },
          {
            title: "How to Build a Thriving Web3 Community",
            subtitle: "Developer content from my YouTube series and talks.",
            href: "https://youtu.be/NGF8VPYY_LM?si=adOfWRQqLY8DFU-2",
            kind: "video",
          },
        ],
      },
      {
        title: "Written Content",
        items: [
          {
            title: "Add Alchemy RPC To Any Project using Cursor",
            subtitle: "Server-safe RPC proxy setup with chain-aware routing.",
            href: "https://www.alchemy.com/docs/add-alchemy-rpc-to-any-project",
            kind: "article",
          },
          {
            title: "Build a Web3 Dashboard using Cursor",
            subtitle: "Prompt-driven workflow to scaffold and ship a data dashboard.",
            href: "https://www.alchemy.com/docs/web3-dashboard-prompt",
            kind: "article",
          },
          {
            title: "Alchemy Data APIs Explained using Cursor",
            subtitle: "Practical breakdown of Transfers, Token, Prices, and Portfolio APIs.",
            href: "https://www.alchemy.com/docs/data-apis-with-cursor",
            kind: "article",
          },
          {
            title: "Alchemy MCP Server Guide",
            subtitle: "How to integrate and use Alchemy MCP capabilities in Cursor workflows.",
            href: "https://www.alchemy.com/docs/alchemy-mcp-server",
            kind: "article",
          },
          {
            title: "All You Ever Wanted to Learn About the Ethereum Merge",
            subtitle: "A full technical context guide to Ethereum's PoS transition.",
            href: "https://coinmarketcap.com/academy/article/all-you-ever-wanted-to-learn-about-the-ethereum-merge",
            kind: "article",
          },
          {
            title: "Technical Walkthrough of EIP-1559",
            subtitle: "Deep dive on base fee mechanics, burn model, and fee market changes.",
            href: "https://coinmarketcap.com/academy/article/technical-walkthrough-of-eip-1559",
            kind: "article",
          },
          {
            title: "How Does Aave Work?",
            subtitle: "Clear explainer on lending pools, over-collateralized borrowing, and risk.",
            href: "https://coinmarketcap.com/academy/article/how-does-aave-work",
            kind: "article",
          },
          {
            title: "How to Set Up an ETH 2.0 Validator (Goerli)",
            subtitle: "Step-by-step validator setup flow and operational guidance.",
            href: "https://coinmarketcap.com/academy/article/how-to-set-up-an-eth-2-0-validator-on-goerli-testnet",
            kind: "article",
          }
        ],
      },
    ],
  },
  resume: {
    heading: "Current Resume",
    layout: "cards",
    cards: [
      {
        title: "Product + Creative Lead",
        subtitle: "Cross-functional direction from concept to launch.",
        cta: "Read Experience",
      },
      {
        title: "Design Systems",
        subtitle: "Scalable UI architecture and brand consistency.",
        cta: "Review Skills",
      },
      {
        title: "Engineering Stack",
        subtitle: "TypeScript, React, Next.js, and real-time interactive UI.",
        cta: "Open Tech Snapshot",
      },
      {
        title: "Teaching & Mentorship",
        subtitle: "Workshops, curriculum, and student outcomes.",
        cta: "See Teaching Work",
      },
    ],
  },
  contact: {
    heading: "Contact",
    layout: "cards",
    cards: [
      {
        title: "Send a Message",
        subtitle: "Use this in-page form for project inquiries, collaborations, or opportunities.",
        cta: "Send",
        kind: "contact-form",
      },
      {
        title: "X",
        subtitle: "Thoughts on products, culture, creative work, and in-progress experiments.",
        cta: "Open X",
        href: "https://x.com/punk6068",
        logoSrc: "/logos/x-real.png",
        logoAlt: "X logo",
      },
      {
        title: "GitHub",
        subtitle: "Code samples, repos, side projects, and in-progress open-source experiments.",
        cta: "Open GitHub",
        href: "https://github.com/AlvaroLuken",
        logoSrc: "/logos/github-real.svg",
        logoAlt: "GitHub logo",
      },
      {
        title: "LinkedIn",
        subtitle: "Professional profile, recent work highlights, and recommendations.",
        cta: "Open LinkedIn",
        href: "https://www.linkedin.com/in/alvaro-luken/",
        logoSrc: "/logos/linkedin.svg",
        logoAlt: "LinkedIn logo",
      },
    ],
  },
};
