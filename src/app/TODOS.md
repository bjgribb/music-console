# TODOs

- [ ] Think about creating a custom validator to validate against whitespace
- [ ] Implement light/dark mode toggle component and wire to body theme class
- [x] Handle single-result display in seed search — the auto-fit grid looks awkward when only 1 track is returned (e.g. try "dreamsdreamsdreams"). Decide whether to constrain max columns, centre the card, or use a different layout for sparse results.
- [ ] Handle the ReccoBeats API "track not found" case when lookup by Spotify UUID returns no match.
- [ ] Investigate using recommendation `href` as the primary Spotify track lookup key, with ISRC as fallback when href is missing or cannot be parsed.
- [ ] Create a separate `.instructions.md` file for `*.spec.ts` test conventions.
- [ ] If icon usage grows beyond a few one-offs, add Heroicons for consistency and easier maintenance.
