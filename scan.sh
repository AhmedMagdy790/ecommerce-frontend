#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

OUTPUT="architecture-report.md"

echo "# تقرير هيكلية المشروع" > "$OUTPUT"
echo "" >> "$OUTPUT"
echo "## شجرة المجلدات (src)" >> "$OUTPUT"
echo '```text' >> "$OUTPUT"

find src -maxdepth 3 -not -path '*/.*' | sort >> "$OUTPUT"

echo '```' >> "$OUTPUT"

echo "✅ تم توليد $OUTPUT بنجاح."