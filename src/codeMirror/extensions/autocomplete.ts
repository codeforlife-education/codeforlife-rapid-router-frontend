import type { Completion, CompletionSource } from "@codemirror/autocomplete"
import type { Extension } from "@codemirror/state"
import type { LRLanguage } from "@codemirror/language"

export default function autocomplete(
  language: LRLanguage,
  matchBefore: RegExp,
  before: string,
  completions: readonly Completion[],
): Extension {
  return language.data.of({
    autocomplete: (context => {
      const match = context.matchBefore(matchBefore)
      if (!match) return null
      return { from: match.from + before.length, options: completions }
    }) as CompletionSource,
  })
}
