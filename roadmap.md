# Document layout optimization
- [x] Replace the fixed resource-page HTML parser with direct JSX.
- [ ] Simplify legacy document-list layouts without changing class menus or appearance.
- [ ] Verify document browsing, filtering, and viewing on desktop and phone, and run relevant tests.

# Old-page indexing fixes
- [x] Add permanent redirects for confirmed duplicate menus, aliases, and empty class lists.
- [x] Match legacy document-reader links to exact catalog documents; keep unknown files as real 404s.
- [x] Exclude redirected pages from the sitemap and verify clean canonical addresses.
- [x] Test redirects, document destinations, and phone/desktop browsing.
- [ ] Deploy changes to the existing GitHub Pages site (requires access outside this project).
