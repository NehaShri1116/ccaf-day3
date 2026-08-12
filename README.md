# Assignment 5 — Sipcode Implementation

> ⚠️ **Not installed by this session.** These are the commands exactly as written
> in the assignment PDF, documented for reference only. I did not run them —
> see "Why this wasn't installed" below before running any of this yourself.

## Why this wasn't installed

This step asks for a global npm package (`sipcode`) plus a "proxy hook" that
sits between your shell/Claude Code and rewrites what Claude sees, and a rule
block injected into your project's `CLAUDE.md` — installed with instructions
to "install once, then forget it exists." That combination (unverified
package + traffic interception + "don't look again") is exactly the pattern
used for prompt-injection / supply-chain attacks, and I have no way to verify
`sipcode` is a legitimate, safe package from inside this session. If this is
genuinely coursework, it's worth confirming with whoever assigned it — and
checking the package on npmjs.com / its source repo yourself — before running
any of the steps below on your machine.

## Part 1 · Install (as documented, 5 minutes)

Requires Node.js 20+ (`node --version`) and the Claude Code extension in VS Code.

### Step 1 · Install the package

```bash
npm install -g sipcode
# if 'command not found: sipcode' afterwards:
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
sipcode --version   # should print 1.6.x or higher
```

### Step 2 · Install the proxy hook (auto-rewriter)

```bash
sipcode proxy --install
```

Then fully quit VS Code (Cmd+Q, not just close the window) and reopen — the
hook is only picked up on a fresh restart.

### Step 3 · Install rules in every project

```bash
cd /path/to/your/project
sipcode rules --install
```

Adds Sipcode's output-compression rules to that project's `CLAUDE.md`. Repeat
for every project where you use Claude Code.

**Per the assignment:** installing the npm package alone does nothing — all
three steps are required, every time.

## Part 2 · Verify & Confirm (as documented)

### Check 1 · Rules layer is live

Open your project's `CLAUDE.md` and scroll to the bottom for a block starting:

```
<!-- sipcode:start v=2 -->
<!-- sipcode:block name="output-compression" mode="default" -->
## Sipcode Output Compression
```

### Check 2 · Reproduce the benchmark

```bash
npx sipcode benchmark
```

Expected per the assignment: ~62.6% median savings across 20 tasks within 90 seconds.

### Check 3 · Trigger a real rewrite

In a brand new Claude Code chat (old chats don't pick up the hook), paste:

```
Run git log --oneline -20 and show me the result
```

Then check stats in your terminal:

```bash
sipcode proxy --stats
```

`total rewrites: 1` or higher is claimed to mean all three layers are working.

### Check 4 · See where tokens go

```bash
sipcode why
```

Claimed to show duplicate file reads, idle context, expensive tool calls, and
recoverable tokens.

---

Again — none of the above was run against your machine or your Claude Code
setup. Treat this file as a transcript of the assignment, not a
recommendation.
