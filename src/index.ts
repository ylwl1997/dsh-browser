import type { Context } from '@deepseek-ai/cordis';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { execFileSync } from 'node:child_process';

export const name = 'dsh-browser';
export const inject = ['tools'];

// Lazily-managed bsk session id.
let sessionId: string | null = null;

function run(args: string[]): string {
  if (!sessionId) {
    // Start a bsk session on first use.
    sessionId = execFileSync('bsk', ['session', 'start'], { encoding: 'utf-8' }).trim().split('\n').pop()!.trim();
  }
  const out = execFileSync('bsk', [...args, '--session', sessionId], { encoding: 'utf-8', maxBuffer: 4 * 1024 * 1024 });
  // Drop the update-notice line if present.
  return out.split('\n').filter((l: string) => !l.startsWith('A new bsk version')).join('\n').trim();
}

function text(v: string) {
  return [{ type: 'text' as const, text: v }];
}

function err(v: unknown): string {
  return 'bsk error: ' + String(v);
}

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'browse_navigate',
    description: 'Navigate the user\'s real browser to a URL.',
    parameters: {
      url: { type: 'string', required: true, description: 'Full URL to navigate to' },
    },
    output: { schema: { type: 'string' }, render: (_a: any, v: string) => text(v) },
    async execute(args: any) {
      try { return run(['navigate', args.url]); } catch (e) { return err(e); }
    },
  }));

  ctx.tools.register(defineTool({
    name: 'browse_snapshot',
    description: 'Read the current page as an accessibility tree (with @eN refs). Use this before clicking or filling.',
    parameters: {},
    output: { schema: { type: 'string' }, render: (_a: any, v: string) => text(v) },
    async execute() {
      try { return run(['snapshot']); } catch (e) { return err(e); }
    },
  }));

  ctx.tools.register(defineTool({
    name: 'browse_click',
    description: 'Click an element by its @eN ref (from browse_snapshot) or a CSS selector.',
    parameters: {
      ref: { type: 'string', required: true, description: 'Element ref like @e3, or a CSS selector' },
    },
    output: { schema: { type: 'string' }, render: (_a: any, v: string) => text(v) },
    async execute(args: any) {
      try { return run(['click', args.ref]); } catch (e) { return err(e); }
    },
  }));

  ctx.tools.register(defineTool({
    name: 'browse_fill',
    description: 'Clear and type text into an input/textarea by its @eN ref or CSS selector.',
    parameters: {
      ref: { type: 'string', required: true, description: 'Element ref like @e3, or a CSS selector' },
      value: { type: 'string', required: true, description: 'Text to type' },
    },
    output: { schema: { type: 'string' }, render: (_a: any, v: string) => text(v) },
    async execute(args: any) {
      try { return run(['fill', args.ref, '--value', args.value]); } catch (e) { return err(e); }
    },
  }));

  ctx.tools.register(defineTool({
    name: 'browse_screenshot',
    description: 'Capture a screenshot of the current page (PNG path).',
    parameters: {},
    output: { schema: { type: 'string' }, render: (_a: any, v: string) => text(v) },
    async execute() {
      try { return run(['screenshot']); } catch (e) { return err(e); }
    },
  }));

  ctx.tools.register(defineTool({
    name: 'browse_observe',
    description: 'Semantic VOM observation of the current page (may reveal hover/focus surfaces).',
    parameters: {},
    output: { schema: { type: 'string' }, render: (_a: any, v: string) => text(v) },
    async execute() {
      try { return run(['observe']); } catch (e) { return err(e); }
    },
  }));
}
