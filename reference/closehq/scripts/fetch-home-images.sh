#!/usr/bin/env bash
# Downloads the generated Dubai home-card images into public/images/home/ so the
# app serves them from its own domain instead of the generation CDN.
#
# Run locally (the cloud build env blocks this CDN host):
#   bash scripts/fetch-home-images.sh
# then commit public/images/home/*.png and switch app/(portal)/page.tsx to the
# local paths (see the LOCAL_IMAGES note there).
set -euo pipefail

BASE="https://d8j0ntlcm91z4.cloudfront.net/user_373qi3JTSvYmXjqMPJT9idOjFt7"
OUT="public/images/home"
mkdir -p "$OUT"

curl -fSL "$BASE/hf_20260616_222225_d0f4e2b8-36a6-46aa-9625-324f1714414c.png" -o "$OUT/buy.png"
curl -fSL "$BASE/hf_20260616_222230_e9003974-fd28-47cb-9667-44b1485ce165.png" -o "$OUT/sell.png"
curl -fSL "$BASE/hf_20260616_222236_b69f84e1-cbcb-452d-841d-63c07a0ada81.png" -o "$OUT/close.png"

echo "Saved buy.png / sell.png / close.png to $OUT"
