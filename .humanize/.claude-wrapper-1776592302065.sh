#!/bin/sh
cd '/app/workspaces/cbf5e32a-a9da-482d-afb2-48d2cad2cbeb' || exit 1
exec 'claude' '--dangerously-skip-permissions' '--print' '/humanize:start-rlcr-loop docs/plan.md --max 10 --yolo --codex-model gpt-5:high --full-review-round 5 --track-plan-file --push-every-round'
