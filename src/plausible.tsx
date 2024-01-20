function hasPlausible() {
  return __PLAUSIBLE_DOMAIN__ !== null && __PLAUSIBLE_SCRIPT__ !== null;
}

function ensurePlausible() {
  const plausibleDomain = __PLAUSIBLE_DOMAIN__;
  const plausibleScript = __PLAUSIBLE_SCRIPT__;

  if (document.getElementById('plausible')) {
    // already added plausible script to DOM
    return;
  }

  if (plausibleDomain === null || plausibleScript === null || !hasPlausible()) {
    // plausible not configured
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.setAttribute('data-domain', plausibleDomain);
  script.src = plausibleScript;
  script.id = 'plausible';
  document.head.appendChild(script);
}

export { ensurePlausible, hasPlausible };
