#!/bin/bash

# Converts input json array into markdown bullet list. Useful when pasting as markdown into Google docs.
echo 'INPUT_ARRAY' | jq -r '.[] | "- \(. )"' | pbcopy

# Converts image file sources with large file sizes into markdown bullet list.
cat ./summaries/image-summary.json | jq -r '.[] | "- Page \(.pageSrc) has images with large file sizes at these file sources:\n" + (.fileSrc | map("  - \(.url) (\(.size) kB)") | join("\n"))' | pbcopy