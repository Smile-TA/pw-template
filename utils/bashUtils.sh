#!/bin/bash

# Converts input json array into markdown bullet list. Useful when pasting as markdown into Google docs.
echo '[]' | jq -r '.[] | "- \(.)"'