#!/bin/bash

# Converts input json array into markdown bullet list. Useful when pasting as markdown into Google docs.
echo 'arr' | jq -r '.[] | "- Page \(.pageSrc) has images with large file sizes at these file sources:\n" + (.fileSrc | map("  - " + .) | join("\n"))' | pbcopy