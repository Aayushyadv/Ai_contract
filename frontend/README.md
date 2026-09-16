# ContractAI — React Frontend

## Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5173 and proxies `/api/*` to the FastAPI backend
at http://localhost:8000 (see `vite.config.js`). Start the backend first
(see `../backend/README.md`).

## Structure

```
src/
├── api/api.js              # Axios client for all backend calls
├── components/             # Navbar, Sidebar, UploadBox, ProcessingPipeline,
│                            # EntityCard, ClauseCard, RiskCard, RiskSummary,
│                            # ChatBox, EvidenceCard, StatCard
├── pages/                  # Dashboard, Analyze, Results, History
├── App.jsx                 # Router + layout shell
└── main.jsx
```

## Flow

Dashboard -> Analyze (upload, watch pipeline stages) -> Results (risk score,
clause explorer, entities, ask-the-contract chat with evidence) -> History
(past analyses, re-open any of them).
