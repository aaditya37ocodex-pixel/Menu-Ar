export function isGrokEmbedderOrigin(_origin: string | null | undefined) {
  return false;
}

export function isSandboxPreviewGuestHost(hostname: string | null | undefined) {
  return Boolean(hostname?.endsWith(".grok-sandbox.com"));
}

export function resolveParentEmbedderOrigin(
  isTopLevel: boolean,
  _referrer?: string | null,
  _ancestorOrigin?: string | null,
  _hostname?: string | null,
) {
  if (isTopLevel) return null;
  return null;
}
