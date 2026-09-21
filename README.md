# pagewise · MVP design

Clickable prototype for the pagewise MVP ad test: a site owner checks whether ChatGPT recommends their business, gets ready-written text to add, decides, pastes it into their own site, and checks again to see if it worked.

- **Live prototype:** https://belendali.github.io/pagewise-mvp-design/
- **Product spec (build from this):** [SPEC.md](SPEC.md)
- **Figma flow board:** https://www.figma.com/design/7l0mqLoO0VOp1o4416Amgh → **V3.0** (flow board) and **V3.1** (native design + components)

## Flow

What the MVP tests: will site owners try an SEO/GEO tool through a **dashboard + conversation** interface?

1. **Landing** — enter a website URL, "Check for free". The four-step explainer is interactive and uses the same components as the product.
2. **Three-step free check** (no sign-up): read the site → confirm what we understood → pick the questions customers ask AI → checking, 10 questions.
3. **Create workspace** — sign up only after the first result exists (Google or email link, simulated here).
4. **Workspace** — dashboard on the left, chat on the right:
   - Left: checks (manual, plus an optional auto-check), two metrics (brand mentioned / site cited), every issue with its status and a progress strip, and the "coming soon" dashboards.
   - Right: the chat for the selected issue. A dropdown at the top switches chats.
5. **One issue = one chat.** Each thing we found is one row on the left and one chat on the right; click a row and the chat switches to it. A later check that finds something new on the same page opens a *new* issue and a *new* chat. Whole-site questions get their own chat.
6. **Decide → paste → check again.** *Use this* saves a draft (never publishes), then three steps: copy, paste into your page, tell us it's live. The next check reports back in the same chat, with a before/after.
7. **Change the site** from the project menu — the URL people type on the landing page is often wrong.

Rank tracking, site audit, content briefs, CMS publishing, multiple sites and teammates are visible but marked **Coming soon** on purpose.

## Try it

Use the **Prototype** button (bottom-left inside the app) to jump to any state — first check, adopted, live, second check, the tour — and to switch between English and 中文. UI defaults to English.

## Notes

- The demo uses answerai.pro as the example site. Page copy is from its public site, but every check result, ChatGPT answer, suggestion and metric is **made-up example data, not a real measurement**. Typing any other URL still runs the same sample, and the prototype says so.
- Nothing is sent anywhere; sign-up is simulated.
- Single self-contained `index.html` (fonts from Google Fonts), no build step. `opcmaster-loop.html` is the same file under its working name.
- MVP scope: publishing is manual (copy → paste → "It's on my site"); no CMS connection yet.
